import type React from "react";

// Mock data for requests
const mockRequests = [
	{
		id: 1,
		title: "駅前の混雑",
		distance: 120,
		location: { lat: 35.6895, lng: 139.6917 },
		status: "open", // 'open', 'in-progress', 'completed'
		description: "駅前の混雑状況がわかる写真1枚ください",
	},
	{
		id: 2,
		title: "コンビニ前の様子",
		distance: 350,
		location: { lat: 35.6905, lng: 139.6927 },
		status: "open",
		description: "コンビニ前の様子を確認したいです",
	},
	{
		id: 3,
		title: "公園の桜",
		distance: 900,
		location: { lat: 35.6885, lng: 139.6907 },
		status: "in-progress",
		description: "満開の桜を撮影してほしいです",
	},
];

type Screen = "home" | "request-creation" | "photo-capture";

interface Request {
	id: number;
	title: string;
	distance: number;
	location: { lat: number; lng: number };
	status: string;
	description: string;
}

const HomeScreen: React.FC<{
	navigateTo: (screen: Screen, request?: Request) => void;
}> = ({ navigateTo }) => {
	return (
		<div className="flex flex-col h-full bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm p-4 flex justify-between items-center">
				<h1 className="text-xl font-bold text-indigo-500">KokoPic</h1>
				<div className="flex space-x-4">
					<button type="button" className="relative">
						<span className="text-gray-600">🔔</span>
						<span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
							3
						</span>
					</button>
					<button type="button" className="text-gray-600">
						👤
					</button>
				</div>
			</header>

			{/* Request List */}
			<div className="flex-1 overflow-y-auto p-4 space-y-3">
				<h2 className="font-semibold text-gray-700">近くの依頼一覧</h2>
				{mockRequests.map((request) => (
					<div
						key={request.id}
						className="p-4 border rounded-xl bg-white shadow-sm"
					>
						<div className="flex justify-between items-start">
							<div>
								<div className="font-semibold">{request.title}</div>
								<p className="text-sm text-gray-600 mt-1">
									{request.description}
								</p>
							</div>
						</div>
						<div className="flex items-center justify-between mt-3 text-sm text-gray-500">
							<span>距離: {request.distance}m</span>
							<button
								type="button"
								className="px-3 py-1.5 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition-colors"
								onClick={() => navigateTo("photo-capture", request)}
							>
								撮影する
							</button>
						</div>
					</div>
				))}
			</div>

			{/* Floating Action Button */}
			<button
				type="button"
				className="absolute bottom-20 right-4 bg-indigo-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg text-xl hover:bg-indigo-700 transition-colors"
				onClick={() => navigateTo("request-creation")}
			>
				➕
			</button>
		</div>
	);
};

export default HomeScreen;
