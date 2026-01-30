import type { ResendVerificationRequest } from "../../../shared/types/api";
import { apiRequest } from "../../../shared/api/client";

export const resendVerificationEmail = async (
	request: ResendVerificationRequest,
) =>
	apiRequest<void>("/api/v1/resend-verification", {
		method: "POST",
		body: request,
	});
