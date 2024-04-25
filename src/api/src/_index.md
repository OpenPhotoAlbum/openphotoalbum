const addSubjectExample = async (subjectId: string, filename: string) => {
const options = {
method: "POST",
url: `http://10.0.0.15:7000/api/v1/recognition/faces?subject=${subjectId}`,
// port: 443,
headers: {
"x-api-key": "b8ed9cce-edbb-449a-9fa4-7be06fa72f34",
"Content-Type": "multipart/form-data",
},
formData: {
"file": fs.createReadStream(filename)
},
json: true
};

    return await request(options);

}

app.get([
"/home/openphoto/@photogate/media-exif-sdk/sample/scans/*",
"/home/uploads/*"
], async (req: Request, res: Response) => {
try {
res.sendFile(req.path)
} catch (e) {
res.status(404).send()
}
})

app.post(["/add_many/:subject_id"], async (req: Request, res: Response) => {
const subject_id = req.params.subject_id;
const subject_images = req.body.split(',')
console.log({ subject_id, subject_images })
async function addSubjects() {
await Promise.all(subject_images.map(async (img) => {
const c = path.parse(img).base.substr(0, 'asdfasdf**5**0.jpg'.lastIndexOf('\_\_'));
const jsonMetaFile = `${img.split('/scans/')[0]}/scans/${c}${path.parse(img).ext}.json`;

            let jsonMetaData = JSON.parse(fs.readFileSync(jsonMetaFile, 'utf8'));
            const matchedIndex = jsonMetaData.faces.detected.findIndex(d => d.image.replace('//', '/') === img)
            const newjsonMetaData = jsonMetaData;
            let existingSubject = newjsonMetaData.faces.detected[matchedIndex];

            newjsonMetaData.faces.detected.splice(matchedIndex, 1);

            const new_subject_sample_image = img.replace(
                '/detected',
                `/subjects/${subject_id}`
            );

            console.log({ c, matchedIndex, subject_images, jsonMetaFile, img })

            existingSubject.subject = {
                subject: subject_id,
                similarity: 1,
            }

            existingSubject.image = new_subject_sample_image;
            existingSubject.verified = true;
            existingSubject.vendor_image_id = subject_id;

            newjsonMetaData.faces.recognized.push(existingSubject);
            console.log(inspect(newjsonMetaData, true, 4));
            try {
                const res = await addSubjectExample(subject_id, img)
                if (!fs.existsSync(path.parse(jsonMetaFile).dir)) {
                    fs.mkdirSync(path.parse(jsonMetaFile).dir, { recursive: true })
                }
                fs.renameSync(img, new_subject_sample_image)
                fs.writeFileSync(jsonMetaFile, JSON.stringify(newjsonMetaData));
                console.log({ ...res, jsonMetaFile })
                return 200
            } catch (e) {
                if (e.message.includes('"No face is found in the given image"')) {
                    console.log(`[POTENTIAL ISSUE WITH CROP] ${img} ${jsonMetaFile}`)
                } else {
                    // console.log(e.message)
                }
                console.log(jsonMetaFile)
                // return 400
            }
        }));
    }

    // const addedSubjects = await addSubjects()
    // console.log('DONE', addedSubjects);
    res.status(200).send('ok')

})

app.get([
"/add/home/openphoto/@photogate/media-exif-sdk/sample/scans/*",
"/add/home/uploads/*"
], async (req: Request, res: Response) => {
try {
const subject*id = req.query.subject_id.toString().toLocaleLowerCase().replaceAll(' ', '*') as string;

        const url_base = `/${path.parse(req.path.replace('/add/', '').replace('//', '/')).dir}`;

        const jsonMetaFile = `${url_base.split('/scans/')[0]}/scans/${path.parse(req.path).base.split('__')[0]}${path.parse(req.path).ext}.json`;

        const subject_sample_image = `${url_base}/${path.parse(req.path).base}`

        let jsonMetaData = JSON.parse(fs.readFileSync(jsonMetaFile, 'utf8'));
        const matchedIndex = jsonMetaData.faces.detected.findIndex(d => d.image.replace('//', '/') === subject_sample_image)
        const newjsonMetaData = jsonMetaData;
        let existingSubject = newjsonMetaData.faces.detected[matchedIndex];

        const new_subject_sample_image = url_base.replace(
            '/detected',
            `/subjects/${subject_id}/${path.parse(subject_sample_image).base}`
        );

        newjsonMetaData.faces.detected.splice(matchedIndex, 1);

        existingSubject.subject = {
            subject: subject_id,
            similarity: 1,
        }
        existingSubject.image = new_subject_sample_image;
        existingSubject.verified = true;
        existingSubject.vendor_image_id = subject_id;

        newjsonMetaData.faces.recognized.push(existingSubject);

        try {
            const { image_id, subject } = await addSubjectExample(subject_id, subject_sample_image)
            console.log({ image_id, subject })
            fs.renameSync(subject_sample_image, new_subject_sample_image)
            fs.writeFileSync(jsonMetaFile, JSON.stringify(newjsonMetaData));
            console.log(jsonMetaFile)
            res.status(200).send('ok')
        } catch (e) {
            if (e.message.includes('"No face is found in the given image"')) {
                console.log(`[POTENTIAL ISSUE WITH CROP] ${subject_sample_image} ${jsonMetaFile}`)
            } else {
                console.log(e.message)
            }
            console.log(jsonMetaFile)
            res.status(400).send('failed')
        }
    }
    catch (e) {
        console.error(e);
        res.send('no')
    }

});

app.get([
"/rm/home/openphoto/@photogate/media-exif-sdk/sample/scans/*",
"/rm/home/uploads/*"
], async (req: Request, res: Response) => {
try {
const base_scan_dir = '/home/openphoto/@photogate/media-exif-sdk/sample/scans';
const shortImgPath = req.path.replace(base_scan_dir, '');
const jsonMetaFile = `${base_scan_dir}/${path.parse(shortImgPath).name.split('__')[0]}.json`;
let jsonMetaData = JSON.parse(fs.readFileSync(jsonMetaFile, 'utf8'));
const filename = `${base_scan_dir}/${shortImgPath.replace('/rm/', '').replace('//', '/')}`
const matchedRecognizedIndex = jsonMetaData.faces.recognized.findIndex(d => d.image.replace('//', '/') === filename)
const newjsonMetaData = jsonMetaData;
newjsonMetaData.faces.recognized.splice(matchedRecognizedIndex, 1);
fs.writeFileSync(jsonMetaFile, JSON.stringify(newjsonMetaData));
fs.unlinkSync(filename)
res.send('ok')
}
catch (e) {
console.error(e);
res.send('no')
}
});

app.get([
"/set/home/openphoto/@photogate/media-exif-sdk/sample/scans/*",
"/set/home/uploads/*"
], async (req: Request, res: Response) => {
const { url, baseUrl, params } = req;

    const base_scan_dir = (url.split('/scans/')[0] + '/scans').replace('/set', '');

    const shortImgPath = req.path.replace(base_scan_dir, '');
    const jsonMetaFile = `${base_scan_dir}/${path.parse(shortImgPath).name.split('__')[0]}.json`;
    let jsonMetaData = JSON.parse(fs.readFileSync(jsonMetaFile, 'utf8'));
    const filename = `${base_scan_dir}/${shortImgPath.replace('/set/', '')}`

    const matchedDetectedIndex = jsonMetaData.faces.detected.findIndex(d => d.image === filename)
    const matchedRecognizedIndex = jsonMetaData.faces.recognized.findIndex(d => d.image.replace('//', '/') === filename)

    let subjectId = '666';
    let vendor_image_id;
    let shouldWrite = false;
    let section;

    if (matchedRecognizedIndex >= 0) {
        section = jsonMetaData.faces.recognized[matchedRecognizedIndex];
        if (section.image.includes('//')) {
            section.image = section.image.replace('//', '/');
            shouldWrite = true;
        }
        section.subject.similarity = 1;
        section.verified = true;
        vendor_image_id = section.vendor_image_id;
        subjectId = section.subject_id;
        jsonMetaData.faces.recognized[matchedRecognizedIndex] = section;
    }

    if (!vendor_image_id) {
        try {
            const { image_id, subject } = await addSubjectExample(subjectId, filename)
            if (image_id) {
                jsonMetaData.faces.recognized[matchedRecognizedIndex].vendor_image_id = image_id;
            }
            fs.writeFileSync(jsonMetaFile, JSON.stringify(jsonMetaData));
            res.send(`Added example ${image_id} to subject: ${subject}`)
        } catch (e) {
            console.error(e.message);
            res.send(e.message)
        }
    } else if (section && shouldWrite) {
        fs.writeFileSync(jsonMetaFile, JSON.stringify(jsonMetaData));
    } else {
        res.send(`already added ${vendor_image_id} photo`);
    }

})

app.get("/images/\*", exploreFaces);

app.get("/detections/\*", detected);
