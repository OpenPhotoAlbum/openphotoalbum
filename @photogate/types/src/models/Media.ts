import { ValueRef } from "../util";
import { Album } from "./Album";
import type { Geolocation } from "./Geo";
import { Gps } from "./Gps";
import { MimeTypes } from "./Mime";
import { Output, RawOrientationRef } from "@photogate/media-exif-sdk";

export interface Media extends Output {
	id: number;
	favorite: boolean;
	user: MediaUploader;
	geolocation?: Geolocation | null;
	albums?: Album[];
	/* Output \/ */
	// path: string;
	// directory: string;
	// fileName: string;
	// mime: MimeTypes;
	// buffer?: Buffer | undefined;
	// thumbnail?: Buffer | undefined;
	// format: string;
	// size: number;
	// width: number;
	// height: number;
	// metadata: ExifData;
}

export interface ExifData {
	_version?: string; // '0232',
	uuid?: string; // "ad18cf02848cb4e50000000000000000";
	contentId?: string; // "CDE49B93-CBDC-417B-8791-A3F0BCE9545A";
	height?: number;
	width?: number;
	mime?: MimeTypes; // 'image/jpeg',
	extension?: string; // 'JPG',
	fileSize?: number; // 594512,
	location?: number[];
	created_on?: string; // YYYY/MM/DD HH:mm:ss ZZ
	modified_on?: string; //
	source?: string; // '/media/uploads/1/920427dc4162845fce485e7f574d34fc-IMG_8341.jpg',
	fileName: string; // img123.jpg
	directory?: string; // '/media/uploads/1',
	sceneType?: ValueRef<number, string>; // 1;
	gps?: Gps;
	subject?: number[]; // '1848 2354 872 873',
	faces?: {
		type?: string;
		areaY?: number;
		areaW?: number;
		areaX?: number;
		areaH?: number;
		height?: number;
		width?: number;
		unit?: string;
	}[];
	details?: {
		imageHeight?: number;
		imageWidth?: number;
		aperture?: number; // 1.8;
		orientation?: Orientation; // 6
		imageSize?: string; // "4032 3024";
		megapixels?: number; // 12.192768;
		shutterSpeed?: number; // 0.008403361345;
		light?: number; // 8.26888348145113;
		colorSpace?: string; // "RGB ";
		xResolution?: number; // 72
		yResolution?: number; // 72
		resolutionUnit?: ValueRef<string, number>; // 2
		ISO?: number; // 25
		fNumber?: number; // 2.2,
		exposure?: {
			time?: number;
			mode?: ValueRef<string, number>;
			program?: ValueRef<string, number>;
		};
		flash?: ValueRef<string, number>; // 10
		focalLength?: number; // 2.71
		brightness?: number; // 8.303837531320058
		sensingMethod?: ValueRef<string, number>; // 2
		whiteBalance?: number; // 0
	};
	device?: {
		make?: string; // 'Apple'
		model?: string; // 'iPhone 11 Pro Max'
		software?: string; // '16.4.1'
		hostComputer?: string; // 'iPhone 11 Pro Max'
		manufacturer?: string; // "APPL";
		lensID?: string; // "iPhone 11 Pro Max back triple camera 4.25mm f/1.8";
		lensInfo?: string; // '1.539999962 6 1.8 2.4',
		lensMake?: string; // 'Apple',
		lensModel?: string; // 'iPhone 11 Pro Max front camera 2.71mm f/2.2'
	};
}

export type VisibilityType = "public" | "private" | "unlisted" | "whitelist";

export type MediaUploader = {
	id: number;
	firstName: string;
	lastName: string;
	profileImage?: string;
};

/**
 *  1) *0 degrees*: - The correct orientation, no adjustment is required
 *  2) *0 degrees*: - Mirrored: image has been flipped back-to-front
 *  3) *180 degrees*: - Image is upside down.
 *  4) *180 degrees*: - Mirrored: image has been flipped back-to-front and is upside down.
 *  5) *90 degrees*: - Image has been flipped back-to-front and is on its side.
 *  6) *90 degrees*: - Mirrored: image is on its side.
 *  7) *270 degrees*: - Image has been flipped back-to-front and is on its far side.
 *  8) *270 degrees*: - Mirrored: image is on its far side.
 */
export type Orientation = {
	value?: RawOrientationRef;
	degrees?: 0 | 180 | 90 | 270;
	description?: string;
};
