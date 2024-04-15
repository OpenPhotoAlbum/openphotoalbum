const dotenv = require("dotenv")
const Compreface = require("./@photogate/compreface-sdk")
const { promises } = require("fs");
const { inspect } = require("util");
const fs = require('fs');
const { resolve, parse, dirname } = require('path');
const { readdir } = require('fs').promises;

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

function writeFile(path, contents, cb) {
    fs.mkdir(dirname(path), { recursive: true}, function (err) {
        if (err) return cb(err);

        fs.writeFile(path, contents, cb);
    });
}

dotenv.config({ path: '/home/openphoto/config/.env.local' });

const RECOGNITION_KEY = process.env.COMPREFACE_RECOGNITION_KEY;
const DETECTION_KEY = process.env.COMPREFACE_DETECTION_KEY;
const VERIFCATION_KEY = process.env.COMPREFACE_VERIFCATION_KEY;
const API_URL = process.env.COMPREFACE_API_URL;
const RECOGNITION_URI = process.env.COMPREFACE_RECOGNITION_URI;
const VERIFICATION_URI = process.env.COMPREFACE_VERIFICATION_URI;
const DETECTION_URI = process.env.COMPREFACE_DETECTION_URI;

const run = async () => {
	console.log("Running facial recognition...")

    const media_dir = "/home/uploads/stephen/"

	const compreConfig = {
		api_url: API_URL,
		recognition_key: RECOGNITION_KEY,
		verification_key: VERIFCATION_KEY,
		detection_key: DETECTION_KEY,
		recognition_uri: RECOGNITION_URI,
		verification_uri: VERIFICATION_URI,
		detection_uri: DETECTION_URI,
		imageBasePath: media_dir,
	};

	const Compre = new Compreface(compreConfig);

	const Recognition = Compre.initRecognitionService();
	const Detection = Compre.initDetectionService();
	const Verification = Compre.initVerificationService();

    const files = []

    for await (const f of getFiles(media_dir)) {
        if (f.includes('.JPG')) {
            files.push(f.replace('/home/uploads/stephen', ''))
        }
    }
    
    for (f in files.slice(0,5)) {
        const file = files[f]
        const json_file = `/home/openphoto/scans/stephen${dirname(file)}/${parse(files[f]).name}.json`
        // if (!fs.existsSync(json_file)) {
            
        // }
        const recog = await Recognition.recognize(file, {
            face_plugins: ["age", "embedding", "gender", "landmarks"],
            limit: 1,
            det_prob_threshold: ".8",
        });            

        if (recog.status === 200) {
            data = {
                image: `/home/uploads/stephen${files[f]}`,
                result: recog.result,
            }
            writeFile(json_file, JSON.stringify(data), () => {});
        }     
        const detec = await Detection.detect(file, {}) 
        console.log(inspect({detec}, false, 5, true))    
    }

	// console.log(inspect({recog}, false, 5, true))
	// console.log(inspect({detec}, false, 5, true))

	// await promises.writeFile(
	// 	compreConfig.imageBasePath + file + ".json",
	// 	JSON.stringify(recognizeResults)
	// );

	// const subjects = await Recognition.subjects();

	// console.log(inspect({subjects}, false, 5, true))
	// await Recognition.addSubject("4434");
	//   await Recognition.renameSubject("444", "renamed");
	//   await Recognition.deleteSubject("349");
	//   await Recognition.deleteAllSubjects();
	//   await Recognition.addSubjectExample(
	//     "4434",
	//     "source-d60e439fbc89a1a4244edca655e4b03b-IMG_5039.JPG"
	//   );

	// console.log(inspect(result, false, 5, true));
};

run();
