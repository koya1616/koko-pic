import { useEffect, useState } from "react";

type LatLng = { lat: number; lng: number };

export const useGeolocation = () => {
	const [location, setLocation] = useState<LatLng | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!navigator.geolocation) {
			setError("この環境では位置情報が利用できません。");
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setLocation({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				});
			},
			(geoError) => {
				setError(
					geoError.code === geoError.PERMISSION_DENIED
						? "位置情報の利用が許可されていません。"
						: "位置情報の取得に失敗しました。",
				);
			},
			{ enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 },
		);
	}, []);

	return { location, error };
};
