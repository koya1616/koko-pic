import { STORAGE_KEYS } from "../constants/storage";

export const getAuthToken = (): string => {
	const token = localStorage.getItem(STORAGE_KEYS.authToken);

	if (!token) {
		window.location.href = "/signin";
		throw new Error("No auth token found");
	}

	return token;
};
