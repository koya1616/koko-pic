export type LatLng = {
	lat: number;
	lng: number;
};

export type RequestLocation = LatLng & {
	accuracy?: number;
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
