import type React from "react";
import type { Request } from "../types/request";
import RequestCard from "../components/RequestCard";
import { mockRequests } from "../data/mockRequests";
import { useGeolocation } from "../hooks/useGeolocation";
import { useSortedRequests } from "../hooks/useSortedRequests";

type Screen = "home" | "request-creation" | "photo-capture";

const HomeScreen: React.FC<{
	navigateTo: (screen: Screen, request?: Request) => void;
}> = ({ navigateTo }) => {
	const { location: userLocation, error: locationError } = useGeolocation();
	const sortedRequests = useSortedRequests(mockRequests, userLocation);

	return (
		<div className="flex flex-col h-full bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm p-4 flex justify-between items-center">
				<h1 className="text-xl font-bold text-indigo-500">KokoPic</h1>
				<div className="flex space-x-4">
					<button type="button" className="text-gray-600">
						👤
					</button>
				</div>
			</header>

			{/* Request List */}
			<div className="flex-1 overflow-y-auto p-4 space-y-3">
				<h2 className="font-semibold text-gray-700">近くの依頼一覧</h2>
				{locationError ? (
					<div className="text-sm text-gray-500">{locationError}</div>
				) : sortedRequests.length === 0 ? (
					<div className="text-sm text-gray-500">現在地を取得中です…</div>
				) : null}
				{sortedRequests.map((request) => (
					<RequestCard
						key={request.id}
						request={request}
						onSelect={(selected) => navigateTo("photo-capture", selected)}
					/>
				))}
			</div>

			{/* Floating Action Button */}
			<button
				type="button"
				className="absolute bottom-8 right-4 bg-green-accent text-white rounded-full px-4 py-3 shadow-lg hover-bg-green-600"
				onClick={() => navigateTo("request-creation")}
				aria-label="依頼を作成"
			>
				<span className="text-sm font-semibold">依頼を作成</span>
			</button>
		</div>
	);
};

export default HomeScreen;
