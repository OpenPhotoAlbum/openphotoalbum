import { inspect } from "util";
import Media from "./dist/index.cjs";
import fs, { promises } from 'fs'
import path from 'path';
import { resolve } from 'path';
import mime from "mime";
import { readdir } from 'fs/promises'

const DEFAULT_SCAN_DIR = '/home/uploads';

const blacklist_doesnt_start_with = [
    // '/home/uploads/cayce',
    // '/home/uploads/stephen/'
    // '/home/uploads/cayce/iPhone/Recents',
    // '/home/uploads/google/cayce',
    // '/home/uploads/google/stephen-iphone'
]

console.log({
    SCANNING_DIR: process.env.SCAN_DIR || DEFAULT_SCAN_DIR,
    BLACKLISTED: blacklist_doesnt_start_with
})

const blacklist = f => blacklist_doesnt_start_with.map(i => !f.startsWith(i)).every(a => a)

const run = (fileToScan) => {
    return new Promise((resolve, reject) => {
        const output_base_dir = `${path.parse(fileToScan).dir}/scans`;
        const json_file = `${output_base_dir}/${path.parse(fileToScan).base}.json`

        try {
            const media = new Media({ path: fileToScan })

            media.exportAllData({
                dir: output_base_dir,
                extractFaces: true,
                jsonfile: json_file
            }).then((d) => {
                const recognized = d.faces.recognized.map(r => r.image);
                const detected = d.faces.detected.map(r => r.image);
                resolve({ recognized, detected })
            })
        } catch (e) {
            console.error(json_file, e)
            reject({ FAILED: { image: fileToScan, error: e }})
        }
    })
};

async function* getFiles(dir) {
    const dirents = await promises.readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
        const res = resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            yield* getFiles(res);
        } else {
            yield res;
        }
    }
}

const main = async () => {
    const base_scan_dir = process.env.SCAN_DIR;
    const getDirectories = async source =>
      (await readdir(source, { withFileTypes: true }))
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

    const dirs = await getDirectories(base_scan_dir);

    for (const d of dirs) {
        const files = []
        let total_files = 0;

        for await (const f of getFiles(base_scan_dir + '/' + d)) {
            total_files++;
            const mt = mime.getType(f);
            if (mt && (mt.includes('image')) && !mt.includes('image/heic') && !f.includes('/scans/')) {
                files.push(f)
            }
        }

        const numFilesToScan = files.filter(blacklist).length;

        const groupedFiles = files.filter(blacklist).reduce((acc, cur) => {
            if (!acc[path.parse(cur).dir]) {
                acc[path.parse(cur).dir] = [cur]
            } else {
                acc[path.parse(cur).dir].push(cur)
            }
    
            return acc;
        }, {});
        
        
        const chunk = (arr, size) =>
        Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
        );

        let completed_count = 0;
        const average_times = [];

        for (const file of Object.keys(groupedFiles)) {            
            const groupsOfFiles = groupedFiles[file].filter(f => {
                const output_base_dir = `${path.parse(f).dir}/scans`;
                const json_file = `${output_base_dir}/${path.parse(f).base}.json`
                const scan_file_exists = fs.existsSync(json_file);
                return !scan_file_exists
            });
            // x1  = [4.103, 11.231, 7.091, 3.914, 4.150]
            // x5  = [8.222, 7.420, 8.613]
            // x10 = [15.430, 14.059, 10.389]

            const batch = 5;
            const chunkedFiles = chunk(groupsOfFiles, batch);
            for await (const a of chunkedFiles) {
                const start = Date.now()
                const contents = await Promise.all(a.map(i => run(i)));
                const end = Date.now()
                completed_count += batch;

                const time_for_one = (end - start)/1000/batch;
                average_times.push(time_for_one);
                const overall_avg_per = average_times.reduce((a,c) => a + c, 0) / average_times.length;
                const num_left = numFilesToScan - completed_count;
                const seconds_remaining = (num_left / overall_avg_per);

                contents.forEach(({ recognized, detected }) => {
                    if (detected.length > 0 && recognized.length > 0) {
                        recognized.forEach(s => console.log(`Recognized: ${s}`))
                        detected.forEach(s => console.log(`Detected: ${s}`))
                    } else if (detected.length > 0) {
                        detected.forEach(s => console.log(`Detected: ${s}`))
                    } else if (recognized.length > 0) {
                        recognized.forEach(s => console.log(`Recognized: ${s}`))
                    }
                })

                console.log('REMAINING: ' + new Date(seconds_remaining * 1000).toISOString().slice(11, 19) + ' (' + `${completed_count}/${files.length}` + ')')
            }
        }
    }
}

main();
