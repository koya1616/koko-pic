import type React from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useCamera } from "../hooks/useCamera";
import { useTranslation } from "../shared/context/LanguageContext";
import { useSnackbar } from "../shared/context/SnackbarContext";
import { mockRequests } from "../data/mockRequests";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

const PhotoCaptureScreen: React.FC = () => {
	useAuthRedirect();

	const navigate = useNavigate();
	const { requestId } = useParams({ from: "/photo/$requestId" });
	const { showSnackbar } = useSnackbar();
	const { t } = useTranslation();
	const {
		cameraStream,
		capturedImage,
		canvasRef,
		handleCapture,
		toggleCamera,
		videoRef,
	} = useCamera();

	const request = mockRequests.find((r) => String(r.id) === requestId) ?? null;

	const handleSubmit = () => {
		showSnackbar(t("photoSubmitted"), "success");
		navigate({ to: "/" });
	};

	return (
		<div className="flex flex-col h-full bg-gray-50 p-4">
			{/* Header */}
			<header className="flex items-center mb-4">
				<button
					type="button"
					className="mr-2 text-gray-600"
					onClick={() => navigate({ to: "/" })}
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
								{/* Camera Toggle Button */}
								<button
									type="button"
									className="absolute top-4 right-4"
									onClick={toggleCamera}
									aria-label="Toggle camera"
								>
									<span className="text-2xl">↺</span>
								</button>
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
