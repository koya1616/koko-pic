import { describe, expect, it } from "vitest";
import {
	buildGeocodeUrl,
	formatLocationSummary,
	parseGeocodeCoordinates,
} from "./geocode";

const parseSearchParams = (urlString: string) =>
	new URL(urlString).searchParams;

describe("buildGeocodeUrl", () => {
	it("位置情報が未設定の場合はviewboxを付与せず、基本のジオコードURLを組み立てる", () => {
		const params = parseSearchParams(
			buildGeocodeUrl({
				query: "Tokyo",
				language: "en",
				selectedLocation: null,
			}),
		);

		expect(params.get("format")).toBe("jsonv2");
		expect(params.get("limit")).toBe("10");
		expect(params.get("q")).toBe("Tokyo");
		expect(params.get("accept-language")).toBe("en");
		expect(params.has("viewbox")).toBe(false);
		expect(params.has("bounded")).toBe(false);
	});

	it("位置情報がある場合はviewboxとboundedを追加し、検索範囲を限定したURLを組み立てる", () => {
		const params = parseSearchParams(
			buildGeocodeUrl({
				query: "Cafe",
				language: "ja",
				selectedLocation: { lat: 35.0, lng: 139.0 },
			}),
		);

		expect(params.get("accept-language")).toBe("ja");
		expect(params.get("bounded")).toBe("1");

		const viewbox = params.get("viewbox");
		expect(viewbox).not.toBeNull();
		const [left, top, right, bottom] =
			viewbox?.split(",").map((value) => Number(value)) ?? [];

		expect(left).toBeLessThan(139.0);
		expect(right).toBeGreaterThan(139.0);
		expect(top).toBeGreaterThan(35.0);
		expect(bottom).toBeLessThan(35.0);
	});
});

describe("parseGeocodeCoordinates", () => {
	it("緯度経度が数値として解釈できない場合はnullを返す", () => {
		const result = parseGeocodeCoordinates({
			display_name: "invalid",
			lat: "not-a-number",
			lon: "139.0",
		});

		expect(result).toBeNull();
	});

	it("緯度と経度を数値に変換して正しく取得できる", () => {
		const result = parseGeocodeCoordinates({
			display_name: "valid",
			lat: "35.123",
			lon: "139.456",
		});

		expect(result).toEqual({ lat: 35.123, lng: 139.456 });
	});
});

describe("formatLocationSummary", () => {
	it("位置情報が欠けている場合はプレースホルダー文字列を返す", () => {
		expect(formatLocationSummary(null)).toBe("未設定");
	});

	it("座標の表示を小数点以下5桁に整形する", () => {
		expect(formatLocationSummary({ lat: 35.123456, lng: 139.987654 })).toBe(
			"35.12346, 139.98765",
		);
	});
});
