import type React from "react";
import type { Request } from "../types/request";
import { useCamera } from "../hooks/useCamera";

type Screen = "home" | "request-creation" | "photo-capture";

const PhotoCaptureScreen: React.FC<{
	navigateTo: (screen: Screen) => void;
	request: Request | null;
	showSnackbar: (message: string, type?: "success" | "error" | "info") => void;
}> = ({ navigateTo, request, showSnackbar }) => {
	const { cameraStream, capturedImage, canvasRef, handleCapture, videoRef } =
		useCamera();

	const handleSubmit = () => {
		showSnackbar("写真が正常に送信されました", "success");
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
					← 戻る
				</button>
				<h1 className="text-lg font-semibold">撮影依頼</h1>
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
						{request?.description || "依頼内容がありません"}
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
							? "撮影開始"
							: cameraStream
								? "シャッター"
								: "撮り直す"}
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
					🚀 写真を送信
				</button>
			</div>
		</div>
	);
};

export default PhotoCaptureScreen;
