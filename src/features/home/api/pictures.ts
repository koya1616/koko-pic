import type { Picture, PicturesResponse } from "../../../shared/types/api";
import { apiRequest } from "../../../shared/api/client";
import { getAuthToken } from "../../../shared/utils/auth";

export const fetchPictures = async () =>
	apiRequest<PicturesResponse>("/api/v1/pictures");

export const fetchPictureById = async (pictureId: number) =>
	apiRequest<Picture>(`/api/v1/pictures/${pictureId}`);

export const deletePicture = async (pictureId: number) => {
	const token = getAuthToken();
	return apiRequest<void>(`/api/v1/pictures/${pictureId}`, {
		method: "DELETE",
		token,
	});
};
