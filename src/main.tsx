import React from "react";
import ReactDOM from "react-dom/client";
import AppWithProviders from "./App";
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";

const checkForVerificationToken = () => {
	const path = window.location.pathname;
	const segments = path.split("/");

	if (segments[1] === "verify-email" && segments.length > 2) {
		const token = segments[2];
		if (token) {
			window.history.replaceState({}, "", "/");
			return token;
		}
	}
	return null;
};

const verificationToken = checkForVerificationToken();

if (verificationToken) {
	sessionStorage.setItem("verificationToken", verificationToken);
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<AppWithProviders />
	</React.StrictMode>,
);
