/* eslint-disable @typescript-eslint/no-var-requires */

import "jest";
import Compreface from "../index";
import { RecognitionService } from "./recognition";
import RECOGNIZE_MOCK from "../../mock/recognition.recognize";
import LIST_SUBJECTS_MOCK from "../../mock/recognition.list-subjects";
import ADD_SUBJECT_EXAMPLE_MOCK from "../../mock/recognition.add-subject-example";

global.fetch = jest.fn(() =>
	Promise.resolve({
		json: () => Promise.resolve({}),
	})
) as jest.Mock;

describe("[Recognition Service]", () => {
	let compre: Compreface;
	let recognition: RecognitionService;

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

		recognition = compre.initRecognitionService();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should have service methods defined", () => {
		expect(recognition.recognize).toBeDefined();
		expect(recognition.addSubject).toBeDefined();
		expect(recognition.renameSubject).toBeDefined();
		expect(recognition.deleteSubject).toBeDefined();
		expect(recognition.deleteAllSubjects).toBeDefined();
		expect(recognition.recognize).toBeDefined();
		expect(recognition.addSubjectExample).toBeDefined();
	});

	describe("POST `recognize`", () => {
		it("should recognize subjects", async () => {
			jest.mocked(fetch).mockImplementation(() =>
				Promise.resolve({
					status: 200,
					json: () => Promise.resolve({ result: RECOGNIZE_MOCK }),
				} as Response)
			);

			const res = await recognition.recognize("tealc.jpeg");

			expect(res).toEqual({ result: RECOGNIZE_MOCK, status: 200 });
			expect(fetch).toHaveBeenCalledWith(
				"https://www.sg1.com/api/v1/recognition/recognize?",
				{
					headers: {
						"Content-Type": "application/json",
						"x-api-key": "stargate",
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
					json: () => Promise.resolve(RECOGNIZE_MOCK),
				} as Response)
			);

			const res = await recognition.recognize("tealc.jpeg", {
				face_plugins: ["age", "embedding", "gender", "landmarks"],
			});

			expect(res).toEqual({ ...RECOGNIZE_MOCK, status: 200 });
			expect(fetch).toHaveBeenCalledWith(
				"https://www.sg1.com/api/v1/recognition/recognize?face_plugins=age%2Cembedding%2Cgender%2Clandmarks",
				{
					headers: {
						"Content-Type": "application/json",
						"x-api-key": "stargate",
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
					json: () => Promise.resolve(RECOGNIZE_MOCK),
				} as Response)
			);

			const res = await recognition.recognize("tealc.jpeg", { limit: 1 });

			expect(res).toEqual({ ...RECOGNIZE_MOCK, status: 200 });
			expect(fetch).toHaveBeenCalledWith(
				"https://www.sg1.com/api/v1/recognition/recognize?limit=1",
				{
					headers: {
						"Content-Type": "application/json",
						"x-api-key": "stargate",
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
					json: () => Promise.resolve(RECOGNIZE_MOCK),
				} as Response)
			);

			const res = await recognition.recognize("tealc.jpeg", { status: true });

			expect(res).toEqual({ ...RECOGNIZE_MOCK, status: 200 });
			expect(fetch).toHaveBeenCalledWith(
				"https://www.sg1.com/api/v1/recognition/recognize?status=true",
				{
					headers: {
						"Content-Type": "application/json",
						"x-api-key": "stargate",
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
					json: () => Promise.resolve(RECOGNIZE_MOCK),
				} as Response)
			);

			const res = await recognition.recognize("tealc.jpeg", {
				det_prob_threshold: "0.4",
			});

			expect(res).toEqual({ ...RECOGNIZE_MOCK, status: 200 });
			expect(fetch).toHaveBeenCalledWith(
				"https://www.sg1.com/api/v1/recognition/recognize?det_prob_threshold=0.4",
				{
					headers: {
						"Content-Type": "application/json",
						"x-api-key": "stargate",
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
					json: () => Promise.resolve(RECOGNIZE_MOCK),
				} as Response)
			);

			const res = await recognition.recognize("tealc.jpeg", {
				face_plugins: ["age", "embedding", "gender", "landmarks"],
				limit: 1,
				status: true,
				det_prob_threshold: ".8",
			});

			expect(res).toEqual({ ...RECOGNIZE_MOCK, status: 200 });
			expect(fetch).toHaveBeenCalledWith(
				"https://www.sg1.com/api/v1/recognition/recognize?limit=1&det_prob_threshold=.8&status=true&face_plugins=age%2Cembedding%2Cgender%2Clandmarks",
				{
					headers: {
						"Content-Type": "application/json",
						"x-api-key": "stargate",
					},
					method: "POST",
					redirect: "follow",
					body: expect.anything(),
				}
			);
		});
	});

	describe("GET `subjects`", () => {
		it("should return subjects", async () => {
			jest.mocked(fetch).mockImplementation(() =>
				Promise.resolve({
					status: 200,
					json: () => Promise.resolve({ ...LIST_SUBJECTS_MOCK }),
				} as Response)
			);

			const res = await recognition.subjects();

			expect(res).toEqual({ result: LIST_SUBJECTS_MOCK, status: 200 });
			expect(fetch).toHaveBeenCalledWith(
				"https://www.sg1.com/api/v1/recognition/subjects",
				{
					headers: {
						"Content-Type": "application/json",
						"x-api-key": "stargate",
					},
					method: "GET",
					redirect: "follow",
				}
			);
		});
	});

	describe("POST `addSubject`", () => {
		it("should add a subject", async () => {
			jest.mocked(fetch).mockImplementation(() =>
				Promise.resolve({
					status: 200,
					json: () =>
						Promise.resolve({
							subject: "Ned Stark",
						}),
				} as Response)
			);

			const res = await recognition.addSubject("Ned Stark");

			expect(res).toEqual({
				result: {
					subject: "Ned Stark",
				},
				status: 200,
			});

			expect(fetch).toHaveBeenCalledWith(
				"https://www.sg1.com/api/v1/recognition/subjects",
				{
					headers: {
						"Content-Type": "application/json",
						"x-api-key": "stargate",
					},
					method: "POST",
					redirect: "follow",
					body: JSON.stringify({ subject: "Ned Stark" }),
				}
			);
		});
	});

	describe("PUT `renameSubject`", () => {
		it("should rename a subject", async () => {
			jest.mocked(fetch).mockImplementation(() =>
				Promise.resolve({
					status: 200,
					json: () =>
						Promise.resolve({
							updated: true,
						}),
				} as Response)
			);

			const res = await recognition.renameSubject(
				"John Snow",
				"Aegon Targaryen"
			);

			expect(res).toEqual({
				result: {
					updated: true,
				},
				status: 200,
			});

			expect(fetch).toHaveBeenCalledWith(
				"https://www.sg1.com/api/v1/recognition/subjects/John%20Snow",
				{
					headers: {
						"Content-Type": "application/json",
						"x-api-key": "stargate",
					},
					method: "PUT",
					redirect: "follow",
					body: JSON.stringify({ subject: "Aegon Targaryen" }),
				}
			);
		});
	});

	describe("DELETE `deleteSubject`", () => {
		it("should delete a subject", async () => {
			jest.mocked(fetch).mockImplementation(() =>
				Promise.resolve({
					status: 200,
					json: () =>
						Promise.resolve({
							updated: true,
						}),
				} as Response)
			);

			const res = await recognition.deleteSubject("Daenerys Targaryen");

			expect(res).toEqual({
				result: {
					updated: true,
				},
				status: 200,
			});

			expect(fetch).toHaveBeenCalledWith(
				"https://www.sg1.com/api/v1/recognition/subjects/Daenerys%20Targaryen",
				{
					headers: {
						"Content-Type": "application/json",
						"x-api-key": "stargate",
					},
					method: "DELETE",
					redirect: "follow",
				}
			);
		});
	});

	describe("DELETE `deleteAllSubjects`", () => {
		it("should delete all subjects", async () => {
			jest.mocked(fetch).mockImplementation(() =>
				Promise.resolve({
					status: 200,
					json: () =>
						Promise.resolve({
							deleted: 27,
						}),
				} as Response)
			);

			const res = await recognition.deleteAllSubjects();

			expect(res).toEqual({
				result: {
					deleted: 27,
				},
				status: 200,
			});

			expect(fetch).toHaveBeenCalledWith(
				"https://www.sg1.com/api/v1/recognition/subjects",
				{
					headers: {
						"Content-Type": "application/json",
						"x-api-key": "stargate",
					},
					method: "DELETE",
					redirect: "follow",
				}
			);
		});
	});

	describe("POST `addSubjectExample`", () => {
		it("should add a subject", async () => {
			jest.mocked(fetch).mockImplementation(() =>
				Promise.resolve({
					status: 200,
					json: () => Promise.resolve(ADD_SUBJECT_EXAMPLE_MOCK),
				} as Response)
			);

			const res = await recognition.addSubjectExample(
				"Bran Stark",
				"tealc.jpeg"
			);

			expect(res).toEqual({
				result: ADD_SUBJECT_EXAMPLE_MOCK,
				status: 200,
			});

			expect(fetch).toHaveBeenCalledWith(
				"https://www.sg1.com/api/v1/recognition/faces?subject=Bran%20Stark",
				{
					headers: {
						"Content-Type": "application/json",
						"x-api-key": "stargate",
					},
					method: "POST",
					redirect: "follow",
					body: expect.anything(),
				}
			);
		});
	});
});
