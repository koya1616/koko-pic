import type React from "react";
import { useState } from "react";

type Screen =
	| "home"
	| "request-creation"
	| "photo-capture"
	| "submission-complete";

const RequestCreationScreen: React.FC<{
	navigateTo: (screen: Screen) => void;
}> = ({ navigateTo }) => {
	const [requestText, setRequestText] = useState("");
	const [options, setOptions] = useState({
		noPeople: false,
		todayOnly: false,
	});

	const handleSubmit = () => {
		// Check if request content is not empty
		if (!requestText.trim()) {
			alert("依頼内容を入力してください");
			return;
		}

		// In a real app, this would submit the request
		// For now, we'll just navigate back to home
		alert("依頼を投稿しました！");
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

			{/* Options */}
			<fieldset className="mb-6">
				<legend className="block text-sm font-medium text-gray-700 mb-1">
					オプション
				</legend>
				<div className="space-y-2">
					<label className="inline-flex items-center">
						<input
							type="checkbox"
							checked={options.noPeople}
							onChange={(e) =>
								setOptions({ ...options, noPeople: e.target.checked })
							}
							className="form-checkbox h-4 w-4 text-indigo-600"
						/>
						<span className="ml-2">人物が写らない写真でOK</span>
					</label>
					<label className="inline-flex items-center">
						<input
							type="checkbox"
							checked={options.todayOnly}
							onChange={(e) =>
								setOptions({ ...options, todayOnly: e.target.checked })
							}
							className="form-checkbox h-4 w-4 text-indigo-600"
						/>
						<span className="ml-2">今日撮影のみ</span>
					</label>
				</div>
			</fieldset>

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
