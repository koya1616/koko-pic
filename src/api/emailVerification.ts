import { apiRequest } from "../utils/api";

export const resendVerificationEmail = async (email: string) =>
	apiRequest<void>("/api/v1/resend-verification", {
		method: "POST",
		body: { email },
	});
