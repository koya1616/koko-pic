import type { LoginResponse } from "../types/api";
import { apiRequest } from "../utils/api";

type VerifyEmailResponse = {
	token: string;
	user_id: string;
	email: string;
	display_name: string;
};

export const login = async (email: string, password: string) =>
	apiRequest<LoginResponse>("/api/v1/login", {
		method: "POST",
		body: { email, password },
	});

export const verifyEmail = async (token: string) =>
	apiRequest<VerifyEmailResponse>(`/api/v1/verify-email/${token}`);
