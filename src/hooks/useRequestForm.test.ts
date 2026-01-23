import { describe, expect, it } from "vitest";
import { getRequestTextError } from "./useRequestForm";

describe("getRequestTextError", () => {
	it("returns an error for empty or whitespace-only input", () => {
		expect(getRequestTextError("")).toBe("依頼内容を入力してください");
		expect(getRequestTextError("   ")).toBe("依頼内容を入力してください");
	});

	it("returns null for valid input", () => {
		expect(getRequestTextError("依頼します")).toBeNull();
	});
});
