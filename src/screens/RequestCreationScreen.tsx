import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { useRequestForm } from "../hooks/useRequestForm";
import type { LatLng, RequestLocation } from "../types/request";

type Screen = "home" | "request-creation" | "photo-capture";

const DEFAULT_CENTER: LatLng = { lat: 35.6812, lng: 139.7671 };
const GEOCODE_ENDPOINT =
	"https://nominatim.openstreetmap.org/search?format=jsonv2&limit=10&q=";

type GeocodeResult = {
	display_name: string;
	lat: string;
	lon: string;
};

const RequestCreationScreen: React.FC<{
	navigateTo: (screen: Screen) => void;
	showSnackbar: (message: string, type?: "success" | "error" | "info") => void;
}> = ({ navigateTo, showSnackbar }) => {
	const [isLocationEnabled, setIsLocationEnabled] = useState(false);
	const [selectedLocation, setSelectedLocation] =
		useState<RequestLocation | null>(null);
	const [locationError, setLocationError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
	const [searchError, setSearchError] = useState<string | null>(null);
	const [selectedPlaceLabel, setSelectedPlaceLabel] = useState<string | null>(
		null,
	);
	const [isSearching, setIsSearching] = useState(false);
	const mapContainerRef = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<maplibregl.Map | null>(null);
	const markerRef = useRef<maplibregl.Marker | null>(null);

	const handlePost = useCallback(() => {
		const locationNote = selectedLocation ? "（位置情報あり）" : "";
		showSnackbar(`依頼を投稿しました！${locationNote}`, "success");
		navigateTo("home");
	}, [navigateTo, selectedLocation, showSnackbar]);

	const { handleSubmit, requestText, setRequestText } = useRequestForm({
		onSubmit: handlePost,
		onError: (message) => showSnackbar(message, "error"),
	});

	useEffect(() => {
		return () => {
			if (mapRef.current) {
				mapRef.current.remove();
				mapRef.current = null;
				markerRef.current = null;
			}
		};
	}, []);

	useEffect(() => {
		if (!isLocationEnabled) {
			if (mapRef.current) {
				mapRef.current.remove();
				mapRef.current = null;
				markerRef.current = null;
			}
			return;
		}

		if (!mapContainerRef.current || mapRef.current) {
			return;
		}

		const center = selectedLocation ?? DEFAULT_CENTER;
		const map = new maplibregl.Map({
			container: mapContainerRef.current,
			style: "https://demotiles.maplibre.org/style.json",
			center: [center.lng, center.lat],
			zoom: selectedLocation ? 15 : 12,
		});

		map.addControl(
			new maplibregl.NavigationControl({ visualizePitch: true }),
			"top-right",
		);

		map.on("click", (event) => {
			setSelectedPlaceLabel(null);
			setSelectedLocation({
				lat: event.lngLat.lat,
				lng: event.lngLat.lng,
				source: "map",
				capturedAt: new Date().toISOString(),
			});
		});

		mapRef.current = map;
	}, [isLocationEnabled, selectedLocation]);

	useEffect(() => {
		if (!mapRef.current) {
			return;
		}

		if (!selectedLocation) {
			markerRef.current?.remove();
			markerRef.current = null;
			return;
		}

		if (!markerRef.current) {
			markerRef.current = new maplibregl.Marker({ color: "#16a34a" })
				.setLngLat([selectedLocation.lng, selectedLocation.lat])
				.addTo(mapRef.current);
		} else {
			markerRef.current.setLngLat([selectedLocation.lng, selectedLocation.lat]);
		}

		mapRef.current.easeTo({
			center: [selectedLocation.lng, selectedLocation.lat],
			zoom: Math.max(mapRef.current.getZoom(), 14),
		});
	}, [selectedLocation]);

	const handleToggleLocation = () => {
		setIsLocationEnabled((prev) => {
			if (prev) {
				setSelectedLocation(null);
				setLocationError(null);
				setSearchError(null);
				setSearchResults([]);
				setSelectedPlaceLabel(null);
			}
			return !prev;
		});
	};

	const handleUseCurrentLocation = () => {
		setLocationError(null);
		setSearchError(null);
		setSelectedPlaceLabel(null);
		if (!navigator.geolocation) {
			setLocationError("この環境では位置情報が利用できません。");
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setSelectedLocation({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
					source: "gps",
					accuracy: Math.round(position.coords.accuracy),
					capturedAt: new Date().toISOString(),
				});
			},
			(geoError) => {
				setLocationError(
					geoError.code === geoError.PERMISSION_DENIED
						? "位置情報の利用が許可されていません。"
						: "位置情報の取得に失敗しました。",
				);
			},
			{ enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 },
		);
	};

	const handleSearchLocation = async () => {
		const query = searchQuery.trim();
		if (!query) {
			setSearchError("検索キーワードを入力してください。");
			setSearchResults([]);
			return;
		}

		setSearchError(null);
		setIsSearching(true);
		try {
			const response = await fetch(
				`${GEOCODE_ENDPOINT}${encodeURIComponent(query)}`,
			);
			if (!response.ok) {
				throw new Error("Geocoding failed.");
			}
			const results = (await response.json()) as GeocodeResult[];
			setSearchResults(results);
			if (results.length === 0) {
				setSearchError("候補が見つかりませんでした。");
			}
		} catch {
			setSearchError("検索に失敗しました。時間をおいて再度お試しください。");
			setSearchResults([]);
		} finally {
			setIsSearching(false);
		}
	};

	const handleSelectSearchResult = (result: GeocodeResult) => {
		const lat = Number(result.lat);
		const lng = Number(result.lon);
		if (Number.isNaN(lat) || Number.isNaN(lng)) {
			setSearchError("座標の取得に失敗しました。");
			return;
		}

		setSelectedLocation({
			lat,
			lng,
			source: "search",
			capturedAt: new Date().toISOString(),
		});
		setSelectedPlaceLabel(result.display_name);
		setSearchResults([]);
		setSearchError(null);
	};

	const locationSummary = selectedLocation
		? `${selectedLocation.lat.toFixed(5)}, ${selectedLocation.lng.toFixed(5)}`
		: "未設定";

	return (
		<div className="flex h-full flex-col overflow-y-auto bg-gray-50 p-4">
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

			<div className="mb-4 rounded-lg border border-gray-200 bg-white p-3">
				<div className="flex items-center justify-between">
					<div>
						<div className="text-sm font-medium text-gray-700">
							位置情報を追加（任意）
						</div>
						<div className="text-xs text-gray-500">
							地図でピンを置いて座標を保存します。
						</div>
					</div>
					<input
						type="checkbox"
						className="h-5 w-5 accent-green-600"
						checked={isLocationEnabled}
						onChange={handleToggleLocation}
						aria-label="位置情報を追加"
					/>
				</div>

				{isLocationEnabled && (
					<div className="mt-3 space-y-2">
						<div className="flex flex-wrap gap-2">
							<button
								type="button"
								className="px-3 py-2 text-sm rounded-md border border-gray-200 bg-white hover:bg-gray-50"
								onClick={handleUseCurrentLocation}
							>
								現在地を使用
							</button>
							<button
								type="button"
								className="px-3 py-2 text-sm rounded-md border border-gray-200 bg-white hover:bg-gray-50 disabled:text-gray-300"
								onClick={() => {
									setSelectedLocation(null);
									setSelectedPlaceLabel(null);
								}}
								disabled={!selectedLocation}
							>
								ピンをクリア
							</button>
						</div>

						<div className="rounded-md border border-gray-200 bg-gray-50 p-3">
							<div className="text-xs font-medium text-gray-600">
								場所を検索
							</div>
							<div className="mt-2 flex flex-wrap gap-2">
								<input
									type="text"
									value={searchQuery}
									onChange={(event) => setSearchQuery(event.target.value)}
									onKeyDown={(event) => {
										if (event.key === "Enter") {
											event.preventDefault();
											handleSearchLocation();
										}
									}}
									placeholder="住所や施設名で検索"
									className="flex-1 min-w-[180px] rounded-md border border-gray-200 px-3 py-2 text-sm"
								/>
								<button
									type="button"
									className="px-3 py-2 text-sm rounded-md border border-gray-200 bg-white hover:bg-gray-50 disabled:text-gray-300"
									onClick={handleSearchLocation}
									disabled={isSearching}
								>
									{isSearching ? "検索中..." : "検索"}
								</button>
							</div>
							{searchError && (
								<div className="mt-2 text-xs text-red-500">{searchError}</div>
							)}
							{searchResults.length > 0 && (
								<ul className="mt-2 space-y-1">
									{searchResults.map((result) => (
										<li key={`${result.lat}-${result.lon}`}>
											<button
												type="button"
												className="w-full rounded-md border border-gray-200 bg-white px-2 py-1 text-left text-xs hover:bg-gray-100"
												onClick={() => handleSelectSearchResult(result)}
											>
												{result.display_name}
											</button>
										</li>
									))}
								</ul>
							)}
						</div>

						<div
							ref={mapContainerRef}
							className="h-56 w-full overflow-hidden rounded-lg border border-gray-200"
						/>

						<div className="text-xs text-gray-500">
							地図をクリックしてピンを配置してください。
						</div>
						<div className="text-xs text-gray-600">
							現在の座標: {locationSummary}
							{selectedLocation?.source === "gps" &&
								selectedLocation.accuracy !== undefined && (
									<span className="ml-2">
										精度: 約{selectedLocation.accuracy}m
									</span>
								)}
						</div>
						{selectedPlaceLabel && (
							<div className="text-xs text-gray-500">
								選択した場所: {selectedPlaceLabel}
							</div>
						)}
						{locationError && (
							<div className="text-xs text-red-500">{locationError}</div>
						)}
					</div>
				)}
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
