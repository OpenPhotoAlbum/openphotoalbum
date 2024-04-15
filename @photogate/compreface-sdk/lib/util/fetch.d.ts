declare class Api {
    private url;
    private key;
    constructor(props: {
        key: string;
        url: string;
    });
    private headers;
    post: (path: string, body: string) => Promise<Response>;
    get: (path: string) => Promise<Response>;
    put: (path: string, body: string) => Promise<Response>;
    delete: (path: string) => Promise<Response>;
}
export default Api;
//# sourceMappingURL=fetch.d.ts.map