import type { ServiceConfig, RecognizeType, Options, SubjectType, AddSubjectExampleSuccess, AddSubjectExampleFailure } from "types";
export declare class RecognitionService {
    private api;
    private imageBasePath;
    constructor(config: ServiceConfig);
    /**
     * @name subjects
     * @description List Subjects
     * @method GET
     * @example
     * ```
     * const result = await RecognitionService.subjects();
     * ```
     */
    subjects(): Promise<{
        result: SubjectType[];
        status: number;
    }>;
    /**
     * @name addSubjet
     * @description Add a subject
     * @method POST
     * @example
     * ```
     * const result = await RecognitionService.addSubject('23');
     * ```
     */
    addSubject(subject: string): Promise<{
        result: {
            subject: string;
        };
        status: number;
    }>;
    /**
     * @name renameSubject
     * @description Rename a subject
     * @method PUT
     * @example
     * ```
     * const result = await RecognitionService.renameSubject('23', '22');
     * ```
     */
    renameSubject(subject: string, newSubject: string): Promise<{
        result: {
            updated: boolean;
        };
        status: number;
    }>;
    /**
     * @name deleteSubject
     * @description Delete a subject
     * @method DELETE
     * @example
     * ```
     * const result = await RecognitionService.deleteSubject('23');
     * ```
     */
    deleteSubject(subject: string): Promise<{
        result: {
            subject: string;
        };
        status: number;
    }>;
    /**
     * @name deleteAllSubjects
     * @description Deletes all subjects
     * @method DELETE
     * @example
     * ```
     * const result = await RecognitionService.deleteAllSubjects();
     * ```
     */
    deleteAllSubjects(): Promise<{
        result: {
            deleted: number;
        } | undefined;
        status: number;
    }>;
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
    recognize(imagePath: string, query?: Options): Promise<{
        result: RecognizeType[];
        status: number;
    }>;
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
    addSubjectExample(subjectId: string, imagePath: string): Promise<{
        result: AddSubjectExampleSuccess | AddSubjectExampleFailure;
        status: number;
    }>;
}
//# sourceMappingURL=recognition.d.ts.map