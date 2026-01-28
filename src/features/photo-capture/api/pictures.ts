import type { Picture } from "../../../shared/types/api";
import { getAuthToken } from "../../../shared/utils/auth";

export const uploadPicture = async (file: File) => {
	const token = getAuthToken();
	const API_BASE_URL =
		import.meta.env.VITE_API_BASE_URL || "http://0.0.0.0:8000";
	const formData = new FormData();
	formData.append("file", file);

	const response = await fetch(`${API_BASE_URL}/api/v1/pictures`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData,
	});

	if (!response.ok) {
		throw new Error(response.statusText || "Upload failed");
	}

	return (await response.json()) as Picture;
};
