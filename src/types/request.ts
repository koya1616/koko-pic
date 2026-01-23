export type LatLng = {
	lat: number;
	lng: number;
};

export type RequestLocation = LatLng & {
	source: "map" | "gps" | "search";
	accuracy?: number;
	capturedAt: string;
};

export interface Request {
	id: number;
	location?: RequestLocation;
	status: string;
	description: string;
	distance?: number;
}
