import { useState, useEffect } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import HomeScreen from "./screens/HomeScreen";
import RequestCreationScreen from "./screens/RequestCreationScreen";
import PhotoCaptureScreen from "./screens/PhotoCaptureScreen";
import SignupScreen from "./screens/SignupScreen";
import SigninScreen from "./screens/SigninScreen";
import AccountScreen from "./screens/AccountScreen";
import EmailVerificationScreen from "./screens/EmailVerificationScreen";
import EmailVerificationRequiredScreen from "./screens/EmailVerificationRequiredScreen";
import Snackbar from "./components/Snackbar";
import type { Request } from "./types/request";

type Screen =
	| "home"
	| "request-creation"
	| "photo-capture"
	| "signup"
	| "signin"
	| "account"
	| "email-verification"
	| "email-verification-required";

function App() {
	const [currentScreen, setCurrentScreen] = useState<Screen>("home");
	const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
	const [snackbar, setSnackbar] = useState({
		isVisible: false,
		message: "",
		type: "success" as "success" | "error" | "info",
	});
	const [verificationToken, setVerificationToken] = useState<string | null>(
		null,
	);

	useEffect(() => {
		const token = sessionStorage.getItem("verificationToken");
		if (token) {
			sessionStorage.removeItem("verificationToken");
			setVerificationToken(token);
			setCurrentScreen("email-verification");
		}
	}, []);

	const navigateTo = (screen: Screen, request?: Request, token?: string) => {
		setCurrentScreen(screen);
		if (request) {
			setSelectedRequest(request);
		}
		if (token) {
			setVerificationToken(token);
		}
	};

	const showSnackbar = (
		message: string,
		type: "success" | "error" | "info" = "success",
	) => {
		setSnackbar({
			isVisible: true,
			message,
			type,
		});
	};

	const hideSnackbar = () => {
		setSnackbar((prev) => ({
			...prev,
			isVisible: false,
		}));
	};

	const renderScreen = () => {
		switch (currentScreen) {
			case "home":
				return <HomeScreen navigateTo={navigateTo} />;
			case "request-creation":
				return (
					<RequestCreationScreen
						navigateTo={navigateTo}
						showSnackbar={showSnackbar}
					/>
				);
			case "photo-capture":
				return (
					<PhotoCaptureScreen
						navigateTo={navigateTo}
						request={selectedRequest}
						showSnackbar={showSnackbar}
					/>
				);
			case "signup":
				return (
					<SignupScreen navigateTo={navigateTo} showSnackbar={showSnackbar} />
				);
			case "signin":
				return (
					<SigninScreen navigateTo={navigateTo} showSnackbar={showSnackbar} />
				);
			case "account":
				return (
					<AccountScreen navigateTo={navigateTo} showSnackbar={showSnackbar} />
				);
			case "email-verification":
				return verificationToken ? (
					<EmailVerificationScreen
						navigateTo={navigateTo}
						showSnackbar={showSnackbar}
						token={verificationToken}
					/>
				) : (
					<HomeScreen navigateTo={navigateTo} />
				);
			case "email-verification-required":
				return (
					<EmailVerificationRequiredScreen
						navigateTo={navigateTo}
						showSnackbar={showSnackbar}
					/>
				);
			default:
				return <HomeScreen navigateTo={navigateTo} />;
		}
	};

	return (
		<div className="min-h-screen w-screen">
			{renderScreen()}
			<Snackbar
				message={snackbar.message}
				isVisible={snackbar.isVisible}
				onClose={hideSnackbar}
				type={snackbar.type}
			/>
		</div>
	);
}

const AppWithProviders: React.FC = () => {
	return (
		<AuthProvider>
			<LanguageProvider>
				<App />
			</LanguageProvider>
		</AuthProvider>
	);
};

export default AppWithProviders;
