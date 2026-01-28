import type { ApiError } from "../types/api";
import { STORAGE_KEYS } from "../constants/storage";

const DEFAULT_API_BASE_URL = "http://0.0.0.0:8000";

export const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

const buildHeaders = (options?: { body?: unknown; token?: string }) => {
	const headers = new Headers();
	if (options?.body !== undefined) {
		headers.set("Content-Type", "application/json");
	}
	if (options?.token) {
		headers.set("Authorization", `Bearer ${options.token}`);
	}
	return headers;
};

const parseErrorMessage = async (response: Response) => {
	try {
		const data = (await response.json()) as ApiError;
		if (data?.error) {
			return data.error;
		}
	} catch {
		// Ignore JSON parsing errors.
	}
	return response.statusText || "Request failed";
};

export const apiRequest = async <T>(
	path: string,
	options?: {
		method?: string;
		body?: unknown;
		token?: string;
		signal?: AbortSignal;
	},
): Promise<T> => {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		method: options?.method ?? "GET",
		headers: buildHeaders(options),
		body:
			options?.body !== undefined ? JSON.stringify(options.body) : undefined,
		signal: options?.signal,
	});

	if (response.status === 401) {
		localStorage.removeItem(STORAGE_KEYS.authToken);
		window.location.href = "/signin";
		throw new Error("Unauthorized: Please log in again.");
	}

	if (!response.ok) {
		const message = await parseErrorMessage(response);
		throw new Error(message);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	const text = await response.text();
	if (!text) {
		return undefined as T;
	}

	return JSON.parse(text) as T;
};

export const fetchJson = async <T>(
	input: RequestInfo | URL,
	init?: RequestInit,
): Promise<T> => {
	const response = await fetch(input, init);
	if (!response.ok) {
		throw new Error(response.statusText || "Request failed");
	}
	return (await response.json()) as T;
};
