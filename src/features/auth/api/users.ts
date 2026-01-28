import type { ApiUser, CreateUserRequest } from "../../../shared/types/api";
import { apiRequest } from "../../../shared/api/client";
import { getAuthToken } from "../../../shared/utils/auth";

export const createUser = async (request: CreateUserRequest) =>
	apiRequest<ApiUser>("/api/v1/users", {
		method: "POST",
		body: request,
	});

export const fetchCurrentUser = async () => {
	const token = getAuthToken();
	return apiRequest<ApiUser>("/api/v1/users/me", {
		token,
	});
};
