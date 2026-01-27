import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { useRequestForm } from "../hooks/useRequestForm";
import type { LatLng, RequestLocation } from "../types/request";
import { FALLBACK_CENTER, MAP_STYLE_URL } from "../constants/map";
import {
	buildGeocodeUrl,
	type GeocodeResult,
	parseGeocodeCoordinates,
} from "../utils/geocode";
import { geoErrorToMessage } from "../utils/geolocation";
import { fetchJson } from "../utils/api";
import { useTranslation } from "../context/LanguageContext";
import type { Screen } from "../types/screen";

type MapLabelLanguage = "ja" | "en";

const resolveMapLabelLanguage = (locale?: string): MapLabelLanguage => {
	if (!locale) {
		return "en";
	}
	return locale.toLowerCase().startsWith("ja") ? "ja" : "en";
};

const buildLabelExpression = (language: MapLabelLanguage) =>
	language === "ja"
		? ["coalesce", ["get", "name:ja"], ["get", "name:ja_kana"], ["get", "name"]]
		: ["coalesce", ["get", "name:en"], ["get", "name"]];

const applyMapLabelLanguage = (
	map: maplibregl.Map,
	language: MapLabelLanguage,
) => {
	const style = map.getStyle();
	if (!style?.layers) {
		return;
	}

	const labelExpression = buildLabelExpression(language);
	for (const layer of style.layers) {
		if (layer.type !== "symbol" || !layer.layout) {
			continue;
		}

		const textField = layer.layout["text-field"];
		if (!textField) {
			continue;
		}

		const textFieldString = JSON.stringify(textField);
		if (!textFieldString.includes("name")) {
			continue;
		}

		map.setLayoutProperty(layer.id, "text-field", labelExpression);
	}
};

const RequestCreationScreen: React.FC<{
	navigateTo: (screen: Screen) => void;
	showSnackbar: (message: string, type?: "success" | "error" | "info") => void;
}> = ({ navigateTo, showSnackbar }) => {
	const { t } = useTranslation();
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
	const [defaultCenter, setDefaultCenter] = useState<LatLng>(FALLBACK_CENTER);
	const mapContainerRef = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<maplibregl.Map | null>(null);
	const markerRef = useRef<maplibregl.Marker | null>(null);
	const mapLabelLanguage = useMemo(
		() =>
			resolveMapLabelLanguage(
				typeof navigator === "undefined" ? "en" : navigator.language,
			),
		[],
	);

	const buildGeocodeUrlForQuery = useCallback(
		(query: string) =>
			buildGeocodeUrl({
				query,
				language: mapLabelLanguage,
				selectedLocation,
			}),
		[selectedLocation, mapLabelLanguage],
	);

	const handlePost = useCallback(() => {
		showSnackbar(t("requestPosted"), "success");
		navigateTo("home");
	}, [navigateTo, showSnackbar, t]);

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

		const center = selectedLocation ?? defaultCenter;
		const map = new maplibregl.Map({
			container: mapContainerRef.current,
			style: MAP_STYLE_URL,
			center: [center.lng, center.lat],
			zoom: selectedLocation ? 15 : 12,
		});

		map.addControl(
			new maplibregl.NavigationControl({
				visualizePitch: true,
				showCompass: false,
			}),
			"top-right",
		);

		map.on("load", () => {
			applyMapLabelLanguage(map, mapLabelLanguage);
		});

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
	}, [isLocationEnabled, selectedLocation, mapLabelLanguage, defaultCenter]);

	useEffect(() => {
		if (!isLocationEnabled) {
			return;
		}

		if (!navigator.geolocation) {
			setLocationError(t("locationUnavailable"));
			return;
		}

		setLocationError(null);
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const currentLocation = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				};
				setDefaultCenter(currentLocation);
				setSelectedLocation((prev) =>
					prev
						? prev
						: {
								...currentLocation,
								source: "gps",
								accuracy: Math.round(position.coords.accuracy),
								capturedAt: new Date().toISOString(),
							},
				);
				setSelectedPlaceLabel(null);
			},
			(geoError) => {
				setLocationError(geoErrorToMessage(geoError));
			},
			{ enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 },
		);
	}, [isLocationEnabled, t]);

	useEffect(() => {
		if (!mapRef.current) {
			return;
		}

		applyMapLabelLanguage(mapRef.current, mapLabelLanguage);
	}, [mapLabelLanguage]);

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

	useEffect(() => {
		if (!mapRef.current || selectedLocation) {
			return;
		}

		mapRef.current.easeTo({
			center: [defaultCenter.lng, defaultCenter.lat],
		});
	}, [defaultCenter, selectedLocation]);

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

	const handleSearchLocation = async () => {
		const query = searchQuery.trim();
		if (!query) {
			setSearchError(t("searchPlaceholder"));
			setSearchResults([]);
			return;
		}

		setSearchError(null);
		setIsSearching(true);
		try {
			const results = await fetchJson<GeocodeResult[]>(
				buildGeocodeUrlForQuery(query),
			);
			setSearchResults(results);
			if (results.length === 0) {
				setSearchError(t("noResults"));
			}
		} catch {
			setSearchError(t("searchFailed"));
			setSearchResults([]);
		} finally {
			setIsSearching(false);
		}
	};

	const handleSelectSearchResult = (result: GeocodeResult) => {
		const coordinates = parseGeocodeCoordinates(result);
		if (!coordinates) {
			setSearchError(t("geolocationFailed"));
			return;
		}

		setSelectedLocation({
			...coordinates,
			source: "search",
			capturedAt: new Date().toISOString(),
		});
		setSelectedPlaceLabel(result.display_name);
		setSearchResults([]);
		setSearchError(null);
	};

	return (
		<div className="flex h-full flex-col overflow-y-auto bg-gray-50 p-4">
			{/* Header */}
			<header className="flex items-center mb-4">
				<button
					type="button"
					className="mr-2 text-gray-600"
					onClick={() => navigateTo("home")}
				>
					{t("back")}
				</button>
				<h1 className="text-lg font-semibold">{t("createRequest")}</h1>
			</header>

			{/* Request Content */}
			<div className="mb-4">
				<label
					htmlFor="requestContent"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					{t("requestContent")}
				</label>
				<textarea
					id="requestContent"
					value={requestText}
					onChange={(e) => setRequestText(e.target.value)}
					className="w-full p-2 border border-gray-300 rounded-lg h-20"
					placeholder={t("enterRequestContent")}
					required
				/>
			</div>

			<div className="mb-4 rounded-lg border border-gray-200 bg-white p-3">
				<div className="flex items-center justify-between">
					<div className="text-sm font-medium text-gray-700">
						{t("selectLocation")}
					</div>
					<input
						type="checkbox"
						className="h-5 w-5 accent-green-600"
						checked={isLocationEnabled}
						onChange={handleToggleLocation}
						aria-label={t("selectLocation")}
					/>
				</div>

				{isLocationEnabled && (
					<div className="mt-3 space-y-2">
						<div>
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
									placeholder={t("searchPlaceholder")}
									className="flex-1 min-w-[180px] rounded-md border border-gray-200 px-3 py-2 text-sm"
								/>
								<button
									type="button"
									className="px-3 py-2 text-sm rounded-md border border-gray-200 bg-white hover:bg-gray-50 disabled:text-gray-300"
									onClick={handleSearchLocation}
									disabled={isSearching}
								>
									{isSearching ? t("searching") : t("search")}
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
							className="h-120 w-full overflow-hidden rounded-lg border border-gray-200"
						/>

						{selectedPlaceLabel && (
							<div className="text-xs text-gray-500">
								{t("selectPlace", { placeName: selectedPlaceLabel })}
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
					💳 {t("postRequest")}
				</button>
			</div>
		</div>
	);
};

export default RequestCreationScreen;
