import type React from "react";
import { useEffect, useMemo, useState } from "react";

// Mock data for requests
const mockRequests = [
	{
		id: 1,
		location: { lat: 35.6895, lng: 139.6917 },
		status: "open", // 'open', 'in-progress', 'completed'
		description: "駅前の混雑状況がわかる写真1枚ください",
	},
	{
		id: 2,
		location: { lat: 35.6905, lng: 139.6927 },
		status: "open",
		description: "コンビニ前の様子を確認したいです",
	},
	{
		id: 3,
		location: { lat: 35.6885, lng: 139.6907 },
		status: "in-progress",
		description: "満開の桜を撮影してほしいです",
	},
];

type Screen = "home" | "request-creation" | "photo-capture";

interface Request {
	id: number;
	distance?: number;
	location: { lat: number; lng: number };
	status: string;
	description: string;
}

const haversineMeters = (
	a: { lat: number; lng: number },
	b: { lat: number; lng: number },
) => {
	const R = 6371000;
	const dLat = ((b.lat - a.lat) * Math.PI) / 180;
	const dLng = ((b.lng - a.lng) * Math.PI) / 180;
	const lat1 = (a.lat * Math.PI) / 180;
	const lat2 = (b.lat * Math.PI) / 180;
	const h =
		Math.sin(dLat / 2) ** 2 +
		Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
	return 2 * R * Math.asin(Math.sqrt(h));
};

const HomeScreen: React.FC<{
	navigateTo: (screen: Screen, request?: Request) => void;
}> = ({ navigateTo }) => {
	const [userLocation, setUserLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [locationError, setLocationError] = useState<string | null>(null);

	useEffect(() => {
		if (!navigator.geolocation) {
			setLocationError("この環境では位置情報が利用できません。");
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setUserLocation({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				});
			},
			(error) => {
				setLocationError(
					error.code === error.PERMISSION_DENIED
						? "位置情報の利用が許可されていません。"
						: "位置情報の取得に失敗しました。",
				);
			},
			{ enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 },
		);
	}, []);

	const sortedRequests = useMemo(() => {
		if (!userLocation) {
			return mockRequests;
		}
		return mockRequests
			.map((request) => ({
				...request,
				distance: Math.round(haversineMeters(userLocation, request.location)),
			}))
			.sort((a, b) => a.distance - b.distance);
	}, [userLocation]);

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
					<button
						key={request.id}
						type="button"
						className="p-4 border rounded-xl bg-white shadow-sm text-left w-full"
						onClick={() => navigateTo("photo-capture", request)}
					>
						<div className="flex justify-between items-start">
							<div>
								<div className="font-semibold">{request.description}</div>
							</div>
						</div>
						<div className="flex items-center justify-between mt-3 text-sm text-gray-500">
							<span>
								{request.distance !== undefined
									? `距離: ${request.distance}m`
									: "距離: 取得できません"}
							</span>
						</div>
					</button>
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
