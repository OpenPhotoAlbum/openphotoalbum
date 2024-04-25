import { Config, ServiceConfig, RecognizeType, Options, SubjectType, AddSubjectExampleSuccess, AddSubjectExampleFailure, DetectType } from "types";
import { RecognitionService, DetectionService, VerificationService } from "./services";
export { RecognitionService, DetectionService, VerificationService, };
/**
 * @name Compreface
 * Main Compreface SDK Class
 *
 * @example
 * ```
 * const Compre = new Compreface({
 *   api_url: API_URL,
 *   recognition_key: RECOGNITION_KEY,
 *   verification_key: VERIFCATION_KEY,
 *   detection_key: DETECTION_KEY,
 *   recognition_uri: RECOGNITION_URI,
 *   verification_uri: VERIFICATION_URI,
 *   detection_uri: DETECTION_URI,
 *   defaultLimit: 10,
 * });
 * ```
 */
declare class Compreface {
    private api_url;
    private recognition_key;
    private verification_key;
    private detection_key;
    private recognition_uri;
    private verification_uri;
    private detection_uri;
    recognitionService: RecognitionService;
    detectionService: DetectionService;
    verificationService: VerificationService;
    private imageBasePath;
    constructor(config: Config);
    initRecognitionService(): RecognitionService;
    initDetectionService(): DetectionService;
    initVerificationService(): VerificationService;
}
export default Compreface;
export type { Config, ServiceConfig, RecognizeType, Options, SubjectType, AddSubjectExampleSuccess, AddSubjectExampleFailure, DetectType, };
//# sourceMappingURL=index.d.ts.map