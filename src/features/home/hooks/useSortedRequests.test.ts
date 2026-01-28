import { describe, expect, it } from "vitest";
import { sortRequestsByDistance } from "./useSortedRequests";
import type { Request } from "../../../shared/types/request";

const createRequest = (
	id: number,
	lat: number,
	lng: number,
	description = "test",
): Request => ({
	id,
	location: {
		lat,
		lng,
		source: "map",
		capturedAt: "2024-01-01T00:00:00.000Z",
	},
	status: "open",
	description,
});

describe("sortRequestsByDistance", () => {
	it("userLocationがnullの場合は距離計算を行わず、入力された配列をそのまま返す", () => {
		const requests = [createRequest(1, 0, 0), createRequest(2, 0, 0.02)];

		expect(sortRequestsByDistance(requests, null)).toBe(requests);
	});

	it("ユーザー位置からの距離で近い順に並べ替え、距離をメートル単位で丸める", () => {
		const userLocation = { lat: 0, lng: 0 };
		const requests = [createRequest(1, 0, 0.02), createRequest(2, 0, 0.01)];

		const sorted = sortRequestsByDistance(requests, userLocation);

		expect(sorted.map((request) => request.id)).toEqual([2, 1]);
		expect(sorted[0]?.distance).toBe(1112);
		expect(sorted[1]?.distance).toBe(2224);
	});

	it("位置情報が欠けているリクエストは距離計算の対象外とし、配列の末尾に並べる", () => {
		const userLocation = { lat: 0, lng: 0 };
		const requests: Request[] = [
			createRequest(1, 0, 0.02),
			{ id: 2, status: "open", description: "no location" },
			createRequest(3, 0, 0.01),
		];

		const sorted = sortRequestsByDistance(requests, userLocation);

		expect(sorted.map((request) => request.id)).toEqual([3, 1, 2]);
		expect(sorted[2]?.distance).toBeUndefined();
	});
});
