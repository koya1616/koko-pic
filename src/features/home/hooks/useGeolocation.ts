import { useEffect, useState } from "react";
import { useTranslation } from "../../../shared/context/LanguageContext";
import type { LatLng } from "../../../shared/types/request";
import {
	markPermissionGranted,
	shouldRequestPermissionOnce,
} from "../../../shared/utils/permissionOnce";

export const useGeolocation = () => {
	const { t } = useTranslation();
	const [location, setLocation] = useState<LatLng | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isActive = true;

		const requestLocation = async () => {
			if (!navigator.geolocation) {
				if (isActive) {
					setError(t("locationUnavailable"));
				}
				return;
			}

			const canRequest = await shouldRequestPermissionOnce(
				"geolocation",
				"geolocation",
			);
			if (!canRequest) {
				if (isActive) {
					setError(t("locationPermissionOnce"));
				}
				return;
			}

			navigator.geolocation.getCurrentPosition(
				(position) => {
					if (!isActive) {
						return;
					}
					markPermissionGranted("geolocation");
					setLocation({
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					});
				},
				(geoError) => {
					if (!isActive) {
						return;
					}
					setError(
						geoError.code === geoError.PERMISSION_DENIED
							? t("locationPermissionDenied")
							: t("geolocationFailed"),
					);
				},
				{ enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 },
			);
		};

		void requestLocation();

		return () => {
			isActive = false;
		};
	}, [t]);

	return { location, error };
};
