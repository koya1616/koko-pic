import type { Request } from "../types/request";

export const mockRequests: Request[] = [
	{
		id: 1,
		lat: 35.6895,
		lng: 139.6917,
		status: "open",
		placeName: "新宿駅東口",
		description: "駅前の混雑状況がわかる写真1枚ください",
	},
	{
		id: 2,
		lat: 34.6937,
		lng: 135.5023,
		status: "open",
		placeName: "梅田駅周辺",
		description: "コンビニ前の様子を確認したいです",
	},
	{
		id: 3,
		lat: 35.1709,
		lng: 136.8819,
		status: "in-progress",
		placeName: "鶴舞公園",
		description: "満開の桜を撮影してほしいです",
	},
	{
		id: 4,
		lat: 34.0459,
		lng: 134.5593,
		status: "completed",
		placeName: "眉山ロープウェイ",
		description: "夕方の空の写真を撮ってください",
	},
	{
		id: 5,
		lat: 43.0642,
		lng: 141.3468,
		status: "open",
		placeName: "大通公園",
		description: "公園の遊具の安全点検が必要です",
	},
	{
		id: 6,
		lat: 26.2124,
		lng: 127.6792,
		status: "open",
		placeName: "那覇市国際通り",
		description: "イベント会場の混雑状況を確認してください",
	},
];
