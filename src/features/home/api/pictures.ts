import type { Picture, PicturesResponse } from "../../../shared/types/api";
import { apiRequest } from "../../../shared/api/client";

export const fetchPictures = async () =>
	apiRequest<PicturesResponse>("/api/v1/pictures");

export const fetchPictureById = async (pictureId: number) =>
	apiRequest<Picture>(`/api/v1/pictures/${pictureId}`);

export const deletePicture = async (pictureId: number, token: string) =>
	apiRequest<void>(`/api/v1/pictures/${pictureId}`, {
		method: "DELETE",
		token,
	});

export const downloadPicture = async (pictureId: number) => {
	const API_URL = import.meta.env.VITE_API_URL || "http://0.0.0.0:8000";
	return `${API_URL}/api/v1/pictures/${pictureId}/download`;
};
