import { SexType } from "./Person";

export interface Scan {
	id: number;
	personId: number;
	recognitionId: number;
	mediaPath: string;
	similarity: number;
	sex: SexType;
	sexProbability: number;
	age: number;
	ageProbability: number;
	box: {
		xMin: number;
		xMax: number;
		yMin: number;
		yMax: number;
		probability: number;
	};
}
