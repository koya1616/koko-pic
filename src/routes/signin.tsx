import { createFileRoute } from "@tanstack/react-router";
import { SigninScreen } from "../features/auth";

export const Route = createFileRoute("/signin")({
	component: SigninScreen,
});
