import { useCallback, useEffect, useRef, useState } from "react";

export const useCamera = () => {
	const [capturedImage, setCapturedImage] = useState<string | null>(null);
	const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
	const [facingMode, setFacingMode] = useState<"user" | "environment">(
		"environment",
	);
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

	const stopCamera = useCallback(() => {
		stopStream(cameraStream);
		setCameraStream(null);
	}, [cameraStream, stopStream]);

	const startCamera = useCallback(async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode },
				audio: false,
			});
			setCameraStream(stream);
			setCapturedImage(null);
		} catch (error) {
			console.error("Failed to start camera", error);
		}
	}, [facingMode]);

	const captureFrame = useCallback(() => {
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
	}, [stopCamera]);

	const handleCapture = useCallback(async () => {
		if (!cameraStream) {
			await startCamera();
			return;
		}
		captureFrame();
	}, [cameraStream, captureFrame, startCamera]);

	const toggleCamera = useCallback(async () => {
		stopCamera();
		setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
		// Wait for state update and restart camera
		await new Promise((resolve) => setTimeout(resolve, 100));
		await startCamera();
	}, [stopCamera, startCamera]);

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

	return {
		canvasRef,
		cameraStream,
		capturedImage,
		facingMode,
		handleCapture,
		toggleCamera,
		videoRef,
	};
};
