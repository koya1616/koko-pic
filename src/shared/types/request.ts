export type LatLng = {
	lat: number;
	lng: number;
};

export type RequestStatus = "open" | "in-progress" | "completed";

export interface Request {
	id: number;
	lat: number;
	lng: number;
	status: RequestStatus;
	place_name: string;
	description: string;
	distance?: number | null;
}
