export interface Request {
	id: number;
	location: { lat: number; lng: number };
	status: string;
	description: string;
	distance?: number;
}
