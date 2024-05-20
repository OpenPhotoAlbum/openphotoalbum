import * as fs from "fs";
import { stringify } from "native-querystring";
import Api from "../util/fetch";
import type { ServiceConfig, Options } from "../../types/compreface";
import { DetectedFace, Face } from "src/types/Faces.types";

export class DetectionService {
  private api: Api;
  private imageBasePath: string;

  constructor(config: ServiceConfig) {
    this.api = new Api({ key: config.key, url: config.url || '' });

    this.imageBasePath = config.imageBasePath;
  }

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
  public async detect(
    imagePath: string,
    query: Options = {}
  ): Promise<{ result: DetectedFace[]; status: number }> {
    const imageSrc = imagePath;
    let img: string;
    try {
      img = fs.readFileSync(imageSrc, { encoding: "base64" });
    } catch (e) {
      return { result: undefined, status: 404 };
    }
    const { limit, det_prob_threshold, status, face_plugins } = query;
    const _options: {
      limit?: number;
      det_prob_threshold?: string;
      status?: boolean;
      face_plugins?: string;
    } = Object.fromEntries(
      Object.entries({
        limit,
        det_prob_threshold,
        status,
        face_plugins: face_plugins ? (face_plugins || []).join(",") : undefined,
      }).filter(([_, v]) => v != null)
    );
    const url = `/detect?${stringify(_options)}`;

    try {
      const res = await this.api.post(url, JSON.stringify({ file: img }));
      const { result }: { result: DetectedFace[] } = await res.json();
      return { result, status: res.status };
    } catch (e) {
      console.log(e)
      return { result: undefined, status: e.status };
    }
  }
}
