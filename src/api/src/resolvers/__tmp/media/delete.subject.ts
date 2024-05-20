import fs from 'fs';

export const deleteSubjectDetection = async (body) => {
    try {
        let successes = [];
        let failures = [];
        for (let _body in body) {
            try {
                const [jsonfile, imgs] = body[_body];

                for (let image in imgs) {
                    const subjectImage = imgs[image];
                    const jsondata = JSON.parse(fs.readFileSync(jsonfile, 'utf8'))
                    const detections = jsondata.faces.detected;
                    const detectedMatch = detections.findIndex(d => d.image === subjectImage)
                    let updatedSubject = detections[detectedMatch];
                    if (!updatedSubject) return;
                    let newjsondata = jsondata;

                    newjsondata.faces.detected.splice(detectedMatch, 1)

                    fs.writeFileSync(jsonfile, JSON.stringify(newjsondata));
                    successes.push(subjectImage)
                }
            } catch (e) {
                // console.error(e);
                // failures.push(subjects[subject].image)
            }
        }
        return { successes, failures };
    } catch (e) {
        throw new Error(e);
    }
}