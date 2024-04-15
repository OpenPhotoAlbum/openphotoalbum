export interface SearchResponse<T, A = []> {
	data: T[];
	aggregations?: A[];
}
