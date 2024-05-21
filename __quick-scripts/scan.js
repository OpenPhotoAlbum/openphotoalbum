const dotenv = require("dotenv")
const Compreface = require("../@photogate/compreface-sdk")
const Exif = require("../@photogate/media-exif-sdk")
const Fs = require('@supercharge/fs')

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

dotenv.config({ path: '/home/openphoto/config/.env' });

const RECOGNITION_KEY = process.env.COMPREFACE_RECOGNITION_KEY;
const DETECTION_KEY = process.env.COMPREFACE_DETECTION_KEY;
const VERIFCATION_KEY = process.env.COMPREFACE_VERIFCATION_KEY;
const API_URL = process.env.COMPREFACE_API_URL;
const RECOGNITION_URI = process.env.COMPREFACE_RECOGNITION_URI;
const VERIFICATION_URI = process.env.COMPREFACE_VERIFICATION_URI;
const DETECTION_URI = process.env.COMPREFACE_DETECTION_URI;

const successes = [];
const failures = [];

const run = async () => {
	console.log("Running facial recognition...")

    // const media_dir = "/home/uploads/stephen"
    const media_dir = "/home/librephotos/pictures/shared"
    const scan_res_dir = "/home/openphoto/scans"
    const limit = 1

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
        files.push(f.replace(media_dir, ''))
    }
    
    const count = limit || files.length
    let completed = 0

    for (f in files) {
        try {
            const Media = new Exif({ path: `${media_dir}${file}`, strip: false });
            const metadata = await Media.getMetadata();
            const file = files[f]
            const json_file = `${scan_res_dir}${media_dir}${dirname(file)}/${Fs.filename(files[f]).name}.json`

            console.log(file)
            console.log(media_dir)
            console.log(json_file)
            console.log(Fs.filename(files[f]))
            console.log(files[f])
            console.log('\n')
            
            if (metadata.mime.includes('image') || metadata.mime.includes('video')) {
                if (!fs.existsSync(json_file)) {
                    let recog = {}
                    let detec = {}
                    if (metadata.mime.includes('image')) {
                        recog = await Recognition.recognize(file, {
                            face_plugins: ["age", "embedding", "gender", "landmarks"],
                            limit: 1,
                            det_prob_threshold: ".8",
                        });        

                        detec = await Detection.detect(file, {}) 
                    }

                    writeFile(json_file, JSON.stringify({
                        image: `${media_dir}/${files[f]}`,
                        recognition: recog.result,
                        subjects: detec.result,
                        metadata,
                    }), () => {}); 

                    // console.log(inspect({detec}, false, 5, true))    
                    console.log(`${recog.status} - #${f} - ${completed}/${count}`);
                    successes.push(f);
                    completed = completed + 1;
                }
            }
        } catch (e) {
            completed = completed + 1;
            failures.push(files[f])
        }
        if (completed >= count) {
            break;
        }
    }
    
    console.log({
        failures, successes
    })
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
