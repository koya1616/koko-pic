import type { LatLng } from "../../../shared/types/request";
import {
	GEOCODE_ENDPOINT,
	REVERSE_GEOCODE_ENDPOINT,
	SEARCH_RADIUS_KM,
} from "../../../shared/constants/geocode";

export const buildGeocodeUrl = ({
	query,
	language,
	selectedLocation,
}: {
	query: string;
	language: string;
	selectedLocation: LatLng | null;
}) => {
	const url = new URL(GEOCODE_ENDPOINT);
	url.searchParams.set("format", "jsonv2");
	url.searchParams.set("limit", "10");
	url.searchParams.set("q", query);
	url.searchParams.set("accept-language", language);

	if (selectedLocation) {
		const lat = selectedLocation.lat;
		const lng = selectedLocation.lng;
		const deltaLat = SEARCH_RADIUS_KM / 111.32;
		const deltaLng =
			SEARCH_RADIUS_KM / (111.32 * Math.cos((lat * Math.PI) / 180));

		const left = lng - deltaLng;
		const right = lng + deltaLng;
		const top = lat + deltaLat;
		const bottom = lat - deltaLat;

		url.searchParams.set("viewbox", `${left},${top},${right},${bottom}`);
	}

	return url.toString();
};

export type GeocodeResult = {
	display_name: string;
	lat: string;
	lon: string;
};

export const buildReverseGeocodeUrl = ({
	lat,
	lng,
	language,
}: {
	lat: number;
	lng: number;
	language: string;
}) => {
	const url = new URL(REVERSE_GEOCODE_ENDPOINT);
	url.searchParams.set("format", "jsonv2");
	url.searchParams.set("lat", lat.toString());
	url.searchParams.set("lon", lng.toString());
	url.searchParams.set("accept-language", language);
	return url.toString();
};

export type ReverseGeocodeResult = {
	display_name?: string;
	name?: string;
};

export const parseGeocodeCoordinates = (
	result: GeocodeResult,
): LatLng | null => {
	const lat = Number(result.lat);
	const lng = Number(result.lon);
	if (Number.isNaN(lat) || Number.isNaN(lng)) {
		return null;
	}

	return { lat, lng };
};

export const formatLocationSummary = (location: LatLng | null) =>
	location
		? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`
		: "未設定";
