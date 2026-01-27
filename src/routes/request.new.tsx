import { createFileRoute } from "@tanstack/react-router";
import RequestCreationScreen from "../screens/RequestCreationScreen";

export const Route = createFileRoute("/request/new")({
	component: RequestCreationScreen,
});
