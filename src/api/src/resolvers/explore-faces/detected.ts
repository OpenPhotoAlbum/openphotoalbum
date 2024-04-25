import path from "path";
import mime from 'mime';
import { Request, Response } from 'express';
import fs from 'fs';
import { getDirectoriesRecursive, getFiles } from "src/util/fs";
import request from 'request-promise';

// TEMPLATE STRINGS
import { copyToClipboardScript } from 'src/templates/js/scripts';
import { inspect } from "util";

const exploreFaces = async (req: Request, res: Response) => {

    const base_scan_dir = '/home/uploads'

    const files = []

    let subjectList = []
    const options = {
        method: "GET",
        url: `http://10.0.0.15:7000/api/v1/recognition/subjects/`,
        headers: {
            "x-api-key": "b8ed9cce-edbb-449a-9fa4-7be06fa72f34",
            "Content-Type": "application/json",
        },
        json: true
    };

    try {
        const { subjects } = await request(options);
        subjectList = subjects;
    } catch (e) {

    }

    for await (const f of getFiles(base_scan_dir)) {
        if (f.includes('/scans/') && f.includes('.json')) {
            files.push(f)
        }
    }

    // 
    const groupedFilesWithData = files.reduce((acc, jsonfile, i) => {
        // if (i > 100) return acc;
        let jsonMetaData, groupName, img;

        try {
            jsonMetaData = JSON.parse(fs.readFileSync(jsonfile, 'utf8'));
            img = jsonMetaData.exif.SourceFile;
            // console.log(inspect(jsonMetaData.exif, true, 0))
            groupName = path.parse(img).dir;
        } catch (e) {
            // console.log(e)
            return acc;
        }

        if (!acc) acc = {};
        if (!acc[groupName]) acc[groupName] = []

        acc[groupName].push({
            groupName,
            data: jsonMetaData,
            file: jsonfile
        })

        return acc;
    }, {})

    const getImageTag = (data) => {
        const { image: _image } = data;
        const image = _image.replace('//', '/');

        return `
            <div class="subject_image">
                <div    
                    class="subject_image_container"
                    style="background-image: url('${image}');"
                    title="${image}"
                    onclick="copyToClipboard('${image}')"
                ></div>
            </div>
        `;
    }

    const generateGroupTags = (list) => {
        let tags = '';
        tags += `<h2 class="group-header">${list[0].groupName} (${list.length})</h2>`;

        const renderData = (d): string => {
            let markup = '';
            for (const { data } of d) {
                const detectedSubjects = data.faces.detected;
                for (const s of detectedSubjects) {
                    markup += `
                        <label>
                            <input
                                value="${s.image.replace('//', '/')}"
                                type="checkbox"
                                hidden="true"
                                class="subject_checkbox"
                                name="subject"
                            />
                            ${getImageTag(s)}
                        </label>
                    `
                }
            }
            return markup;
        }
        tags += renderData(list)
        return tags;
    }

    const generateImageTags = () => {
        let markup = '';
        for (const group of Object.keys(groupedFilesWithData)) {
            const formHeader = `
                <form onsubmit="handleDetectionSubmit(event)" >
                    <header>
                        <select id="subjectSelect" onchange="handleselectchange(this)">
                            <option hidden value="">Select Subject</option>
                            ${subjectList.map(s => `<option value="${s}">${s.replace('_', ' ')}</option>`)}
                        </select>
                        <input type="submit" value="SAVE SUBJECT" /><br/>
                    </header>
                    </br>
                    </br>
                    </br>
            `;
            markup += formHeader;
            markup += generateGroupTags(groupedFilesWithData[group]);
            markup += `</form>`;
        }

        return markup;
    }

    res.send(`
    <html>
        <head>
            <script>${copyToClipboardScript}</script>
            <script>
                window.subject_id = null;

                const handleselectchange = event => {
                    window.subject_id = event.value;
                }

                const handleDetectionSubmit = (event) => {
                    event.preventDefault();
                    const checkedSubjects = [...document.getElementsByClassName('subject_checkbox')]
                        .filter(e => e.checked)
                        .map(e => e.value);
                    console.log({checkedSubjects, id: window.subject_id})
                    if (!checkedSubjects || !window.subject_id) {
                        alert('failed');
                        return;
                    }
                    var http = new XMLHttpRequest();
                    http.open('POST', '/add_many/' +  window.subject_id, true);
                    http.setRequestHeader('Content-Type', 'application/json');
                    const data = checkedSubjects.map(s => 'img=' + encodeURIComponent(s)).join('&');
                    console.log({subject_id: window.subject_id, checkedSubjects, data})
                    http.send(checkedSubjects);
                }
            </script>
            <style type="text/css">
                input.subject_checkbox:checked  + .subject_image {
                    outline: solid 4px #515198;
                }
                
                header {
                    background: #fff;
                    position: sticky;
                    top: 0;
                    width: 100%;
                    padding: 4px;
                }

                .group-header {
                    font-size: 18px;
                    border-bottom: solid 1px;
                }

                .subject_image_container {
                    background-position: center center;
                    background-repeat: no-repeat;
                    background-size: contain;
                    display: block;
                    width: 100px;
                    height: 100px; 
                }

                .subject_image {
                    display: inline-block;
                    border: solid 1px #d4d4d4;
                    text-align: center;
                    padding: 2px;
                    box-sizing: border-box;
                    margin: 1px;
                }
                
            </style>
        </head>
        <body>${generateImageTags()}</body>
    </html>
    `)
};

export default exploreFaces;