import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Request {
	id: number;
	description: string;
}

type Screen = "home" | "request-creation" | "photo-capture";

const PhotoCaptureScreen: React.FC<{
	navigateTo: (screen: Screen) => void;
	request: Request | null;
	showSnackbar: (message: string, type?: "success" | "error" | "info") => void;
}> = ({ navigateTo, request, showSnackbar }) => {
	const [capturedImage, setCapturedImage] = useState<string | null>(null);
	const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const stopStream = useCallback((stream: MediaStream | null) => {
		if (!stream) {
			return;
		}
		for (const track of stream.getTracks()) {
			track.stop();
		}
	}, []);

	const stopCamera = () => {
		stopStream(cameraStream);
		setCameraStream(null);
	};

	const startCamera = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: false,
			});
			setCameraStream(stream);
			setCapturedImage(null);
		} catch (error) {
			console.error("Failed to start camera", error);
		}
	};

	const captureFrame = () => {
		const videoElement = videoRef.current;
		const canvasElement = canvasRef.current;
		if (!videoElement || !canvasElement) {
			return;
		}
		const { videoWidth, videoHeight } = videoElement;
		if (!videoWidth || !videoHeight) {
			return;
		}
		canvasElement.width = videoWidth;
		canvasElement.height = videoHeight;
		const context = canvasElement.getContext("2d");
		if (!context) {
			return;
		}
		context.drawImage(videoElement, 0, 0, videoWidth, videoHeight);
		setCapturedImage(canvasElement.toDataURL("image/jpeg", 0.9));
		stopCamera();
	};

	const handleCapture = async () => {
		if (!cameraStream) {
			await startCamera();
			return;
		}
		captureFrame();
	};

	const handleSubmit = () => {
		showSnackbar("写真が正常に送信されました", "success");
		navigateTo("home");
	};

	useEffect(() => {
		const videoElement = videoRef.current;
		if (!videoElement || !cameraStream) {
			return;
		}
		videoElement.srcObject = cameraStream;
		void videoElement.play();
	}, [cameraStream]);

	useEffect(() => {
		if (!cameraStream) {
			return;
		}
		return () => stopStream(cameraStream);
	}, [cameraStream, stopStream]);

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
					<div className="flex-1 relative bg-gray-200 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
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
						依頼内容：{request?.description || "依頼内容がありません"}
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
