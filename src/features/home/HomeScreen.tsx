import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import maplibregl from "maplibre-gl";
import type { Request, RequestStatus } from "../../shared/types/request";
import RequestCard from "./components/RequestCard";
import { getRequests } from "./api";
import { useGeolocation } from "./hooks/useGeolocation";
import { FALLBACK_CENTER, MAP_STYLE_URL } from "../../shared/constants/map";
import { useTranslation } from "../../shared/context/LanguageContext";
import LanguageSwitcher from "./components/LanguageSwitcher";

const STATUS_COLORS: Record<RequestStatus, string> = {
	open: "#4f46e5",
	"in-progress": "#f59e0b",
	completed: "#22c55e",
};

const HomeScreen: React.FC = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { location: userLocation, error: locationError } = useGeolocation();
	const [requests, setRequests] = useState<Request[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const mapContainerRef = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<maplibregl.Map | null>(null);
	const requestMarkersRef = useRef<maplibregl.Marker[]>([]);
	const userMarkerRef = useRef<maplibregl.Marker | null>(null);
	const hasCenteredOnUserRef = useRef(false);
	const popupRef = useRef<maplibregl.Popup | null>(null);
	const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
		null,
	);
	const selectedRequest = useMemo(
		() =>
			selectedRequestId
				? (requests.find((request) => request.id === selectedRequestId) ?? null)
				: null,
		[selectedRequestId, requests],
	);

	useEffect(() => {
		const fetchRequests = async () => {
			setIsLoading(true);
			try {
				const response = await getRequests(
					userLocation
						? { lat: userLocation.lat, lng: userLocation.lng }
						: undefined,
				);
				setRequests(response.requests);
			} catch (error) {
				console.error("Failed to fetch requests:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchRequests();
	}, [userLocation]);

	useEffect(() => {
		if (!mapContainerRef.current || mapRef.current) {
			return;
		}

		const map = new maplibregl.Map({
			container: mapContainerRef.current,
			style: MAP_STYLE_URL,
			center: [FALLBACK_CENTER.lng, FALLBACK_CENTER.lat],
			zoom: 12,
		});

		map.addControl(
			new maplibregl.NavigationControl({
				visualizePitch: true,
				showCompass: false,
			}),
			"top-right",
		);

		mapRef.current = map;

		return () => {
			popupRef.current?.remove();
			map.remove();
			mapRef.current = null;
			requestMarkersRef.current = [];
			userMarkerRef.current = null;
			hasCenteredOnUserRef.current = false;
		};
	}, []);

	useEffect(() => {
		const map = mapRef.current;
		if (!map) {
			return;
		}

		const updateMarkers = () => {
			requestMarkersRef.current.forEach((marker) => {
				marker.remove();
			});
			requestMarkersRef.current = [];

			for (const request of requests) {
				const marker = new maplibregl.Marker({
					color: STATUS_COLORS[request.status] ?? STATUS_COLORS.open,
				})
					.setLngLat([request.lng, request.lat])
					.addTo(map);
				marker.getElement().addEventListener("click", () => {
					setSelectedRequestId(request.id);

					popupRef.current?.remove();

					const popup = new maplibregl.Popup({
						closeButton: true,
						closeOnClick: false,
						offset: 25,
					})
						.setLngLat([request.lng, request.lat])
						.setText(request.placeName ?? "Location")
						.addTo(map);

					popupRef.current = popup;
				});
				requestMarkersRef.current.push(marker);
			}

			userMarkerRef.current?.remove();
			userMarkerRef.current = null;
			if (userLocation) {
				const userMarker = new maplibregl.Marker({ color: "#0f172a" })
					.setLngLat([userLocation.lng, userLocation.lat])
					.addTo(map);

				userMarker.getElement().addEventListener("click", () => {
					// Remove existing popup if any
					popupRef.current?.remove();

					// Create and show popup for user location
					const popup = new maplibregl.Popup({
						closeButton: true,
						closeOnClick: false,
						offset: 25,
					})
						.setLngLat([userLocation.lng, userLocation.lat])
						.setText("現在地")
						.addTo(map);

					popupRef.current = popup;
				});

				userMarkerRef.current = userMarker;
			}

			if (userLocation) {
				if (!hasCenteredOnUserRef.current) {
					map.easeTo({
						center: [userLocation.lng, userLocation.lat],
						zoom: Math.max(map.getZoom(), 13),
						duration: 0,
					});
					hasCenteredOnUserRef.current = true;
				}
				return;
			}

			const bounds = new maplibregl.LngLatBounds();
			let hasBounds = false;
			for (const request of requests) {
				bounds.extend([request.lng, request.lat]);
				hasBounds = true;
			}

			if (hasBounds) {
				map.fitBounds(bounds, { padding: 48, maxZoom: 14, duration: 0 });
				return;
			}

			map.easeTo({
				center: [FALLBACK_CENTER.lng, FALLBACK_CENTER.lat],
				zoom: 12,
				duration: 0,
			});
		};

		if (map.isStyleLoaded()) {
			updateMarkers();
		} else {
			map.once("load", updateMarkers);
		}
	}, [requests, userLocation]);

	const handleRequestSelect = (selected: Request) => {
		navigate({
			to: "/request/$requestId",
			params: { requestId: String(selected.id) },
		});
	};

	return (
		<div className="flex flex-col bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm p-4 flex justify-between items-center">
				<h1 className="text-xl font-bold text-indigo-500">{t("appTitle")}</h1>
				<div className="flex space-x-4">
					<LanguageSwitcher />
					<button
						type="button"
						className="text-gray-600"
						onClick={() => navigate({ to: "/account" })}
					>
						👤
					</button>
				</div>
			</header>

			<div className="px-4 pt-4">
				<div
					ref={mapContainerRef}
					className="mt-2 h-80 w-full overflow-hidden rounded-lg border border-gray-200 bg-white"
				/>
				{selectedRequest ? (
					<div className="mt-3">
						<h3 className="text-sm font-semibold text-gray-600">
							{t("selectedRequest")}
						</h3>
						<div className="mt-2">
							<RequestCard
								request={selectedRequest}
								onSelect={handleRequestSelect}
								className="border-sky-300"
							/>
						</div>
					</div>
				) : null}
				{locationError && (
					<div className="mt-2 text-xs text-gray-500">{locationError}</div>
				)}
			</div>

			{/* Request List */}
			<div className="p-4 space-y-3">
				<h2 className="font-semibold text-gray-700">{t("nearbyRequests")}</h2>
				{isLoading ? (
					<div className="text-sm text-gray-500">{t("gettingLocation")}</div>
				) : requests.length === 0 ? (
					<div className="text-sm text-gray-500">No requests available</div>
				) : null}
				{requests.map((request) => (
					<RequestCard
						key={request.id}
						request={request}
						onSelect={handleRequestSelect}
					/>
				))}
			</div>

			{/* Floating Action Button */}
			<button
				type="button"
				className="fixed bottom-8 right-4 bg-green-accent text-white rounded-full px-4 py-3 shadow-lg hover-bg-green-600"
				onClick={() => navigate({ to: "/request/new" })}
				aria-label={t("createRequest")}
			>
				<span className="text-sm font-semibold">
					{t("createRequestButton")}
				</span>
			</button>
		</div>
	);
};

export default HomeScreen;
