import { describe, expect, it } from "vitest";
import { formatDistance, haversineMeters } from "./distance";

describe("formatDistance", () => {
	it("距離が1000未満の場合はメートル単位の表記に整形する", () => {
		expect(formatDistance(0)).toBe("0m");
		expect(formatDistance(999)).toBe("999m");
	});

	it("キロメートル表記では末尾の不要な0を取り除いて表示する", () => {
		expect(formatDistance(1000)).toBe("1km");
		expect(formatDistance(1001)).toBe("1km");
		expect(formatDistance(1500)).toBe("1.5km");
	});
});

describe("haversineMeters", () => {
	it("同じ座標同士の距離計算では0を返す", () => {
		expect(haversineMeters({ lat: 0, lng: 0 }, { lat: 0, lng: 0 })).toBe(0);
	});

	it("赤道上の既知の座標間距離が期待値になることを確認する", () => {
		const distance = haversineMeters({ lat: 0, lng: 0 }, { lat: 0, lng: 1 });
		expect(distance).toBeCloseTo(111195, 0);
	});
});
