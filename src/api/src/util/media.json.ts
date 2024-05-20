import fs, { promises } from "fs";
import path, { resolve } from "path";
import { ImagePath, ScanJsonPath, scanJsonPath } from "src/lib/media.types";

const SCAN_DIRECTORY_NAME = 'scans';

export function findJsonFromImagePath(image: ImagePath): ScanJsonPath {
    const directory = path.dirname(image);
    const filename = path.parse(image).base;
    const jsonFile = scanJsonPath(`${directory}/${SCAN_DIRECTORY_NAME}/${filename}.json`);
    return jsonFile;
}
