export const formatDistance = (meters: number) => {
	if (meters >= 1000) {
		const km = (meters / 1000).toFixed(1);
		const trimmed = km.endsWith(".0") ? km.slice(0, -2) : km;
		return `${trimmed}km`;
	}

	return `${meters}m`;
};
