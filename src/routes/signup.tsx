import { createFileRoute } from "@tanstack/react-router";
import SignupScreen from "../screens/SignupScreen";

export const Route = createFileRoute("/signup")({
	component: SignupScreen,
});
