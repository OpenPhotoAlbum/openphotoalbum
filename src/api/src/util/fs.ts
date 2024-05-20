import fs from "fs";
import path from "path";

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
            if (!match.test(file.name)) continue;

            if (!check(path.join(dir, file.name))) {
                continue;
            }
            yield path.join(dir, file.name);
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
