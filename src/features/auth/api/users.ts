import type { ApiUser, CreateUserRequest } from "../../../shared/types/api";
import { apiRequest } from "../../../shared/api/client";

export const createUser = async (request: CreateUserRequest) =>
	apiRequest<ApiUser>("/api/v1/users", {
		method: "POST",
		body: request,
	});

export const fetchCurrentUser = async (token: string) =>
	apiRequest<ApiUser>("/api/v1/users/me", {
		token,
	});
