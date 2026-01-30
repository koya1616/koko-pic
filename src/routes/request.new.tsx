import { createFileRoute } from "@tanstack/react-router";
import { RequestCreationScreen } from "../features/request-creation";

export const Route = createFileRoute("/request/new")({
	component: RequestCreationScreen,
});
