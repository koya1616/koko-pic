import { apiRequest } from "../../../shared/api/client";
import type {
	RequestsResponse,
	CreateRequestInput,
	ApiRequest,
} from "../../../shared/types/api";
import { getAuthToken } from "../../../shared/utils/auth";

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

export const getRequestById = async (
	requestId: number,
): Promise<ApiRequest> => {
	return apiRequest<ApiRequest>(`/api/v1/requests/${requestId}`);
};

export const createRequest = async (
	input: CreateRequestInput,
): Promise<ApiRequest> => {
	const token = getAuthToken();
	return apiRequest<ApiRequest>("/api/v1/requests", {
		method: "POST",
		body: input,
		token,
	});
};
