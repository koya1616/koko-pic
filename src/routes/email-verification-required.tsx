import { createFileRoute } from "@tanstack/react-router";
import { EmailVerificationRequiredScreen } from "../features/auth";

export const Route = createFileRoute("/email-verification-required")({
	component: EmailVerificationRequiredScreen,
});
