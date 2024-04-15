/* eslint-disable @typescript-eslint/no-var-requires */
import "jest";
import Compreface from "../index";
import { DetectionService } from ".";
import DETECT_MOCK from "../../mock/recognition.add-subject-example";

global.fetch = jest.fn(() =>
	Promise.resolve({
		json: () => Promise.resolve({}),
	})
) as jest.Mock;

describe("[Detection Service]", () => {
	let compre: Compreface;
	let detection: DetectionService;

	beforeEach(() => {
		compre = new Compreface({
			api_url: "https://www.sg1.com",
			recognition_key: "stargate",
			verification_key: "dialhomedevice",
			detection_key: "command",
			recognition_uri: "/api/v1/recognition",
			verification_uri: "/api/v1/verification",
			detection_uri: "/api/v1/detection",
			imageBasePath: "/home/photogate/@photogate/compreface-sdk/mock/",
		});

		detection = compre.initDetectionService();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("POST `detect`", () => {
		it("should detect subjects", async () => {
			jest.mocked(fetch).mockImplementation(() =>
				Promise.resolve({
					status: 200,
					json: () => Promise.resolve(DETECT_MOCK),
				} as Response)
			);

			const res = await detection.detect("tealc.jpeg");

			expect(res).toEqual({ ...DETECT_MOCK, status: 200 });
			expect(fetch).toHaveBeenCalledWith(
				"https://www.sg1.com/api/v1/detection/detect?",
				{
					headers: {
						"Content-Type": "application/json",
						"x-api-key": "command",
					},
					method: "POST",
					redirect: "follow",
					body: expect.anything(),
				}
			);
		});

		it("should recognize subjects with face_plugins", async () => {
			jest.mocked(fetch).mockImplementation(() =>
				Promise.resolve({
					status: 200,
					json: () => Promise.resolve(DETECT_MOCK),
				} as Response)
			);

			const res = await detection.detect("tealc.jpeg", {
				face_plugins: ["age", "embedding", "gender", "landmarks"],
			});

			expect(res).toEqual({ ...DETECT_MOCK, status: 200 });
			expect(fetch).toHaveBeenCalledWith(
				"https://www.sg1.com/api/v1/detection/detect?face_plugins=age%2Cembedding%2Cgender%2Clandmarks",
				{
					headers: {
						"Content-Type": "application/json",
						"x-api-key": "command",
					},
					method: "POST",
					redirect: "follow",
					body: expect.anything(),
				}
			);
		});

		it("should recognize subjects with limit", async () => {
			jest.mocked(fetch).mockImplementation(() =>
				Promise.resolve({
					status: 200,
					json: () => Promise.resolve(DETECT_MOCK),
				} as Response)
			);

			const res = await detection.detect("tealc.jpeg", { limit: 1 });

			expect(res).toEqual({ ...DETECT_MOCK, status: 200 });
			expect(fetch).toHaveBeenCalledWith(
				"https://www.sg1.com/api/v1/detection/detect?limit=1",
				{
					headers: {
						"Content-Type": "application/json",
						"x-api-key": "command",
					},
					method: "POST",
					redirect: "follow",
					body: expect.anything(),
				}
			);
		});

		it("should recognize subjects with status", async () => {
			jest.mocked(fetch).mockImplementation(() =>
				Promise.resolve({
					status: 200,
					json: () => Promise.resolve(DETECT_MOCK),
				} as Response)
			);

			const res = await detection.detect("tealc.jpeg", { status: true });

			expect(res).toEqual({ ...DETECT_MOCK, status: 200 });
			expect(fetch).toHaveBeenCalledWith(
				"https://www.sg1.com/api/v1/detection/detect?status=true",
				{
					headers: {
						"Content-Type": "application/json",
						"x-api-key": "command",
					},
					method: "POST",
					redirect: "follow",
					body: expect.anything(),
				}
			);
		});

		it("should recognize subjects with det_prob_threshold", async () => {
			jest.mocked(fetch).mockImplementation(() =>
				Promise.resolve({
					status: 200,
					json: () => Promise.resolve(DETECT_MOCK),
				} as Response)
			);

			const res = await detection.detect("tealc.jpeg", {
				det_prob_threshold: "0.4",
			});

			expect(res).toEqual({ ...DETECT_MOCK, status: 200 });
			expect(fetch).toHaveBeenCalledWith(
				"https://www.sg1.com/api/v1/detection/detect?det_prob_threshold=0.4",
				{
					headers: {
						"Content-Type": "application/json",
						"x-api-key": "command",
					},
					method: "POST",
					redirect: "follow",
					body: expect.anything(),
				}
			);
		});

		it("should recognize subjects with multiple options", async () => {
			jest.mocked(fetch).mockImplementation(() =>
				Promise.resolve({
					status: 200,
					json: () => Promise.resolve(DETECT_MOCK),
				} as Response)
			);

			const res = await detection.detect("tealc.jpeg", {
				face_plugins: ["age", "embedding", "gender", "landmarks"],
				limit: 1,
				status: true,
				det_prob_threshold: ".8",
			});

			expect(res).toEqual({ ...DETECT_MOCK, status: 200 });
			expect(fetch).toHaveBeenCalledWith(
				"https://www.sg1.com/api/v1/detection/detect?limit=1&det_prob_threshold=.8&status=true&face_plugins=age%2Cembedding%2Cgender%2Clandmarks",
				{
					headers: {
						"Content-Type": "application/json",
						"x-api-key": "command",
					},
					method: "POST",
					redirect: "follow",
					body: expect.anything(),
				}
			);
		});
	});
});
