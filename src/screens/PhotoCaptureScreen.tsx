import type React from "react";
import type { Request } from "../types/request";
import { useCamera } from "../hooks/useCamera";
import { useTranslation } from "../context/LanguageContext";

type Screen = "home" | "request-creation" | "photo-capture";

const PhotoCaptureScreen: React.FC<{
	navigateTo: (screen: Screen) => void;
	request: Request | null;
	showSnackbar: (message: string, type?: "success" | "error" | "info") => void;
}> = ({ navigateTo, request, showSnackbar }) => {
	const { t } = useTranslation();
	const { cameraStream, capturedImage, canvasRef, handleCapture, videoRef } =
		useCamera();

	const handleSubmit = () => {
		showSnackbar(t("photoSubmitted"), "success");
		navigateTo("home");
	};

	return (
		<div className="flex flex-col h-full bg-gray-50 p-4">
			{/* Header */}
			<header className="flex items-center mb-4">
				<button
					type="button"
					className="mr-2 text-gray-600"
					onClick={() => navigateTo("home")}
				>
					{t("back")}
				</button>
				<h1 className="text-lg font-semibold">{t("createRequest")}</h1>
			</header>

			<div className="flex flex-col flex-1 min-h-0">
				{/* Camera Preview - Only show when camera is active */}
				{(capturedImage || cameraStream) && (
					<div
						className="relative bg-gray-200 rounded-lg mb-4 overflow-hidden flex items-center justify-center"
						style={{ height: "60vh" }}
					>
						{capturedImage ? (
							<div className="aspect-video w-full h-full flex items-center justify-center">
								<img
									src={capturedImage}
									alt="Captured"
									className="w-full h-full object-cover rounded-lg"
								/>
							</div>
						) : cameraStream ? (
							<div className="aspect-video w-full h-full flex items-center justify-center">
								<video
									ref={videoRef}
									className="w-full h-full object-cover rounded-lg"
									playsInline
									muted
								/>
							</div>
						) : null}
					</div>
				)}

				{/* Hidden Canvas for Image Capture */}
				<canvas ref={canvasRef} style={{ display: "none" }} />

				{/* Request Info */}
				<div className="bg-white p-3 rounded-lg mb-4 shadow-sm">
					<div className="font-medium">
						{request?.description || t("noRequestDescription")}
					</div>
				</div>

				{/* Action Buttons */}
				<div className="mb-4">
					<button
						type="button"
						className="w-full py-3 bg-gray-200 rounded-lg font-medium flex items-center justify-center"
						onClick={handleCapture}
					>
						📷{" "}
						{!cameraStream && !capturedImage
							? t("captureStart")
							: cameraStream
								? t("shutter")
								: t("retake")}
					</button>
				</div>

				{/* Submit Button */}
				<button
					type="button"
					className={`py-3 rounded-lg font-medium flex items-center justify-center ${
						capturedImage
							? "bg-green-accent text-white hover:bg-green-600"
							: "bg-gray-300 text-gray-500 cursor-not-allowed"
					}`}
					disabled={!capturedImage}
					onClick={handleSubmit}
				>
					🚀 {t("submitPhoto")}
				</button>
			</div>
		</div>
	);
};

export default PhotoCaptureScreen;
