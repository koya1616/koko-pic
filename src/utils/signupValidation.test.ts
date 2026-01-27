import { describe, expect, it } from "vitest";
import { validateSignupPassword } from "./signupValidation";

describe("validateSignupPassword", () => {
	it("パスワードと確認パスワードが一致しない場合はエラーを返す", () => {
		const result = validateSignupPassword({
			password: "Password123",
			confirmPassword: "Password124",
		});

		expect(result).toBe("passwordsDoNotMatch");
	});

	it("パスワードが短すぎる場合はエラーを返す", () => {
		const result = validateSignupPassword({
			password: "Pass1",
			confirmPassword: "Pass1",
		});

		expect(result).toBe("passwordTooShort");
	});

	it("文字と数字を含まない場合はエラーを返す", () => {
		const result = validateSignupPassword({
			password: "passwordonly",
			confirmPassword: "passwordonly",
		});

		expect(result).toBe("passwordRequirements");
	});

	it("条件を満たす場合はnullを返す", () => {
		const result = validateSignupPassword({
			password: "Password123",
			confirmPassword: "Password123",
		});

		expect(result).toBeNull();
	});
});
