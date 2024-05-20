import type {
  ServiceConfig,
  Options,
  SubjectType,
  AddSubjectExampleSuccess,
  AddSubjectExampleFailure,
} from "../../types/compreface";

import * as fs from "fs";
import { stringify } from "native-querystring";
import { omit } from 'lodash';
import Api from "../util/fetch";
import { RecognizedFace } from "src/types/Faces.types";
import { Subject } from "src/types/Subjects.types";

export class RecognitionService {
  private api: Api;
  private imageBasePath: string;

  constructor(config: ServiceConfig) {
    this.api = new Api({ key: config.key, url: config.url || '' });
    this.imageBasePath = config.imageBasePath; // || process.env.COMPREFACE_LOCAL_PHOTO_DIRECTORY;
  }

  /**
   * @name subjects
   * @description List Subjects
   * @method GET
   * @example
   * ```
   * const result = await RecognitionService.subjects();
   * ```
   */
  public async subjects(): Promise<{ result: SubjectType[]; status: number }> {
    const url = `/subjects`;
    try {
      const res = await this.api.get(url);
      const result = await res.json();
      return { result, status: res.status };
    } catch (e) {
      return { result: undefined, status: e.status };
    }
  }

  /**
   * @name addSubjet
   * @description Add a subject
   * @method POST
   * @example
   * ```
   * const result = await RecognitionService.addSubject('23');
   * ```
   */
  public async addSubject(
    subject: string
  ): Promise<{ result: { subject: string }; status: number }> {
    const url = `/subjects`;
    try {
      const res = await this.api.post(url, JSON.stringify({ subject }));
      const result = await res.json();
      return { result, status: res.status };
    } catch (e) {
      return { result: undefined, status: e.status };
    }
  }

  /**
   * @name renameSubject
   * @description Rename a subject
   * @method PUT
   * @example
   * ```
   * const result = await RecognitionService.renameSubject('23', '22');
   * ```
   */
  public async renameSubject(
    subject: string,
    newSubject: string
  ): Promise<{ result: { updated: boolean }; status: number }> {
    const url = `/subjects/${encodeURIComponent(subject)}`;
    try {
      const res = await this.api.put(
        url,
        JSON.stringify({ subject: newSubject })
      );
      const result = await res.json();
      return { result, status: res.status };
    } catch (e) {
      return { result: undefined, status: e.status };
    }
  }

  /**
   * @name deleteSubject
   * @description Delete a subject
   * @method DELETE
   * @example
   * ```
   * const result = await RecognitionService.deleteSubject('23');
   * ```
   */
  public async deleteSubject(
    subject: string
  ): Promise<{ result: { subject: string }; status: number }> {
    const url = `/subjects/${encodeURIComponent(subject)}`;
    try {
      const res = await this.api.delete(url);
      const result = await res.json();
      return { result, status: res.status };
    } catch (e) {
      return { result: undefined, status: e.status };
    }
  }

  /**
   * @name deleteAllSubjects
   * @description Deletes all subjects
   * @method DELETE
   * @example
   * ```
   * const result = await RecognitionService.deleteAllSubjects();
   * ```
   */
  public async deleteAllSubjects(): Promise<{
    result: { deleted: number } | undefined;
    status: number;
  }> {
    const url = `/subjects`;
    try {
      const res = await this.api.delete(url);
      const result = await res.json();
      return { result, status: res.status };
    } catch (e) {
      return { result: undefined, status: e.status };
    }
  }

  /**
   * @name recognize
   * @method POST
   * @description Base64, Recognize Faces from a Given Image
   * @param imagePath
   * @param query
   * @example
   * ```
   * const imagePath =  "image.JPG";
   * 
   * const result = await RecognitionService.recognize(imagePath, {
      face_plugins: ["age", "embedding", "gender", "landmarks"],
      limit: 1,
      status: true,
      det_prob_threshold: ".8",
    });
   * ```
   */
  public async recognize(
    imagePath: string,
    query: Options = {}
  ): Promise<{ result: RecognizedFace[]; status: number }> {
    const imageSrc = this.imageBasePath + imagePath;
    const img = fs.readFileSync(imageSrc, { encoding: "base64" });
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

    const url = `/recognize?${stringify(_options)}`;
    try {
      const res = await this.api.post(url, JSON.stringify({ file: img }));
      // Subjects[] is always length 1, and remapped to subject & similarity
      const { result }: { result: (RecognizedFace & { subjects: { subject: Subject, similarity: number }[] })[] } = await res.json();
      const _result: RecognizedFace[] = result.map(r => ({
        ...omit(r, ['subjects']),
        ...r.subjects[0]
      }))
      return { result: _result, status: res.status };
    } catch (e) {
      return { result: undefined, status: e.status };
    }
  }

  /**
   * @name verify
   * @method POST
   * @description Base64, Verify Faces from a Given Image
   * @param imagePath
   * @param query
   * @example
   * ```
   * const imagePath =  "image.JPG";
   *
   * const result = await RecognitionService.verify(imageId, imagePath);
   * ```
   */
  // public async verify(/*imageId: string, imagePath: string*/): Promise<unknown> {
  //   return { result: "Not yet implemented", status: 204 };
  // }

  /**
   * @name addSubjectExample
   * @method POST
   * @description Base64, Add an Example of a Subject
   * @param imagePath
   * @param query
   * @returns
   *
   * ```
   * {
   *   result: {
   *     image_id: "54f03aad-f337-40d2-9491-56a3e646c8f5"
   *     subject: "4434"
   *   },
   *   status: 201;
   * }
   * ```
   * @example
   * ```
   * const imagePath =  "image.JPG";
   * const subject_id = "123";
   *
   * const result = await RecognitionService.addSubjectExample(subject_id, imagePath);
   * ```
   */
  public async addSubjectExample(
    subjectId: string,
    imagePath: string
    // det_prob_threshold: number = 1
  ): Promise<{
    result: AddSubjectExampleSuccess | AddSubjectExampleFailure;
    status: number;
  }> {
    const imageSrc = this.imageBasePath + imagePath;
    const img = fs.readFileSync(imageSrc, { encoding: "base64" });
    const url = `/faces?subject=${encodeURIComponent(subjectId)}`;

    let res: Response;
    try {
      res = await this.api.post(url, JSON.stringify({ file: img }));
      const result = await res.json();
      return { result, status: res.status };
    } catch (e) {
      return { result: undefined, status: res.status };
    }
  }
}
