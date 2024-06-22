import fs from "fs";
import path from "path";
import Logger from "src/Logger";

const logger = new Logger('Scan.resolvers.ts');

export function* readAllFiles(
    dir: string,
    match: RegExp = new RegExp('*'),
    check: (arg: string) => boolean = () => true
): Generator<string> {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        if (file.isDirectory()) {
            yield* readAllFiles(path.join(dir, file.name), match, check);
        } else {

            if (!check(path.join(dir, file.name))) {
                continue;
            }

            // TODO: Fix this regex, for some reason case-insensitive flag is not working
            if (new RegExp(/(.jpg|.png|.gif|.jpeg|.heic|.mov|.mp4|.tif|.tiff|.cr2|.dng|.mkv|.3gp|.webp|.m4v|.jpx)$/gim).test(file.name)) {
                yield path.join(dir, file.name);
            } else {
                if (new RegExp(/(.json|.bash_logout|.bashrc|.profile)$/gim).test(file.name)) {
                    continue;
                } else {
                    logger.record('scan-skip', `${file.name}`);
                }
            }

        }
    }
}

export function* readAllDirectories(dir: string, expand = false): Generator<string> {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        if (file.isDirectory()) {
            yield path.join(dir, file.name);

            if (expand) {
                yield* readAllDirectories(path.join(dir, file.name), expand);
            }
        }
    }
}

export function* take<T>(input: Generator<T>, count: number): Generator<T> {
    for (let i = 0; i < count; i++) {
        const result = input.next();
        if (result.done) {
            return;
        }
        yield result.value;
    }
}

export function* offset<T>(input: Generator<T>, count: number): Generator<T> {
    for (let i = 0; i < count; i++) {
        const result = input.next();
        if (result.done) {
            return;
        }
    }
    yield* input;
}
