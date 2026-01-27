import { createFileRoute } from "@tanstack/react-router";
import EmailVerificationRequiredScreen from "../screens/EmailVerificationRequiredScreen";

export const Route = createFileRoute("/email-verification-required")({
	component: EmailVerificationRequiredScreen,
});
