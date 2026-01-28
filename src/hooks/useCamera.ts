import { useCallback, useEffect, useRef, useState } from "react";
import {
	markPermissionGranted,
	shouldRequestPermissionOnce,
} from "../shared/utils/permissionOnce";

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

	const startCamera = useCallback(
		async (mode: "user" | "environment" = facingMode) => {
			try {
				const canRequest = await shouldRequestPermissionOnce(
					"camera",
					"camera",
				);
				if (!canRequest) {
					return;
				}
				const stream = await navigator.mediaDevices.getUserMedia({
					video: { facingMode: mode },
					audio: false,
				});
				markPermissionGranted("camera");
				setCameraStream(stream);
				setFacingMode(mode);
				setCapturedImage(null);
			} catch (error) {
				console.error("Failed to start camera", error);
			}
		},
		[facingMode],
	);

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
		const nextFacingMode = facingMode === "user" ? "environment" : "user";
		const currentTrack = cameraStream?.getVideoTracks()[0];

		if (currentTrack?.applyConstraints) {
			try {
				await currentTrack.applyConstraints({
					facingMode: { ideal: nextFacingMode },
				});
				setFacingMode(nextFacingMode);
				return;
			} catch (error) {
				console.warn("Failed to switch camera via constraints", error);
			}
		}

		stopCamera();
		await startCamera(nextFacingMode);
	}, [cameraStream, facingMode, startCamera, stopCamera]);

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
