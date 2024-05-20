import path from "path";
import { Image, ScanJsonPath, scanJsonPath } from "src/types";

const SCAN_DIRECTORY_NAME = 'scans';

export function findJsonFromImagePath(image: Image): ScanJsonPath {
    const directory = path.dirname(image);
    const filename = path.parse(image).base;
    const jsonFile = scanJsonPath(
        `${directory}/${SCAN_DIRECTORY_NAME}/${filename}.json`
    );
    return jsonFile;
}
