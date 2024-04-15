import { ValueRef } from "../util";

export type Gps = {
	error?: number;
	altitude?: ValueRef<number, string>;
	latitude?: ValueRef<number, string>;
	longitude?: ValueRef<number, string>;
	speed?: ValueRef<number, string>;
	bearing?: ValueRef<number, string>;
	direction?: ValueRef<number, string>;
};
