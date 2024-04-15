export default {
  result: [
    {
      age: {
        probability: 0.984115481376648,
        high: 32,
        low: 25,
      },
      gender: {
        probability: 1,
        value: "male",
      },
      box: {
        probability: 0.88071,
        x_max: 206,
        y_max: 225,
        x_min: 29,
        y_min: 43,
      },
      mask: {
        probability: 0.9015367031097412,
        value: "with_mask",
      },
      subjects: [
        {
          subject: "1",
          similarity: 0.90293,
        },
      ],
      landmarks: [
        [88, 116],
        [144, 115],
        [117, 145],
        [91, 175],
        [139, 173],
      ],
      execution_time: {
        age: 30,
        gender: 24,
        detector: 339,
        calculator: 40,
        mask: 42,
      },
    },
  ],
};
