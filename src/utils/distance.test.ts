import { describe, expect, it } from "vitest";
import { formatDistance, haversineMeters } from "./distance";

describe("formatDistance", () => {
	it("formats meters under 1000", () => {
		expect(formatDistance(0)).toBe("0m");
		expect(formatDistance(999)).toBe("999m");
	});

	it("formats kilometers with trimming", () => {
		expect(formatDistance(1000)).toBe("1km");
		expect(formatDistance(1001)).toBe("1km");
		expect(formatDistance(1500)).toBe("1.5km");
	});
});

describe("haversineMeters", () => {
	it("returns zero for identical points", () => {
		expect(haversineMeters({ lat: 0, lng: 0 }, { lat: 0, lng: 0 })).toBe(0);
	});

	it("returns a known distance at the equator", () => {
		const distance = haversineMeters({ lat: 0, lng: 0 }, { lat: 0, lng: 1 });
		expect(distance).toBeCloseTo(111195, 0);
	});
});
