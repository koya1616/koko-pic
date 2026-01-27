import { createFileRoute } from "@tanstack/react-router";
import EmailVerificationScreen from "../screens/EmailVerificationScreen";

export const Route = createFileRoute("/verify-email/$token")({
	component: EmailVerificationScreen,
});
