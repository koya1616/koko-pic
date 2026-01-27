import { createFileRoute } from "@tanstack/react-router";
import AccountScreen from "../screens/AccountScreen";

export const Route = createFileRoute("/account")({
	component: AccountScreen,
});
