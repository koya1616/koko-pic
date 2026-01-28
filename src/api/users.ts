import type { ApiUser } from "../shared/types/api";
import { apiRequest } from "../shared/api/client";

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
