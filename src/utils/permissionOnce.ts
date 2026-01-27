const PERMISSION_STATUS_PREFIX = "koko-pic.permission.";

type PermissionStatus = "requested" | "granted";

const getPermissionKey = (key: string) => `${PERMISSION_STATUS_PREFIX}${key}`;

const readStatus = (key: string): PermissionStatus | null => {
	try {
		const stored = localStorage.getItem(getPermissionKey(key));
		if (stored === "requested" || stored === "granted") {
			return stored;
		}
		return null;
	} catch {
		return null;
	}
};

const writeStatus = (key: string, status: PermissionStatus) => {
	try {
		localStorage.setItem(getPermissionKey(key), status);
	} catch {
		// Ignore storage errors; fall back to in-memory flow.
	}
};

const queryPermissionState = async (
	permissionName: string,
): Promise<PermissionState | null> => {
	if (!navigator.permissions?.query) {
		return null;
	}
	try {
		const status = await navigator.permissions.query({
			name: permissionName as PermissionName,
		});
		return status.state;
	} catch {
		return null;
	}
};

export const shouldRequestPermissionOnce = async (
	key: string,
	permissionName?: string,
) => {
	const state = permissionName
		? await queryPermissionState(permissionName)
		: null;
	if (state === "granted") {
		writeStatus(key, "granted");
		return true;
	}
	if (state === "denied") {
		writeStatus(key, "requested");
		return false;
	}

	const storedStatus = readStatus(key);
	if (storedStatus === "granted") {
		return true;
	}
	if (storedStatus === "requested") {
		return false;
	}

	writeStatus(key, "requested");
	return true;
};

export const markPermissionGranted = (key: string) => {
	writeStatus(key, "granted");
};
