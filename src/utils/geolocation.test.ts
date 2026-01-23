import { describe, expect, it } from "vitest";
import { geoErrorToMessage } from "./geolocation";

describe("geoErrorToMessage", () => {
	it("エラーコードが1のときは権限拒否のメッセージを返す", () => {
		const message = geoErrorToMessage({ code: 1 });

		expect(message).toBe("位置情報の利用が許可されていません。");
	});

	it("それ以外のエラーコードの場合は汎用的なエラーメッセージを返す", () => {
		const message = geoErrorToMessage({ code: 2 });

		expect(message).toBe("位置情報の取得に失敗しました。");
	});
});
