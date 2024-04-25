
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

const run = async () => {
    const scan_dir = "/home/openphoto/scans"

    
    const files = {}

    for await (const f of getFiles(scan_dir)) {
        if (f.includes('.json')) {
            var obj = JSON.parse(fs.readFileSync(f, 'utf8'));
            if (obj.recognition) {
                for (const o in obj.recognition) {
                    for (const s in obj.recognition[0].subjects) {
                        const sub = obj.recognition[0].subjects[s].subject
                        if (sub && files[sub]) {
                            files[sub].push(obj.image)
                        } else {
                            files[sub] = [obj.image]
                        }
                    }
                }
            }
        }
    }

    const json_file = `/home/openphoto/scans/subjects.json`

    writeFile(json_file, JSON.stringify(files), () => {}); 
}

run()