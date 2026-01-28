import { apiRequest } from "../shared/api/client";

export const resendVerificationEmail = async (email: string) =>
	apiRequest<void>("/api/v1/resend-verification", {
		method: "POST",
		body: { email },
	});
