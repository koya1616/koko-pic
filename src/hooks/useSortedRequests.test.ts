import { describe, expect, it } from "vitest";
import { sortRequestsByDistance } from "./useSortedRequests";
import type { Request } from "../types/request";

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
	it("returns the original array when userLocation is null", () => {
		const requests = [createRequest(1, 0, 0), createRequest(2, 0, 0.02)];

		expect(sortRequestsByDistance(requests, null)).toBe(requests);
	});

	it("sorts by distance and rounds to meters", () => {
		const userLocation = { lat: 0, lng: 0 };
		const requests = [createRequest(1, 0, 0.02), createRequest(2, 0, 0.01)];

		const sorted = sortRequestsByDistance(requests, userLocation);

		expect(sorted.map((request) => request.id)).toEqual([2, 1]);
		expect(sorted[0]?.distance).toBe(1112);
		expect(sorted[1]?.distance).toBe(2224);
	});

	it("keeps requests without location at the end", () => {
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
