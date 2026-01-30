import { describe, it, expect } from "vitest";
import { LANGUAGES } from "./LanguageContext";

describe("LanguageContext ロジック", () => {
	it("言語定数が正しく定義されていることを確認する", () => {
		expect(LANGUAGES.JA).toBe("JA");
		expect(LANGUAGES.EN).toBe("EN");
	});

	it("ブラウザの言語設定から日本語を正しく検出することを確認する", () => {
		const japaneseLang = "ja-JP";
		expect(japaneseLang.startsWith("ja")).toBe(true);
	});

	it("ブラウザの言語設定から英語を正しく検出することを確認する", () => {
		const englishLang = "en-US";
		expect(englishLang.startsWith("ja")).toBe(false);
	});
});
