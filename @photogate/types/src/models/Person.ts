import { Address } from "./Geo";

export type SexType = "M" | "F";

export interface Person {
	id: number;
	firstName: string;
	middleName?: string;
	lastName: string;
	maidenName?: string;
	aliases: string[];
	dob?: string;
	sex: SexType;
	email?: string;
	address?: PersonAddress;
	profileImage?: string;
}

export interface PersonAddress extends Address {
	movedIn?: string;
	movedOut?: string;
}
