import type { LatLng } from "../types/request";
import type { GeocodeResult, ReverseGeocodeResult } from "../../utils/geocode";
import { buildGeocodeUrl, buildReverseGeocodeUrl } from "../../utils/geocode";
import { fetchJson } from "./client";

export const searchGeocode = async (params: {
	query: string;
	language: string;
	selectedLocation: LatLng | null;
}) => fetchJson<GeocodeResult[]>(buildGeocodeUrl(params));

export const reverseGeocode = async (params: {
	lat: number;
	lng: number;
	language: string;
}) => fetchJson<ReverseGeocodeResult>(buildReverseGeocodeUrl(params));
