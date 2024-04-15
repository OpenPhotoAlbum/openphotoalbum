import Compreface from "./index";

describe("[Compreface]", () => {
  let compre: Compreface;

  beforeEach(() => {
    compre = new Compreface({
      api_url: "https://www.sg1.com",
      recognition_key: "stargate",
      verification_key: "dialhomedevice",
      detection_key: "command",
      recognition_uri: "/tauri",
      verification_uri: "/abydos",
      detection_uri: "/chulak",
    });
  });

  it("should be defined", () => {
    expect(Compreface).toBeDefined();
  });

  it("should create new Compreface", () => {
    expect(compre).toEqual({
      api_url: "https://www.sg1.com",
      detection_key: "command",
      recognition_key: "stargate",
      recognition_uri: "/tauri",
      detection_uri: "/chulak",
      imageBasePath: undefined,
      verification_key: "dialhomedevice",
    });
  });

  it("should init services", () => {
    const recognition = compre.initRecognitionService();
    const verification = compre.initVerificationService();
    const detection = compre.initDetectionService();
    expect(recognition).toBeDefined();
    expect(verification).toBeDefined();
    expect(detection).toBeDefined();
  });
});
