import { MimeTypes } from "@photogate/types";

export type RawExifData = RawVideoExifData | RawImageExifData;

export interface RawVideoExifData extends RawImageExifData {
	MajorBrand?: string; // "qt  ";
	MinorVersion?: string; // "0.0.0";
	CompatibleBrands?: string[]; // ["qt  "];
	MediaDataSize?: number; // 4452451;
	MediaDataOffset?: number; // 36;
	MovieHeaderVersion?: number; // 0;
	TimeScale?: number; // 600;
	Duration?: number; // 3.10166666666667;
	PreferredRate?: number; // 1;
	PreferredVolume?: number; // 1;
	PreviewTime?: number; // 0;
	PreviewDuration?: number; // 0;
	PosterTime?: number; // 0;
	SelectionTime?: number; // 0;
	SelectionDuration?: number; // 0;
	CurrentTime?: number; // 0;
	NextTrackID?: number; // 6;
	TrackHeaderVersion?: number; // 0;
	TrackCreateDate?: string; // "2023:06:04 15:49:07";
	TrackModifyDate?: string; // "2023:06:04 15:49:07";
	TrackID?: number; // 1;
	TrackDuration?: number; // 3.10166666666667;
	TrackLayer?: number; // 0;
	TrackVolume?: number; // 0;
	CleanApertureDimensions?: string; // "1744 1308";
	ProductionApertureDimensions?: string; // "1920 1440";
	EncodedPixelsDimensions?: string; // "1920 1440";
	GraphicsMode?: number; // 64;
	OpColor?: string; // "32768 32768 32768";
	CompressorID?: string; // "hvc1";
	SourceImageWidth?: number; // 1920;
	SourceImageHeight?: number; // 1440;
	CompressorName?: string; // "HEVC";
	BitDepth?: number; // 24;
	VideoFrameRate?: number; // 27.7748553392951;
	Balance?: number; // 0;
	AudioFormat?: string; //  "lpcm";
	AudioChannels?: number; // 3;
	AudioBitsPerSample?: number; // 16;
	AudioSampleRate?: number; // 1;
	MatrixStructure?: string; // "1 0 0 0 1 0 0 0 1";
	ContentDescribes?: number; // 1;
	MediaHeaderVersion?: number; // 0;
	MediaCreateDate?: string; // "2023:06:04 15:49:07";
	MediaModifyDate?: string; // "2023:06:04 15:49:07";
	MediaTimeScale?: number; // 600;
	MediaDuration?: number; // 3.10166666666667;
	MediaLanguageCode?: string; // "und";
	GenMediaVersion?: number; // 0;
	GenFlags?: string; // "0 0 0";
	GenGraphicsMode?: number; // 64;
	GenOpColor?: string; // "32768 32768 32768";
	GenBalance?: number; // 0;
	HandlerClass?: string; // "dhlr";
	HandlerVendorID?: string; // "appl";
	HandlerDescription?: string; // "Core Media Data Handler";
	MetaFormat?: string; // "mebx";
	HandlerType?: string; // "mdta";
	LocationAccuracyHorizontal?: number; // 35;
	LivePhotoAuto?: number; // 1;
	LivePhotoVitalityScore?: number; // 1;
	LivePhotoVitalityScoringVersion?: number; // 4;
	GPSCoordinates?: string; // "42.8165 -71.0638 53.811";
	CreationDate?: string; // "2023:06:04 11:49:05-04:00";
	AvgBitrate?: number; // 11484022;
	Rotation?: number; // 90;
	AndroidVersion: number; // 13,
	ColorRepresentation: number; // 'nclx 1 1 1',
}

export interface RawImageExifData extends RawSharedExif {
	ExifImageWidth?: number; // 4032;
	ExifImageHeight?: number; // 3024;
	ExifVersion?: string; // '0232',
	OffsetTime?: string; // '-04:00',
	DateTimeOriginal?: string; // '2023:06:04 11:49:05',
	DateCreated?: string; // "2023:06:04 11:49:05";
	ImageUniqueID?: string; // "ad18cf02848cb4e50000000000000000";
	OffsetTimeOriginal?: string; // '-04:00',
	ExposureCompensation?: number; // 0,
	SubjectArea?: string; // '1848 2354 872 873',
	SceneType?: RawSceneRef; // 1;
	GPSLatitudeRef?: RawLatitudeRef; // "N";
	GPSLongitudeRef?: RawLongitudeRef; // "W";
	GPSSpeedRef?: RawSpeedRef; // "K";
	GPSSpeed?: number; // 0;
	GPSImgDirectionRef?: RawDestBearingRef; // "T";
	GPSImgDirection?: number; // 355.2521671;
	GPSDestBearingRef?: RawDestBearingRef; // "T";
	GPSDestBearing?: number; // 355.2521671;
	RegionType?: string | string[]; // [ 'Face', 'Face' ],
	RegionAreaY?: (number | string) | (number | string)[]; // [ '0.31003793328973184', '0.80989404839764556' ],
	RegionAreaW?: (number | string) | (number | string)[]; // [ '0.19369494850416868', '0.23823442864149097' ],
	RegionAreaX?: (number | string) | (number | string)[]; // [ '0.73518391368317815', 0.4819303580186366 ],
	RegionAreaH?: (number | string) | (number | string)[]; // [ '0.25899280575539563', 0.3180431654676259 ],
	RegionAreaUnit?: string | string[]; // [ 'normalized', 'normalized' ],
	RegionAppliedToDimensionsH?: number;
	RegionAppliedToDimensionsW?: number;
	RegionAppliedToDimensionsUnit?: string;
	ColorSpaceData?: string; // "RGB ";
	DeviceManufacturer?: string; // "APPL";
	DeviceModel?: string; // "";
	Aperture?: number; // 1.8;
	ShutterSpeed?: number; // 0.008403361345;
	LightValue?: number; // 8.26888348145113;
	ThumbnailOffset?: number; // 2564;
	ThumbnailLength?: number; // 6760;
	ThumbnailImage?: string; // "(Binary data ) base64:/9j/4AAQSkZJRgAB ...";
	HostComputer?: string; // 'iPhone 11 Pro Max'
	Orientation?: RawOrientationRef; // 6
	ResolutionUnit?: RawResolutionUnit; // 2
	ExposureTime?: number; // 0.002457002457002457,
	FNumber?: number; // 2.2,
	ExposureProgram?: RawExposureProgram; // 2
	ISO?: number; // 25
	DateTimeDigitized?: string; // 2023-05-14T16:26:40.000Z
	ShutterSpeedValue?: number; // 8.66712596164887
	ApertureValue?: number; // 2.2750070475474535
	BrightnessValue?: number; // 8.303837531320058
	ExposureBiasValue?: number; // 0
	MeteringMode?: number; // 5,
	Flash?: RawFlash; // 10
	FocalLength?: number; // 2.71
	ColorSpace?: RawColorSpace; // 65535
	PixelXDimension?: number; // 3088
	PixelYDimension?: number; // 2316
	SensingMethod?: RawSensingMethod; // 2
	ExposureMode?: number; // 0
	WhiteBalance?: number; // 0
	LensID?: string; // "iPhone 11 Pro Max back triple camera 4.25mm f/1.8";
	LensInfo?: string; // '1.539999962 6 1.8 2.4',
	LensMake?: string; // 'Apple',
	LensModel?: string; // 'iPhone 11 Pro Max front camera 2.71mm f/2.2'
	JFIFVersion?: string; // '1 1',
	ExifByteOrder?: string; // 'MM',
	TileWidth?: number; // 512,
	TileLength?: number; // 512,
	RunTimeFlags?: number; // 1,
	RunTimeValue?: number; // 76206459976583,
	RunTimeScale?: number; // 1000000000,
	RunTimeEpoch?: number; // 0,
	AccelerationVector?: string; // '-0.05049508069 0.04329624028 -0.989702583',
	SubSecTimeOriginal?: number; // 726,
	SubSecTimeDigitized?: number; // 726,
	FocalLengthIn35mmFormat?: number; // 26,
	CompositeImage?: number; // 2,
	GPSHPositioningError?: number; // 7.375216623,
	Compression?: number; // 6,
	CurrentIPTCDigest?: string; // 'd41d8cd98f00b204e9800998ecf8427e',
	IPTCDigest?: string; // 'd41d8cd98f00b204e9800998ecf8427e',
	ProfileCMMType?: string; // 'appl',
	ProfileVersion?: number; // 1024,
	ProfileClass?: string; // 'mntr',
	ProfileConnectionSpace?: string; // 'XYZ ',
	ProfileDateTime?: string; // '2022:01:01 00:00:00',
	ProfileFileSignature?: string; // 'acsp',
	PrimaryPlatform?: string; // 'APPL',
	CMMFlags?: number; // 0,
	DeviceAttributes?: string; // '0 0',
	RenderingIntent?: number; // 0,
	ConnectionSpaceIlluminant?: string; // '0.9642 1 0.82491',
	ProfileCreator?: string; // 'appl',
	ProfileID?: string; // '236 253 163 142 56 133 71 195 109 180 189 79 122 218 24 47',
	ProfileDescription?: string; // 'Display P3',
	ProfileCopyright?: string; // 'Copyright Apple Inc., 2022',
	MediaWhitePoint?: string; // '0.96419 1 0.82489',
	RedMatrixColumn?: string; // '0.51512 0.2412 -0.00105',
	GreenMatrixColumn?: string; // '0.29198 0.69225 0.04189',
	BlueMatrixColumn?: string; // '0.1571 0.06657 0.78407',
	RedTRC?: string; // '(Binary data 32 bytes, use -b option to extract)',
	ChromaticAdaptation?: string; // '1.04788 0.02292 -0.0502 0.02959 0.99048 -0.01706 -0.00923 0.01508 0.75168',
	BlueTRC?: string; // '(Binary data 32 bytes, use -b option to extract)',
	GreenTRC?: string; // '(Binary data 32 bytes, use -b option to extract)',
	EncodingProcess?: number; // 0,
	BitsPerSample?: number; // 8,
	ColorComponents?: number; // 3,
	YCbCrSubSampling?: string; // '2 2',
	RunTimeSincePowerUp?: number; // 76206.459976583,
	ScaleFactor35efl?: number; // 6.11764705882353,
	SubSecCreateDate?: string; // '2023:02:10 10:08:17.726-05:00',
	SubSecDateTimeOriginal?: string; // '2023:02:10 10:08:17.726-05:00',
	SubSecModifyDate?: string; // '2023:02:10 10:08:17-05:00',
	CircleOfConfusion?: string; // '0.00491140798741088',
	FOV?: number; // 69.3903656740024,
	FocalLength35efl?: number; // 26,
	HyperfocalDistance?: number; // 2.04314572276293,
}

export interface RawSharedExif {
	ImageWidth?: number; // 4032;
	ImageHeight?: number; // 3024;
	FileModifyDate?: string; // '2023:06:08 20:39:04+00:00',
	CreateDate?: string; // '2023:06:04 11:49:05',
	ContentIdentifier?: string; // "CDE49B93-CBDC-417B-8791-A3F0BCE9545A";
	SourceFile?: string; // '/media/uploads/1/920427dc4162845fce485e7f574d34fc-IMG_8341.jpg',
	FileName?: string; // '920427dc4162845fce485e7f574d34fc-IMG_8341.jpg',
	Directory?: string; // '/media/uploads/1',
	FileSize?: number; // 594512,
	FileTypeExtension?: string; // 'JPG',
	MIMEType?: MimeTypes; // 'image/jpeg',
	GPSAltitudeRef?: RawAltitudeRef; // 0;
	GPSAltitude?: number; // 53.8106308;
	GPSLatitude?: number; // 42.8165083333333;
	GPSLongitude?: number; // -71.0638361111111;
	ImageSize?: string; // "4032 3024";
	Megapixels?: number; // 12.192768;
	Make?: string; // 'Apple'
	Model?: string; // 'iPhone 11 Pro Max'
	XResolution?: number; // 72
	YResolution?: number; // 72
	Software?: string; // '16.4.1'
	ModifyDate?: string; // 2023-05-14T16:26:40.000Z
	ExifToolVersion?: number; // 12.4,
	FileAccessDate?: string; // '2023:06:08 18:35:03-04:00',
	FileInodeChangeDate?: string; // '2023:06:08 18:35:03-04:00',
	FilePermissions?: number; // 100644,
	FileType?: string; // 'JPEG',
	Warning?: string; // '[minor] Bad format (16) for MakerNotes entry 13',
	GPSPosition?: string; // '42.8164 -71.0638277777778',
}

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
export type RawOrientationRef = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type OrientationDegrees = 0 | 180 | 90 | 270;

/**
 *  1) No unit
 *  2) Inches
 *  3) Centimeters
 * */
export type RawResolutionUnit = 1 | 2 | 3;

/**
 * 0) Auto exposure
 * 1) Manual exposure
 * 2) Auto bracket
 */
export type RawExposureMode = 0 | 1 | 2;

/**
 * 0) Not Defined
 * 1) Manual
 * 2) Normal Program
 * 3) Aperture Priority
 * 4) Shutter Priority
 * 5) Creative Program (biased towards depth of field)
 * 6) Action Program (biased towards fast shutter speed)
 * 7) Portrait Mode (for closeup photos with the background out of focus)
 * 8) Landscape Mode (for landscape photos with the background in focus)
 */
export type RawExposureProgram = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * - 0x00) Flash did not fire
 * - 0x01) Flash fired
 * - 0x05) Strobe return light not detected
 * - 0x07) Strobe return light detected
 * - 0x09) Flash fired, compulsory flash mode
 * - 0x0D) Flash fired, compulsory flash mode, return light not detected
 * - 0x0F) Flash fired, compulsory flash mode, return light detected
 * - 0x10) Flash did not fire, compulsory flash mode
 * - 0x18) Flash did not fire, auto mode
 * - 0x19) Flash fired, auto mode
 * - 0x1D) Flash fired, auto mode, return light not detected
 * - 0x1F) Flash fired, auto mode, return light detected
 * - 0x20) No flash function
 * - 0x41) Flash fired, red-eye reduction mode
 * - 0x45) Flash fired, red-eye reduction mode, return light not detected
 * - 0x47) Flash fired, red-eye reduction mode, return light detected
 * - 0x49) Flash fired, compulsory flash mode, red-eye reduction mode
 * - 0x4D) Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected
 * - 0x4F) Flash fired, compulsory flash mode, red-eye reduction mode, return light detected
 * - 0x59) Flash fired, auto mode, red-eye reduction mode
 * - 0x5D) Flash fired, auto mode, return light not detected, red-eye reduction mode
 * - 0x5F) Flash fired, auto mode, return light detected, red-eye reduction mode
 */
export type RawFlash =
	| 0x0
	| 0x1
	| 0x5
	| 0x7
	| 0x9
	| 0xd
	| 0xf
	| 0x10
	| 0x18
	| 0x19
	| 0x1d
	| 0x1f
	| 0x20
	| 0x41
	| 0x45
	| 0x47
	| 0x49
	| 0x4d
	| 0x4f
	| 0x59
	| 0x5d
	| 0x5f;

/**
 * 1) Not defined
 * 2) One-chip color area sensor
 * 3) Two-chip color area sensor
 * 4) Three-chip color area sensor
 * 5) Color sequential area sensor
 * 7) Trilinear sensor
 * 8) Color sequential linear sensor
 */
export type RawSensingMethod = 1 | 2 | 3 | 4 | 5 | 7 | 8;

/**
 * 0) Standard
 * 1) Landscape
 * 2) Portrait
 * 3) Night scene
 */
export type RawSceneRef = 0 | 1 | 2 | 3;

/**
 * 0) Above sea level
 * 1) Below sea level
 */
export type RawAltitudeRef = 0 | 1;

/**
 * K) km/h
 * M) mph
 * N) knots
 */
export type RawSpeedRef = "K" | "M" | "N";

/**
 * M) Magnetic North
 * T) True North
 */
export type RawDestBearingRef = "M" | "T";

export type RawLongitudeRef = "E" | "W";
export type RawLatitudeRef = "N" | "S";

/**
 * 1) sRGB
 * 65535) Uncalibrated
 */
export type RawColorSpace = 1 | 65535;
