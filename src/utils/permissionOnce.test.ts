import { describe, expect, it, vi, beforeEach } from "vitest";
import {
	markPermissionGranted,
	shouldRequestPermissionOnce,
} from "./permissionOnce";

const createStorage = () => {
	const store = new Map<string, string>();
	return {
		getItem: (key: string) => store.get(key) ?? null,
		setItem: (key: string, value: string) => {
			store.set(key, value);
		},
		removeItem: (key: string) => {
			store.delete(key);
		},
		clear: () => {
			store.clear();
		},
	};
};

const setPermissionState = (state: PermissionState | null) => {
	if (!state) {
		vi.stubGlobal("navigator", {});
		return;
	}
	vi.stubGlobal("navigator", {
		permissions: {
			query: vi.fn().mockResolvedValue({ state }),
		},
	});
};

describe("permissionOnce", () => {
	beforeEach(() => {
		vi.unstubAllGlobals();
		vi.stubGlobal("localStorage", createStorage());
	});

	it("初回は許可リクエストを許可し、2回目は抑止する", async () => {
		setPermissionState(null);

		const first = await shouldRequestPermissionOnce("camera");
		const second = await shouldRequestPermissionOnce("camera");

		expect(first).toBe(true);
		expect(second).toBe(false);
	});

	it("Permission API が granted の場合は常に許可する", async () => {
		setPermissionState("granted");

		const result = await shouldRequestPermissionOnce(
			"geolocation",
			"geolocation",
		);

		expect(result).toBe(true);
	});

	it("Permission API が denied の場合は抑止する", async () => {
		setPermissionState("denied");

		const result = await shouldRequestPermissionOnce("camera", "camera");

		expect(result).toBe(false);
	});

	it("明示的に許可済みを保存できる", async () => {
		setPermissionState(null);

		markPermissionGranted("camera");
		const result = await shouldRequestPermissionOnce("camera");

		expect(result).toBe(true);
	});
});
