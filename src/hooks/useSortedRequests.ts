import { useMemo } from "react";
import { haversineMeters } from "../utils/distance";
import type { Request } from "../types/request";

export const useSortedRequests = (
	requests: Request[],
	userLocation: Request["location"] | null,
) => {
	return useMemo(() => {
		if (!userLocation) {
			return requests;
		}

		return requests
			.map((request) => ({
				...request,
				distance: Math.round(haversineMeters(userLocation, request.location)),
			}))
			.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
	}, [requests, userLocation]);
};
