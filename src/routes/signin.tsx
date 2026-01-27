import { createFileRoute } from "@tanstack/react-router";
import SigninScreen from "../screens/SigninScreen";

export const Route = createFileRoute("/signin")({
	component: SigninScreen,
});
