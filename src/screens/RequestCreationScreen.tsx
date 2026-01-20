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
	const [location, setLocation] = useState("渋谷駅前"); // Mock location
	const [requestText, setRequestText] = useState(
		"駅前の混雑状況がわかる写真1枚ください",
	);
	const [reward, setReward] = useState(300);
	const [otherReward, setOtherReward] = useState("");
	const [options, setOptions] = useState({
		noPeople: false,
		todayOnly: false,
	});

	const handleSubmit = (free: boolean) => {
		// In a real app, this would submit the request
		// For now, we'll just navigate back to home
		if (free) {
			// Show mock ad completion
			alert("広告視聴完了！依頼が無料で投稿されました！");
		} else {
			// Show payment confirmation
			alert(`依頼を¥${reward}で投稿しました！`);
		}
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

			{/* Location Input */}
			<div className="mb-4">
				<label
					htmlFor="location"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					場所：
				</label>
				<input
					id="location"
					type="text"
					value={location}
					onChange={(e) => setLocation(e.target.value)}
					className="w-full p-2 border border-gray-300 rounded-lg"
					placeholder="場所を入力してください"
				/>
			</div>

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
				/>
			</div>

			{/* Reward Selection */}
			<fieldset className="mb-4">
				<legend className="block text-sm font-medium text-gray-700 mb-1">
					報酬
				</legend>
				<div className="grid grid-cols-2 gap-2">
					{[200, 300, 500].map((amount) => (
						<label key={amount} className="inline-flex items-center">
							<input
								type="radio"
								name="reward"
								checked={reward === amount}
								onChange={() => setReward(amount)}
								className="form-radio h-4 w-4 text-indigo-600"
							/>
							<span className="ml-2">¥{amount}</span>
						</label>
					))}
				</div>
				<div className="mt-2 flex items-center">
					<input
						type="radio"
						name="reward"
						checked={reward === parseInt(otherReward, 10)}
						onChange={() => setReward(parseInt(otherReward, 10) || 0)}
						className="form-radio h-4 w-4 text-indigo-600"
					/>
					<span className="ml-2">その他</span>
					<input
						type="number"
						value={otherReward}
						onChange={(e) => setOtherReward(e.target.value)}
						className="ml-2 w-20 p-1 border border-gray-300 rounded"
						placeholder="金額"
					/>
				</div>
			</fieldset>

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
					className="w-full py-3 bg-green-accent text-white rounded-lg font-medium flex items-center justify-center"
					onClick={() => handleSubmit(true)}
				>
					🎬 広告を見て無料で依頼
				</button>
				<button
					type="button"
					className="w-full py-3 bg-indigo text-white rounded-lg font-medium flex items-center justify-center"
					onClick={() => handleSubmit(false)}
				>
					💳 今すぐ依頼（¥{reward || parseInt(otherReward, 10) || 300}）
				</button>
			</div>
		</div>
	);
};

export default RequestCreationScreen;
