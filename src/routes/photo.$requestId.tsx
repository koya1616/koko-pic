import { createFileRoute } from "@tanstack/react-router";
import { PhotoCaptureScreen } from "../features/photo-capture";

export const Route = createFileRoute("/photo/$requestId")({
	component: PhotoCaptureScreen,
});
