import type { LoginResponse } from "../../../shared/types/api";
import { apiRequest } from "../../../shared/api/client";

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
