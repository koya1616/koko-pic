import { createFileRoute } from "@tanstack/react-router";
import { AccountScreen } from "../features/account";

export const Route = createFileRoute("/account")({
	component: AccountScreen,
});
