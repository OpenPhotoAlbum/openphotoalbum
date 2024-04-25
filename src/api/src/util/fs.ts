import fs, { promises } from "fs";
import path, { resolve } from "path";

export async function* getFiles(dir: string, limit?: number) {
    const _dirents = await promises.readdir(dir, { withFileTypes: true });
    const dirents = limit ? _dirents.slice(0, limit) : _dirents;

    for (const dirent of dirents) {
        const res = resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            yield* getFiles(res, limit);
        } else {
            yield res;
        }
    }
}

export function flatten(lists) {
    return lists.reduce((a, b) => a.concat(b), []);
}

export function getDirectories(srcpath) {
    return fs.readdirSync(srcpath)
        .map(file => path.join(srcpath, file))
        .filter(path => fs.statSync(path).isDirectory());
}

export function getDirectoriesRecursive(srcpath) {
    return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
}
