import { createFileRoute } from "@tanstack/react-router";
import { EmailVerificationScreen } from "../features/auth";

export const Route = createFileRoute("/verify-email/$token")({
	component: EmailVerificationScreen,
});
