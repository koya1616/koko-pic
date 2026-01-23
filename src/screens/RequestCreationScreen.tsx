import type React from "react";
import { useState } from "react";

type Screen = "home" | "request-creation" | "photo-capture";

const RequestCreationScreen: React.FC<{
	navigateTo: (screen: Screen) => void;
	showSnackbar: (message: string, type?: "success" | "error" | "info") => void;
}> = ({ navigateTo, showSnackbar }) => {
	const [requestText, setRequestText] = useState("");

	const handleSubmit = () => {
		if (!requestText.trim()) {
			showSnackbar("依頼内容を入力してください", "error");
			return;
		}

		showSnackbar("依頼を投稿しました！", "success");
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
				<h1 className="text-lg font-semibold">依頼を作成</h1>
			</header>

			{/* Request Content */}
			<div className="mb-4">
				<label
					htmlFor="requestContent"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					依頼内容（必須）
				</label>
				<textarea
					id="requestContent"
					value={requestText}
					onChange={(e) => setRequestText(e.target.value)}
					className="w-full p-2 border border-gray-300 rounded-lg h-20"
					placeholder="依頼内容を入力してください"
					required
				/>
			</div>

			{/* Action Buttons */}
			<div className="mt-auto space-y-3">
				<button
					type="button"
					className="w-full py-3 bg-indigo-500 text-white rounded-lg font-medium flex items-center justify-center hover:bg-indigo-600 transition-colors"
					onClick={handleSubmit}
				>
					💳 依頼を投稿
				</button>
			</div>
		</div>
	);
};

export default RequestCreationScreen;
