import { describe, expect, it } from "vitest";
import { formatDistance } from "./distance";

describe("formatDistance", () => {
	it("距離が1000未満の場合はメートル単位の表記に整形する", () => {
		expect(formatDistance(0)).toBe("0m");
		expect(formatDistance(999)).toBe("999m");
	});

	it("メートル表記では四捨五入して整数で表示する", () => {
		expect(formatDistance(123.5)).toBe("124m");
		expect(formatDistance(123.4)).toBe("123m");
		expect(formatDistance(100.0)).toBe("100m");
		expect(formatDistance(50.9)).toBe("51m");
	});

	it("キロメートル表記では末尾の不要な0を取り除いて表示する", () => {
		expect(formatDistance(1000)).toBe("1km");
		expect(formatDistance(1001)).toBe("1km");
		expect(formatDistance(1500)).toBe("1.5km");
	});
});
