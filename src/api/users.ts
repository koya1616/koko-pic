import type { ApiUser } from "../types/api";
import { apiRequest } from "../utils/api";

export const createUser = async (
	email: string,
	displayName: string,
	password: string,
) =>
	apiRequest<ApiUser>("/api/v1/users", {
		method: "POST",
		body: { email, display_name: displayName, password },
	});

export const fetchCurrentUser = async (token: string) =>
	apiRequest<ApiUser>("/api/v1/users/me", {
		token,
	});
