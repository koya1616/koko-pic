import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getAuthToken } from "./auth";
import { STORAGE_KEYS } from "../constants/storage";

describe("getAuthToken", () => {
	const mockLocalStorage = {
		getItem: vi.fn(),
		setItem: vi.fn(),
		clear: vi.fn(),
		removeItem: vi.fn(),
		length: 0,
		key: vi.fn(),
	};

	beforeEach(() => {
		vi.stubGlobal("localStorage", mockLocalStorage);
		mockLocalStorage.getItem.mockReturnValue(null);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it("localStorageにトークンが存在する場合、そのトークンを返すこと", () => {
		const testToken = "test-token-123";
		mockLocalStorage.getItem.mockReturnValue(testToken);

		const result = getAuthToken();

		expect(result).toBe(testToken);
		expect(mockLocalStorage.getItem).toHaveBeenCalledWith(
			STORAGE_KEYS.authToken,
		);
	});

	it("localStorageにトークンが存在しない場合、アラートを表示し/signinにリダイレクトしてエラーを投げること", () => {
		const mockWindow = {
			location: { href: "" },
		};
		const mockAlert = vi.fn();
		vi.stubGlobal("window", mockWindow);
		vi.stubGlobal("alert", mockAlert);
		mockLocalStorage.getItem.mockReturnValue(null);

		expect(() => getAuthToken()).toThrow("No auth token found");
		expect(mockWindow.location.href).toBe("/signin");
	});
});
