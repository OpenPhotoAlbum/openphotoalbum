export type Config = {
  api_url: string;
  recognition_key: string;
  verification_key: string;
  detection_key: string;
  recognition_uri: string;
  verification_uri: string;
  detection_uri: string;
  imageBasePath?: string;
};

export type ServiceConfig = {
  url: string;
  key: string;
  imageBasePath?: string;
};

/**
 * @type Options
 * @property {number=} `limit` - maximum number of faces on the target image to be recognized. It recognizes the biggest faces first. Value of 0 represents no limit. Default value: 0
 * @property {string=} `det_prob_threshold` -  minimum required confidence that a recognized face is actually a face. Value is between **0.0 and 1.0**.
 * @property {string=} `face_plugins` - comma-separated slugs of face plugins. If empty, no additional information is returned
 * @property {boolean=} `status` = if true includes system information like execution_time and plugin_version fields. Default value is false
 */

export type Options = {
  limit?: number;
  det_prob_threshold?: string;
  face_plugins?: ("age" | "gender" | "landmarks" | "embedding")[];
  status?: boolean;
};

export default Config;
