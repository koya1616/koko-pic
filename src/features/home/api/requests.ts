import { apiRequest } from "../../../shared/api/client";
import type { RequestsResponse } from "../../../shared/types/api";

export const getRequests = async (params?: {
	lat?: number;
	lng?: number;
}): Promise<RequestsResponse> => {
	const searchParams = new URLSearchParams();
	if (params?.lat !== undefined) {
		searchParams.set("lat", String(params.lat));
	}
	if (params?.lng !== undefined) {
		searchParams.set("lng", String(params.lng));
	}

	const queryString = searchParams.toString();
	const path = queryString
		? `/api/v1/requests?${queryString}`
		: "/api/v1/requests";

	return apiRequest<RequestsResponse>(path);
};
