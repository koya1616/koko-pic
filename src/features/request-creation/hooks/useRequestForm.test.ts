import { describe, expect, it } from "vitest";
import { getRequestTextError } from "./useRequestForm";

describe("getRequestTextError", () => {
	it("入力が空文字または空白のみの場合はバリデーションエラーを返す", () => {
		expect(getRequestTextError("")).toBe("依頼内容を入力してください");
		expect(getRequestTextError("   ")).toBe("依頼内容を入力してください");
	});

	it("有効な入力の場合はエラーなしとしてnullを返す", () => {
		expect(getRequestTextError("依頼します")).toBeNull();
	});
});
