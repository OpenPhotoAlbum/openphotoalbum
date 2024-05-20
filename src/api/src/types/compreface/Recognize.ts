export type RecognizeType = {
  box: {
    probability: number;
    x_max: number;
    y_max: number;
    x_min: number;
    y_min: number;
  };
  subjects: { subject: string; similarity: number }[];
  age?: { probability: number; high: number; low: number };
  gender?: { probability: number; value: "male" | "female" };
  landmarks?: [number, number][];
  execution_time?: {
    age: number;
    gender: number;
    detector: number;
    calculator: number;
  };
};
