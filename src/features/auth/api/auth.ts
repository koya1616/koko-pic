import type {
	LoginRequest,
	LoginResponse,
	VerifyEmailResponse,
} from "../../../shared/types/api";
import { apiRequest } from "../../../shared/api/client";

export const login = async (request: LoginRequest) =>
	apiRequest<LoginResponse>("/api/v1/login", {
		method: "POST",
		body: request,
	});

export const verifyEmail = async (token: string) =>
	apiRequest<VerifyEmailResponse>(`/api/v1/verify-email/${token}`);
