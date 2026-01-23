import { EARTH_RADIUS_METERS } from "../constants/distance";

type LatLng = { lat: number; lng: number };

export const haversineMeters = (a: LatLng, b: LatLng) => {
	const dLat = ((b.lat - a.lat) * Math.PI) / 180;
	const dLng = ((b.lng - a.lng) * Math.PI) / 180;
	const lat1 = (a.lat * Math.PI) / 180;
	const lat2 = (b.lat * Math.PI) / 180;
	const h =
		Math.sin(dLat / 2) ** 2 +
		Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
	return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(h));
};

export const formatDistance = (meters: number) => {
	if (meters >= 1000) {
		const km = (meters / 1000).toFixed(1);
		const trimmed = km.endsWith(".0") ? km.slice(0, -2) : km;
		return `${trimmed}km`;
	}

	return `${meters}m`;
};
