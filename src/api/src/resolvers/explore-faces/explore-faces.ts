import path from "path";
import mime from 'mime';
import { Request, Response } from 'express';
import fs from 'fs';
import { getDirectoriesRecursive, getFiles } from "src/util/fs";
import request from 'request-promise';

// TEMPLATE STRINGS
import { copyToClipboardScript, generateSelectBoxScript } from 'src/templates/js/scripts';
import { inspect } from "util";

const exploreFaces = async (req: Request, res: Response) => {
    const isOnDetectionsPage = req.url.startsWith('/detections/');
    console.log({ isOnDetectionsPage });

    const base_scan_dir = '/home/uploads/google'
    const allDirectories = getDirectoriesRecursive(base_scan_dir).map(d => d.replace(base_scan_dir, '')).filter(d => {
        if (isOnDetectionsPage) return false;
        return !d.includes('detected')
    });

    const media_dir = `${base_scan_dir}/${req.params[0]}`;

    let subjectList = [];

    if (isOnDetectionsPage) {
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
    }

    // 
    // 
    // 
    const files = []

    for await (const f of getFiles(media_dir)) {
        const mt = mime.getType(f);
        if (mt && (mt.includes('image'))) {
            files.push(f)
            // console.log(f)
        }
    }

    const groupedFilesWithData = files.reduce((acc, img, i) => {
        if (i > 100) return acc;
        const shortImgPath = img.replace(base_scan_dir, '');
        const groupName = path.parse(shortImgPath).dir.replace('/', '');
        const jsonMetaFile = `${base_scan_dir}/${path.parse(shortImgPath).name.split('__')[0]}${path.parse(shortImgPath).ext}.json`;

        if (!acc) acc = {};
        if (!acc[groupName]) acc[groupName] = []

        let jsonMetaData;
        try {
            jsonMetaData = JSON.parse(fs.readFileSync(jsonMetaFile, 'utf8'));
        } catch (e) {
            // console.log(e)
            return acc
        }

        acc[groupName].push({
            data: jsonMetaData,
            imageUrl: img,
            file: jsonMetaFile
        })

        return acc;
    }, {})

    const generateGroupLinks = () => {
        return allDirectories.filter(a => a).map(d => {
            return (`
                <a href="/${isOnDetectionsPage ? 'detections' : 'images'}${d}">${d}</a>
            `)
        })
    }

    const generateGroupTags = (group, _data) => {
        if (isOnDetectionsPage && !group.includes('detected')) return '';
        if (!isOnDetectionsPage && group.includes('detected')) return '';

        let tags = '';
        let listCount = 0;

        if (isOnDetectionsPage) {
            tags += '<form onsubmit="handleDetectionSubmit(event)" >';
            tags += '<select id="subjectSelect">'
            tags += '<option hidden>Select Subject</option>'
            tags += subjectList.map(s => `<option value="${s}">${s.replace('_', ' ')}</option>`)
            tags += '</select>'
            tags += '<input type="submit" value="SAVE SUBJECT" /><br/>'
        };

        for (const _d of _data) {
            const { imageUrl: img, data, file } = _d;

            const recognizedFaceTags = () => {
                const matchedRecognizedIndex = data.faces.recognized.findIndex(d => d.image.replace('//', '/') === img)
                const match = data.faces.recognized[matchedRecognizedIndex];
                const isVerified = match?.isVerified;
                const isPerfectMatch = match?.subject.similarity === 1;

                const notVerifiedOrPerfect = !isVerified && !match?.vendor_image_id && !isPerfectMatch && matchedRecognizedIndex >= 0;

                const getImageTags = (btns: string) => {
                    let imageTags = ''

                    const imageTag = `
                    <div    
                        class="subject_image_container"
                        style="background-image: url('${img}');"
                        title="${img}"
                        onclick="copyToClipboard('${img}')"
                    ></div>
                    `;

                    imageTags += `
                    <div class="subject_image">`;

                    imageTags += imageTag;
                    imageTags += btns;
                    imageTags += `</div>`;
                    return imageTags;
                }

                if (isOnDetectionsPage) {
                    tags += '<label>';
                    tags += `<input value="${img}" type="checkbox" hidden="true" class="subject_checkbox" name="subject" />`;
                    tags += getImageTags('');
                    tags += '</label>';
                    listCount++;

                } else if (notVerifiedOrPerfect) {
                    let recognizedButtons = ''
                    recognizedButtons += `<button onclick="var http = new XMLHttpRequest(); http.open('GET', '/rm${img}', true); http.send();" style="background: #ffdede; border: solid 1px #000;">REMOVE</button>`;
                    recognizedButtons += `<button onclick="var http = new XMLHttpRequest(); http.open('GET', '/set${img}', true); http.send();">ADD</button>`;
                    tags += getImageTags(recognizedButtons);
                    // tags += `<p>${file}</p>`
                    listCount++;
                }
            }

            recognizedFaceTags()
        }

        if (isOnDetectionsPage) {
            tags += '</form>'
        }

        tags = `<div><h2>${group} (${listCount})</h2>` + tags;
        tags += '</div>';
        return tags;
    }

    const generateImageTags = () => {
        let markup = '';

        markup += generateGroupLinks();

        for (const group of Object.keys(groupedFilesWithData)) {
            markup += generateGroupTags(group, groupedFilesWithData[group]);
        }

        return markup;
    }

    res.send(`
    <html>
        <head>
            <script>${copyToClipboardScript}</script>
            <script>${generateSelectBoxScript}</script>
            <script>
                const handleDetectionSubmit = (event) => {
                    event.preventDefault();
                    const checkedSubjects = [...event.target.elements]
                        .filter(e => e.className === 'subject_checkbox' && e.checked)
                        .map(e => e.value);
                    const subject_id = document.getElementById('subjectSelect').value;
                    var http = new XMLHttpRequest();
                    http.open('POST', '/add_many/' +  subject_id, true);
                    http.setRequestHeader('Content-Type', 'application/json');
                    const data = checkedSubjects.map(s => 'img=' + encodeURIComponent(s)).join('&');
                    console.log({subject_id, checkedSubjects, data})
                    http.send(checkedSubjects);
                }
            </script>
            <style type="text/css">
                input.subject_checkbox:checked  + .subject_image {
                    outline: solid 4px #515198;
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