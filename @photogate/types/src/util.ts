export interface UnknownObject {
	[key: string]: unknown;
}

export type ValueRef<T, R> = {
	value: T;
	ref: R;
};
