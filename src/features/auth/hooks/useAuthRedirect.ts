import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { STORAGE_KEYS } from "../../../shared/constants/storage";

/**
 * Custom hook that checks for authentication token and redirects to login if not found
 * Should be used at the beginning of components that require authentication
 */
export const useAuthRedirect = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem(STORAGE_KEYS.authToken);

		if (!token) {
			navigate({ to: "/signin" });
		}
	}, [navigate]);
};
