import { createFileRoute } from "@tanstack/react-router";
import PhotoCaptureScreen from "../screens/PhotoCaptureScreen";

export const Route = createFileRoute("/photo/$requestId")({
	component: PhotoCaptureScreen,
});
