import type { Request } from "../types/request";

export const mockRequests: Request[] = [
	{
		id: 1,
		location: { lat: 35.6895, lng: 139.6917 },
		status: "open",
		description: "駅前の混雑状況がわかる写真1枚ください",
	},
	{
		id: 2,
		location: { lat: 35.6905, lng: 139.6927 },
		status: "open",
		description: "コンビニ前の様子を確認したいです",
	},
	{
		id: 3,
		location: { lat: 35.6885, lng: 139.6907 },
		status: "in-progress",
		description: "満開の桜を撮影してほしいです",
	},
];
