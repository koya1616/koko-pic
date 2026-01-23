import { describe, expect, it } from "vitest";
import { geoErrorToMessage } from "./geolocation";

describe("geoErrorToMessage", () => {
	it("returns permission denied message when code is 1", () => {
		const message = geoErrorToMessage({ code: 1 });

		expect(message).toBe("位置情報の利用が許可されていません。");
	});

	it("returns generic message for other errors", () => {
		const message = geoErrorToMessage({ code: 2 });

		expect(message).toBe("位置情報の取得に失敗しました。");
	});
});
