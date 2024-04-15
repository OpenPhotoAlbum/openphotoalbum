import type { ServiceConfig, Options, DetectType } from "types";
export declare class DetectionService {
    private api;
    private imageBasePath;
    constructor(config: ServiceConfig);
    /**
     * @name detect
     * @method POST
     * @description Face Detection Service, Base64
     * @param imagePath
     * @param query
     * @example
     * ```
     * const imagePath =  "image.JPG";
     *
     * const result = await RecognitionService.detect(imagePath, {
        face_plugins: ["age", "embedding", "gender", "landmarks"],
        limit: 1,
        status: true,
        det_prob_threshold: ".8",
      });
     * ```
     */
    detect(imagePath: string, query?: Options): Promise<{
        result: DetectType[];
        status: number;
    }>;
}
//# sourceMappingURL=detection.d.ts.map