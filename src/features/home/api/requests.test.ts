import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getRequests } from "./requests";
import * as client from "../../../shared/api/client";

vi.mock("../../../shared/api/client", () => ({
	apiRequest: vi.fn(),
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
