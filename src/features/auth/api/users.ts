import type { ApiUser, CreateUserRequest } from "../../../shared/types/api";
import { apiRequest } from "../../../shared/api/client";
import { STORAGE_KEYS } from "../../../shared/constants/storage";

export const createUser = async (request: CreateUserRequest) =>
	apiRequest<ApiUser>("/api/v1/users", {
		method: "POST",
		body: request,
	});

export const fetchCurrentUser = async () => {
	const token = localStorage.getItem(STORAGE_KEYS.authToken) || "";
	return apiRequest<ApiUser>("/api/v1/users/me", {
		token,
	});
};
