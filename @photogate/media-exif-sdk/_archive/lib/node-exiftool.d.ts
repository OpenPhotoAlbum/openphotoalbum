declare module "node-exiftool";

declare class ExifToolProcess {
	public open(): unknown;
	public close(): unknown;
	public readMetadata<T>(path: string, args: string[]): Promise<{ data: T[] }>;
}

declare class ExifTool {
	constructor(arg: string);
	public ExiftoolProcess(key: string): ExifToolProcess;
}
