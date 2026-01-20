import type React from "react";
import { useState } from "react";

interface Request {
	id: number;
	title: string;
	reward: number;
	description: string;
}

type Screen =
	| "home"
	| "request-creation"
	| "photo-capture"
	| "submission-complete";

const PhotoCaptureScreen: React.FC<{
	navigateTo: (screen: Screen) => void;
	request: Request | null;
}> = ({ navigateTo, request }) => {
	const [capturedImage, setCapturedImage] = useState<string | null>(null);
	const handleCapture = () => {
		// Simulate capturing an image
		setCapturedImage(
			"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9NTAgeT01NSBmb250LXNpemU9MTIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzAwMCI+UGhvdG88L3RleHQ+PC9zdmc+",
		);
	};

	const handleSubmit = () => {
		// Navigate to submission complete screen
		navigateTo("submission-complete");
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
				<h1 className="text-lg font-semibold">
					撮影依頼：{request?.title || "依頼"}
				</h1>
			</header>

			{/* Camera Preview */}
			<div className="flex-1 relative bg-gray-200 rounded-lg mb-4">
				{capturedImage ? (
					<img
						src={capturedImage}
						alt="Captured"
						className="w-full h-full object-cover rounded-lg"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<div className="text-gray-500">[ カメラプレビュー（全画面） ]</div>
					</div>
				)}
			</div>

			{/* Request Info */}
			<div className="bg-white p-3 rounded-lg mb-4 shadow-sm">
				<div className="font-medium">
					依頼内容：{request?.description || "依頼内容がありません"}
				</div>
				<div className="text-indigo font-semibold">
					報酬：¥{request?.reward || 0}
				</div>
			</div>

			{/* Action Buttons */}
			<div className="mb-4">
				<button
					type="button"
					className="w-full py-3 bg-gray-200 rounded-lg font-medium flex items-center justify-center"
					onClick={handleCapture}
				>
					📷 撮影する
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
	);
};

export default PhotoCaptureScreen;
