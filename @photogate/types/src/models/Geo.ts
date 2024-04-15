export interface Address extends Location {
	line1: string;
	line2: string;
}

export interface Geolocation {
	doctype: string;
	city: GeoCity;
	state: GeoState;
	country: GeoCountry;
}

export interface GeoCity {
	id: number;
	postalCode: string;
	name: string;
	latitude: number;
	longitude: number;
	countyName: string;
	countyNamesAll: string;
	timezone: string;
}

export interface GeoState {
	id: number;
	code: string;
	name: string;
}

export interface GeoCountry {
	id: number;
	phoneCode: number;
	code: string;
	name: string;
}
