import { afterEach, describe, expect, it, vi } from "vitest";
import { API_BASE_URL, apiRequest, fetchJson } from "./api";

afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe("apiRequest", () => {
	it("JSONレスポンスを返し、ベースURLとヘッダーを組み立てる", async () => {
		const fetchSpy = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ id: 1 }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			}),
		);
		vi.stubGlobal("fetch", fetchSpy);

		const result = await apiRequest<{ id: number }>("/api/v1/test", {
			method: "POST",
			body: { name: "koko" },
			token: "token-123",
		});

		expect(result).toEqual({ id: 1 });
		expect(fetchSpy).toHaveBeenCalledTimes(1);
		const [url, init] = fetchSpy.mock.calls[0] ?? [];
		expect(url).toBe(`${API_BASE_URL}/api/v1/test`);
		expect(init?.method).toBe("POST");
		expect(init?.body).toBe(JSON.stringify({ name: "koko" }));

		const headers = new Headers(init?.headers);
		expect(headers.get("Content-Type")).toBe("application/json");
		expect(headers.get("Authorization")).toBe("Bearer token-123");
	});

	it("エラーレスポンスのerrorメッセージを投げる", async () => {
		const fetchSpy = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ error: "Bad request" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			}),
		);
		vi.stubGlobal("fetch", fetchSpy);

		await expect(apiRequest("/api/v1/test")).rejects.toThrow("Bad request");
	});

	it("JSONを返さないエラー時はstatusTextを使う", async () => {
		const fetchSpy = vi
			.fn()
			.mockResolvedValue(
				new Response("oops", { status: 500, statusText: "Server Error" }),
			);
		vi.stubGlobal("fetch", fetchSpy);

		await expect(apiRequest("/api/v1/test")).rejects.toThrow("Server Error");
	});

	it("204の場合はundefinedを返す", async () => {
		const fetchSpy = vi
			.fn()
			.mockResolvedValue(new Response(null, { status: 204 }));
		vi.stubGlobal("fetch", fetchSpy);

		const result = await apiRequest<void>("/api/v1/test");

		expect(result).toBeUndefined();
	});
});

describe("fetchJson", () => {
	it("OKレスポンスをJSONとして返す", async () => {
		const fetchSpy = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ ok: true }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			}),
		);
		vi.stubGlobal("fetch", fetchSpy);

		const result = await fetchJson<{ ok: boolean }>("/test");

		expect(result).toEqual({ ok: true });
	});

	it("エラー時はstatusTextで例外を投げる", async () => {
		const fetchSpy = vi
			.fn()
			.mockResolvedValue(
				new Response("ng", { status: 404, statusText: "Not Found" }),
			);
		vi.stubGlobal("fetch", fetchSpy);

		await expect(fetchJson("/test")).rejects.toThrow("Not Found");
	});
});
