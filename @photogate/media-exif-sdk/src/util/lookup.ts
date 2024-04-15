import { OrientationDegrees, RawOrientationRef } from "src/types/Exif";

const lookup = {
	latitude: {
		N: "North",
		S: "South",
	},
	longitude: {
		E: "East",
		W: "West",
	},
	altitude: {
		"0": "Above sea level",
		"1": "Below sea level",
	},
	direction: {
		M: "Magnetic North",
		T: "True North",
	},
	speed: {
		K: "km/h",
		M: "mph",
		N: "knots",
	},
	orientation: {
		"1": {
			value: 1 as RawOrientationRef,
			degrees: 0 as OrientationDegrees,
			description: "The correct orientation, no adjustment is required",
		},
		"2": {
			value: 2 as RawOrientationRef,
			degrees: 0 as OrientationDegrees,
			description: "Mirrored: image has been flipped back-to-front",
		},
		"3": {
			value: 3 as RawOrientationRef,
			degrees: 180 as OrientationDegrees,
			description: "Image is upside down",
		},
		"4": {
			value: 4 as RawOrientationRef,
			degrees: 180 as OrientationDegrees,
			description:
				"Mirrored: image has been flipped back-to-front and is upside down.",
		},
		"5": {
			value: 5 as RawOrientationRef,
			degrees: 90 as OrientationDegrees,
			description: "Image has been flipped back-to-front and is on its side",
		},
		"6": {
			value: 6 as RawOrientationRef,
			degrees: 90 as OrientationDegrees,
			description: "Mirrored: image is on its side",
		},
		"7": {
			value: 7 as RawOrientationRef,
			degrees: 270 as OrientationDegrees,
			description:
				"Image has been flipped back-to-front and is on its far side",
		},
		"8": {
			value: 8 as RawOrientationRef,
			degrees: 270 as OrientationDegrees,
			description: "Mirrored: image is on its far side",
		},
	},
	colorSpace: {
		"1": "RGB",
		"65535": "Uncalibrated",
	},
	Scene: {
		"0": { value: "Standard", ref: 0 },
		"1": { value: "Landscape", ref: 1 },
		"2": { value: "Portrait", ref: 2 },
		"3": { value: "Night scene", ref: 3 },
	},
	sensingMethod: {
		"1": { value: "Not defined", ref: 1 },
		"2": {
			value: "One-chip color area sensor",
			ref: 2,
		},
		"3": {
			value: "Two-chip color area sensor",
			ref: 3,
		},
		"4": {
			value: "Three-chip color area sensor",
			ref: 4,
		},
		"5": {
			value: "Color sequential area sensor",
			ref: 5,
		},
		"7": { value: "Trilinear sensor", ref: 7 },
		"8": {
			value: "Color sequential linear sensor",
			ref: 8,
		},
	},
	resolutionUnit: {
		"1": {
			value: "No unit",
			ref: 1,
		},
		"2": {
			value: "Inches",
			ref: 2,
		},
		"3": {
			value: "Centimeters",
			ref: 3,
		},
	},
	exposureProgram: {
		"0": {
			value: "Not defined",
			ref: 2,
		},
		"1": { value: "Manual", ref: 1 },
		"2": {
			value: "Normal Program",
			ref: 2,
		},
		"3": {
			value: "Aperture Priority",
			ref: 3,
		},
		"4": {
			value: "Shutter Priority",
			ref: 4,
		},
		"5": {
			// (biased towards depth of field)
			value: "Creative Program",
			ref: 5,
		},
		"6": {
			// (biased towards fast shutter speed)
			value: "Action Program",
			ref: 7,
		},
		"7": {
			// (for closeup photos with the background out of focus)
			value: "Portrait Mode",
			ref: 5,
		},
		"8": {
			// (for landscape photos with the background in focus)
			value: "Landscape Mode",
			ref: 8,
		},
	},
	exposureMode: {
		"0": {
			value: "Auto exposure",
			ref: 2,
		},
		"1": { value: "Manual exposure", ref: 1 },
		"2": {
			value: "Auto bracket",
			ref: 2,
		},
	},
	flash: {
		"0": {
			value: "Flash did not fire",
			ref: 0x0,
		},
		"1": {
			value: "Flash fired",
			ref: 0x01,
		},
		"5": {
			value: "Strobe return light not detected",
			ref: 0x05,
		},
		"7": {
			value: "Strobe return light detected",
			ref: 0x7,
		},
		"9": {
			value: "Flash fired, compulsory flash mode",
			ref: 0x9,
		},
		"13": {
			value: "Flash fired, compulsory flash mode, return light not detected",
			ref: 0xd,
		},
		"15": {
			value: "Flash fired, compulsory flash mode, return light detected",
			ref: 0xf,
		},
		"16": {
			value: "Flash did not fire, compulsory flash mode",
			ref: 0x10,
		},
		"24": {
			value: "Flash did not fire, auto mode",
			ref: 0x18,
		},
		"25": {
			value: "Flash fired, auto mode",
			ref: 0x19,
		},
		"29": {
			value: "Flash fired, auto mode, return light not detected",
			ref: 0x1d,
		},
		"31": {
			value: "Flash fired, auto mode, return light detected",
			ref: 0x1f,
		},
		"32": {
			value: "No flash function",
			ref: 0x20,
		},
		"65": {
			value: "Flash fired, red-eye reduction mode",
			ref: 0x41,
		},
		"69": {
			value: "Flash fired, red-eye reduction mode, return light not detected",
			ref: 0x45,
		},
		"71": {
			value: "Flash fired, red-eye reduction mode, return light detected",
			ref: 0x47,
		},
		"73": {
			value: "Flash fired, compulsory flash mode, red-eye reduction mode",
			ref: 0x49,
		},
		"77": {
			value:
				"Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
			ref: 0x4d,
		},
		"79": {
			value:
				"Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
			ref: 0x4f,
		},
		"89": {
			value: "Flash fired, auto mode, red-eye reduction mode",
			ref: 0x59,
		},
		"93": {
			value:
				"Flash fired, auto mode, return light not detected, red-eye reduction mode",
			ref: 0x5d,
		},
		"95": {
			value:
				"Flash fired, auto mode, return light detected, red-eye reduction mode",
			ref: 0x5f,
		},
	},
};

export default lookup;
