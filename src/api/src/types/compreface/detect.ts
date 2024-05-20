import { RecognizeType } from "./Recognize";

export type DetectType = RecognizeType & {
  mask: {
    probability: number;
    value: "without_mask";
  };
  execution_time: {
    age: number;
    gender: number;
    detector: number;
    calculator: number;
    mask: number;
  };
};
