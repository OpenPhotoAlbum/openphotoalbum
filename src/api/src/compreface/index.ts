import {
  Config,
  ServiceConfig,
  RecognizeType,
  Options,
  SubjectType,
  AddSubjectExampleSuccess,
  AddSubjectExampleFailure,
  DetectType,
} from "../types/compreface";

import {
  RecognitionService,
  DetectionService,
  VerificationService,
} from "./services";

export {
  RecognitionService,
  DetectionService,
  VerificationService,
}

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
class Compreface {
  // Config
  private api_url: string;
  private recognition_key: string;
  private verification_key: string;
  private detection_key: string;
  private recognition_uri: string;
  private verification_uri: string;
  private detection_uri: string;

  // Services
  public recognitionService: RecognitionService;
  public detectionService: DetectionService;
  public verificationService: VerificationService;
  private imageBasePath: string;

  constructor(config: Config) {
    this.api_url = config.api_url;
    this.recognition_key = config.recognition_key;
    this.verification_key = config.verification_key;
    this.detection_key = config.detection_key;
    this.recognition_uri = config.recognition_uri;
    this.detection_uri = config.detection_uri;
    this.imageBasePath = config.imageBasePath || '';
  }

  public initRecognitionService(): RecognitionService {
    this.recognitionService = new RecognitionService({
      url: this.api_url + this.recognition_uri,
      key: this.recognition_key,
      imageBasePath: this.imageBasePath,
    });

    return this.recognitionService;
  }

  public initDetectionService(): DetectionService {
    this.detectionService = new DetectionService({
      url: this.api_url + this.detection_uri,
      key: this.detection_key,
      imageBasePath: this.imageBasePath,
    });

    return this.detectionService;
  }

  public initVerificationService(): VerificationService {
    this.verificationService = new VerificationService({
      url: this.api_url + this.verification_uri,
      key: this.verification_key,
      imageBasePath: this.imageBasePath,
    });

    return this.verificationService;
  }
}

export default Compreface;

export type {
  Config,
  ServiceConfig,
  RecognizeType,
  Options,
  SubjectType,
  AddSubjectExampleSuccess,
  AddSubjectExampleFailure,
  DetectType,
};
