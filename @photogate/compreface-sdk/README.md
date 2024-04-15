# Node Typescript Compreface SDK

Built as a replacement for the "official" one due to many issues I've found while trying to
incorporate it (including Typescript)

## More details to come

## Installation

```
npm i @photogate/compreface-sdk
```

## Usage

```javascript
import Compreface from "@photogate/compreface-sdk";

const Compre = new Compreface({
  api_url: API_URL,
  recognition_key: RECOGNITION_KEY,
  verification_key: VERIFCATION_KEY,
  detection_key: DETECTION_KEY,
  recognition_uri: RECOGNITION_URI,
  verification_uri: VERIFICATION_URI,
  detection_uri: DETECTION_URI,
  imageBasePath: "/local/directory/",
});

const Recognition = Compre.initRecognitionService();
const Detection = Compre.initDetectionService();
const Verification = Compre.initVerificationService();

const getSubjects = async () => {
  return await Recognition.recognize(
    "source-1c173051bf12dda6664395241e7bf598-IMG_3817.JPG",
    {
      face_plugins: ["age", "embedding", "gender", "landmarks"],
      limit: 1,
      det_prob_threshold: ".8",
    }
  );
};

console.log(getSubjects());
```
