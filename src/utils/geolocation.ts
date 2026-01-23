const GEO_PERMISSION_DENIED = 1;

export const geoErrorToMessage = (error: { code: number }) =>
	error.code === GEO_PERMISSION_DENIED
		? "位置情報の利用が許可されていません。"
		: "位置情報の取得に失敗しました。";
