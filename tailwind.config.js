/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				// Limited color palette for KokoPic
				white: "#ffffff",
				black: "#000000",
				indigo: {
					500: "#4f46e5", // Primary indigo
					600: "#4338ca", // Darker indigo for hover states
					700: "#3730a3", // Even darker for active states
				},
				green: {
					500: "#22c55e", // Primary green
					600: "#16a34a", // Darker green for hover states
				},
				orange: {
					500: "#f59e0b", // Primary orange
					600: "#d97706", // Darker orange for hover states
				},
				gray: {
					50: "#f8fafc", // Light gray background
					100: "#f1f5f9",
					200: "#e2e8f0",
					300: "#cbd5e1",
					400: "#94a3b8",
					500: "#64748b", // Medium gray
					600: "#475569",
					700: "#334155", // Dark gray for text
					800: "#1e293b",
					900: "#0f172a", // Very dark gray (almost black)
				},
			},
		},
	},
	plugins: [],
};
