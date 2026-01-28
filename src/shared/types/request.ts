export type LatLng = {
	lat: number;
	lng: number;
};

export type RequestLocation = LatLng & {
	source: "map" | "gps" | "search";
	accuracy?: number;
	capturedAt: string;
};

export type RequestStatus = "open" | "in-progress" | "completed";

export interface Request {
	id: number;
	location?: RequestLocation;
	status: RequestStatus;
	placeName?: string;
	description: string;
	distance?: number;
}
