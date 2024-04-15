import Api from "../util/fetch";
import type { ServiceConfig } from "types";

export class VerificationService {
  private api: Api;

  constructor(config: ServiceConfig) {
    this.api = new Api({ key: config.key, url: config.url || '' });
  }
}
