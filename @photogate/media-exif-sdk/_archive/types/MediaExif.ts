import { Mode, ObjectEncodingOptions, OpenMode } from "fs";
import { OutputInfo } from "sharp";
import { Abortable } from "events";
import { ExifData, MimeTypes } from "@photogate/types";

export interface Config {
	path: string;
	strip: boolean;
}

export type Crop = { left: number; top: number; height: number; width: number };
export type CropBox = [number, number, number, number];

export type Output = Partial<OutputInfo> & {
	path: string;
	directory: string;
	fileName: string;
	mime: MimeTypes;
	size: number;
	width: number;
	height: number;
	metadata: ExifData;
	dominantColor: string;
	buffer?: Buffer;
	thumbnail?: Buffer;
	format?: string;
	premultiplied?: boolean;
	channels?: 1 | 2 | 3 | 4;
};

export type Resize = {
	height?: number;
	width?: number;
	fit?: "cover" | "contain" | "fill" | "inside" | "outside";
};

export type StandardCopyOptions = ObjectEncodingOptions & {
	mode?: Mode | undefined;
	flag?: OpenMode | undefined;
} & Abortable;

export type CopyOptions = StandardCopyOptions | BufferEncoding | null;

export declare class ExifToolProcess {
	public open(): unknown;
	public close(): unknown;
	public readMetadata<T>(path: string, args: string[]): Promise<{ data: T[] }>;
}
