import { useMemo } from "react";
import { haversineMeters } from "../../../shared/utils/distance";
import type { LatLng, Request } from "../../../shared/types/request";

export const sortRequestsByDistance = (
	requests: Request[],
	userLocation: LatLng | null,
) => {
	if (!userLocation) {
		return requests;
	}

	return requests
		.map((request) => {
			if (
				typeof request.lat !== "number" ||
				typeof request.lng !== "number" ||
				Number.isNaN(request.lat) ||
				Number.isNaN(request.lng)
			) {
				return request;
			}

			return {
				...request,
				distance: Math.round(
					haversineMeters(userLocation, { lat: request.lat, lng: request.lng }),
				),
			};
		})
		.sort((a, b) => {
			const distanceA = a.distance ?? Number.POSITIVE_INFINITY;
			const distanceB = b.distance ?? Number.POSITIVE_INFINITY;
			return distanceA - distanceB;
		});
};

export const useSortedRequests = (
	requests: Request[],
	userLocation: LatLng | null,
) => {
	return useMemo(
		() => sortRequestsByDistance(requests, userLocation),
		[requests, userLocation],
	);
};
