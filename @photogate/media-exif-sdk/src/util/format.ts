import { RawExifData } from "src/types/Exif";
import lookup from "./lookup";
import { ExifData, Gps } from "@photogate/types";
import moment from "moment";

const repairDateFormatting = (d: string, o: string) => {
	try {
		if (!d) return;
		const needsRepair = d.includes(":");
		if (!needsRepair) return d;
		if (!d.includes(" ")) return moment(d.replace(/:/g, "-")).format();
		const hasOffset = d.split(" ")[1].length > 8;
		const _newDate = d.split(" ")[0].replace(/:/g, "-");
		const _newTime = d.split(" ")[1];
		const _d = `${_newDate} ${_newTime}`;
		if (hasOffset || !o) return moment.utc(_d).format();
		return moment.utc(`${_d}${o}`).format();
	} catch (e) {
		return;
	}
};

const formatRegion = (region: Partial<RawExifData>) => {
	if (!region) return;

	const {
		RegionType,
		RegionAreaY,
		RegionAreaW,
		RegionAreaX,
		RegionAreaH,
		RegionAreaUnit,
		RegionAppliedToDimensionsH,
		RegionAppliedToDimensionsW,
	} = region;
	if (
		!RegionType ||
		!RegionAreaY ||
		!RegionAreaW ||
		!RegionAreaX ||
		!RegionAreaH ||
		!RegionAreaUnit ||
		!RegionAppliedToDimensionsH ||
		!RegionAppliedToDimensionsW
	)
		return;

	const _regionType: string[] = !Array.isArray(RegionType)
		? [RegionType]
		: RegionType;
	const _RegionAreaY = !Array.isArray(RegionAreaY)
		? [RegionAreaY]
		: RegionAreaY;
	const _RegionAreaW = !Array.isArray(RegionAreaW)
		? [RegionAreaW]
		: RegionAreaW;
	const _RegionAreaX = !Array.isArray(RegionAreaX)
		? [RegionAreaX]
		: RegionAreaX;
	const _RegionAreaH = !Array.isArray(RegionAreaH)
		? [RegionAreaH]
		: RegionAreaH;
	const _RegionAreaUnit: string[] = !Array.isArray(RegionAreaUnit)
		? [RegionAreaUnit]
		: RegionAreaUnit;

	return _regionType.map((type, i) => ({
		type,
		areaY: parseFloat(_RegionAreaY[i].toString()),
		areaW: parseFloat(_RegionAreaW[i].toString()),
		areaX: parseFloat(_RegionAreaX[i].toString()),
		areaH: parseFloat(_RegionAreaH[i].toString()),
		height: RegionAppliedToDimensionsH,
		width: RegionAppliedToDimensionsW,
		unit: _RegionAreaUnit[i],
	}));
};

export const formatMetadata = (data: RawExifData): ExifData => {
	if (!data) return;

	const {
		FileName,
		ImageUniqueID,
		ContentIdentifier,
		ImageWidth,
		ImageHeight,
		MIMEType,
		OffsetTime,
		DateCreated,
		CreateDate,
		DateTimeOriginal,
		FileModifyDate,
		ModifyDate,
		FileTypeExtension,
		FileSize,
		ExifVersion,
		SourceFile,
		Directory,
		GPSAltitude,
		GPSAltitudeRef,
		GPSLatitude,
		GPSLatitudeRef,
		GPSLongitude,
		GPSLongitudeRef,
		GPSSpeed,
		GPSSpeedRef,
		GPSImgDirection,
		GPSImgDirectionRef,
		GPSDestBearing,
		GPSDestBearingRef,
		GPSHPositioningError,
		RegionType,
		RegionAreaY,
		RegionAreaW,
		RegionAreaX,
		RegionAreaH,
		RegionAreaUnit,
		RegionAppliedToDimensionsH,
		RegionAppliedToDimensionsW,
		Aperture,
		ImageSize,
		Megapixels,
		ShutterSpeed,
		LightValue,
		ColorSpace,
		Make,
		Model,
		HostComputer,
		DeviceManufacturer,
		// ThumbnailImage,
		Orientation,
		XResolution,
		YResolution,
		ResolutionUnit,
		Software,
		ISO,
		ExposureTime,
		FNumber,
		ExposureProgram,
		ExposureMode,
		Flash,
		FocalLength,
		BrightnessValue,
		SensingMethod,
		LensID,
		LensInfo,
		LensMake,
		LensModel,
		WhiteBalance,
		SubjectArea,
	} = data;

	const _DateCreated = repairDateFormatting(DateCreated, OffsetTime);
	const _CreateDate = repairDateFormatting(CreateDate, OffsetTime);
	const _DateTimeOriginal = repairDateFormatting(DateTimeOriginal, OffsetTime);
	const _FileModifyDate = repairDateFormatting(FileModifyDate, OffsetTime);
	const _ModifyDate = repairDateFormatting(ModifyDate, OffsetTime);

	const gps: Gps = {};
	if (GPSHPositioningError) gps.error = GPSHPositioningError;
	if (GPSLatitude && GPSLatitudeRef)
		gps.latitude = {
			value: GPSLatitude,
			ref: lookup.latitude[GPSLatitudeRef],
		};
	if (GPSLongitude && GPSLongitudeRef)
		gps.longitude = {
			value: GPSLongitude,
			ref: lookup.longitude[GPSLongitudeRef],
		};
	if (GPSAltitude && GPSAltitudeRef)
		gps.altitude = {
			value: GPSAltitude,
			ref: lookup.altitude[GPSAltitudeRef],
		};
	if (GPSSpeed && GPSSpeedRef)
		gps.speed = {
			value: GPSSpeed,
			ref: lookup.speed[GPSSpeedRef],
		};
	if (GPSImgDirection && GPSImgDirectionRef)
		gps.direction = {
			value: GPSImgDirection,
			ref: lookup.direction[GPSImgDirectionRef],
		};
	if (GPSDestBearing && GPSDestBearingRef)
		gps.bearing = {
			value: GPSDestBearing,
			ref: lookup.direction[GPSDestBearingRef],
		};

	const formattedData = {
		_version: ExifVersion,
		uuid: ImageUniqueID,
		contentId: ContentIdentifier,
		height: ImageHeight,
		width: ImageWidth,
		mime: MIMEType,
		extension: FileTypeExtension,
		fileSize: FileSize,
		location: GPSLatitude && GPSLongitude && [GPSLongitude, GPSLatitude],
		created_on:
			_DateTimeOriginal || _DateCreated || _CreateDate || _FileModifyDate,
		modified_on: _FileModifyDate || _ModifyDate,
		source: SourceFile,
		fileName: FileName,
		directory: Directory,
		gps,
		subject:
			SubjectArea &&
			(SubjectArea.split(" ").map((i) => parseInt(i)) as number[]),
		faces: formatRegion({
			RegionType,
			RegionAreaY,
			RegionAreaW,
			RegionAreaX,
			RegionAreaH,
			RegionAreaUnit,
			RegionAppliedToDimensionsH,
			RegionAppliedToDimensionsW,
		}),
		details: {
			imageSize:
				ImageSize && `${ImageSize.split(" ")[0]}x${ImageSize.split(" ")[1]}`,
			imageHeight: ImageHeight,
			imageWidth: ImageWidth,
			megapixels: Megapixels,
			shutterSpeed: ShutterSpeed,
			light: LightValue,
			colorSpace: lookup.colorSpace[ColorSpace],
			orientation: lookup.orientation[Orientation],
			xResolution: XResolution,
			yResolution: YResolution,
			resolutionUnit: lookup.resolutionUnit[ResolutionUnit],
			aperture: Aperture,
			ISO: ISO,
			fNumber: FNumber,
			exposure: {
				time: ExposureTime,
				mode: lookup.exposureMode[ExposureMode],
				program: lookup.exposureProgram[ExposureProgram],
			},
			flash: lookup.flash[Flash],
			focalLength: FocalLength,
			brightness: BrightnessValue,
			sensingMethod: lookup.sensingMethod[SensingMethod],
			whiteBalance: WhiteBalance,
		},
		device: {
			make: Make,
			model: Model,
			software: Software.toString(),
			hostComputer: HostComputer,
			manufacturer: DeviceManufacturer,
			lensID: LensID,
			lensInfo: LensInfo,
			lensMake: LensMake,
			lensModel: LensModel,
		},
	};

	return formattedData;
};
