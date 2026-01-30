import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getRequests, createRequest } from "./requests";
import * as client from "../../../shared/api/client";
import * as auth from "../../../shared/utils/auth";

vi.mock("../../../shared/api/client", () => ({
	apiRequest: vi.fn(),
}));

vi.mock("../../../shared/utils/auth", () => ({
	getAuthToken: vi.fn(),
}));

describe("getRequests", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("パラメータなしの場合は正しいパスでapiRequestを呼び出す", async () => {
		const mockResponse = { requests: [] };
		vi.mocked(client.apiRequest).mockResolvedValue(mockResponse);

		await getRequests();

		expect(client.apiRequest).toHaveBeenCalledWith("/api/v1/requests");
	});

	it("latとlngが指定された場合はクエリパラメータ付きでapiRequestを呼び出す", async () => {
		const mockResponse = { requests: [] };
		vi.mocked(client.apiRequest).mockResolvedValue(mockResponse);

		await getRequests({ lat: 35.6895, lng: 139.6917 });

		expect(client.apiRequest).toHaveBeenCalledWith(
			"/api/v1/requests?lat=35.6895&lng=139.6917",
		);
	});

	it("latのみ指定された場合はlatパラメータのみでapiRequestを呼び出す", async () => {
		const mockResponse = { requests: [] };
		vi.mocked(client.apiRequest).mockResolvedValue(mockResponse);

		await getRequests({ lat: 35.6895 });

		expect(client.apiRequest).toHaveBeenCalledWith(
			"/api/v1/requests?lat=35.6895",
		);
	});

	it("lngのみ指定された場合はlngパラメータのみでapiRequestを呼び出す", async () => {
		const mockResponse = { requests: [] };
		vi.mocked(client.apiRequest).mockResolvedValue(mockResponse);

		await getRequests({ lng: 139.6917 });

		expect(client.apiRequest).toHaveBeenCalledWith(
			"/api/v1/requests?lng=139.6917",
		);
	});

	it("apiRequestのレスポンスを正しく返す", async () => {
		const mockResponse = {
			requests: [
				{
					id: 1,
					lat: 35.6895,
					lng: 139.6917,
					status: "open" as const,
					placeName: "Test Place",
					description: "Test description",
					distance: 100,
				},
			],
		};
		vi.mocked(client.apiRequest).mockResolvedValue(mockResponse);

		const result = await getRequests({ lat: 35.6895, lng: 139.6917 });

		expect(result).toEqual(mockResponse);
	});
});

describe("createRequest", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("POSTメソッドで正しいパスとボディとトークンでapiRequestを呼び出す", async () => {
		const mockInput = {
			lat: 35.6895,
			lng: 139.6917,
			placeName: "新宿駅",
			description: "駅前の混雑状況を教えてください",
		};
		const mockToken = "test-token-123";
		const mockResponse = {
			id: 1,
			lat: 35.6895,
			lng: 139.6917,
			status: "open" as const,
			placeName: "新宿駅",
			description: "駅前の混雑状況を教えてください",
		};
		vi.mocked(auth.getAuthToken).mockReturnValue(mockToken);
		vi.mocked(client.apiRequest).mockResolvedValue(mockResponse);

		await createRequest(mockInput);

		expect(auth.getAuthToken).toHaveBeenCalled();
		expect(client.apiRequest).toHaveBeenCalledWith("/api/v1/requests", {
			method: "POST",
			body: mockInput,
			token: mockToken,
		});
	});

	it("placeNameを含むリクエストを作成できる", async () => {
		const mockInput = {
			lat: 35.6895,
			lng: 139.6917,
			placeName: "新宿駅",
			description: "駅前の混雑状況を教えてください",
		};
		const mockToken = "test-token-123";
		const mockResponse = {
			id: 1,
			lat: 35.6895,
			lng: 139.6917,
			status: "open" as const,
			placeName: "新宿駅",
			description: "駅前の混雑状況を教えてください",
		};
		vi.mocked(auth.getAuthToken).mockReturnValue(mockToken);
		vi.mocked(client.apiRequest).mockResolvedValue(mockResponse);

		await createRequest(mockInput);

		expect(client.apiRequest).toHaveBeenCalledWith("/api/v1/requests", {
			method: "POST",
			body: mockInput,
			token: mockToken,
		});
	});

	it("apiRequestのレスポンスを正しく返す", async () => {
		const mockInput = {
			lat: 35.6895,
			lng: 139.6917,
			placeName: "新宿駅",
			description: "駅前の混雑状況を教えてください",
		};
		const mockToken = "test-token-123";
		const mockResponse = {
			id: 1,
			lat: 35.6895,
			lng: 139.6917,
			status: "open" as const,
			placeName: "新宿駅",
			description: "駅前の混雑状況を教えてください",
		};
		vi.mocked(auth.getAuthToken).mockReturnValue(mockToken);
		vi.mocked(client.apiRequest).mockResolvedValue(mockResponse);

		const result = await createRequest(mockInput);

		expect(result).toEqual(mockResponse);
	});
});
