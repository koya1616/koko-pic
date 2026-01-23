import { useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import RequestCreationScreen from "./screens/RequestCreationScreen";
import PhotoCaptureScreen from "./screens/PhotoCaptureScreen";
import Snackbar from "./components/Snackbar";

// Define the screen types
type Screen = "home" | "request-creation" | "photo-capture";

interface Request {
	id: number;
	distance: number;
	location: { lat: number; lng: number };
	status: string;
	description: string;
}

function App() {
	const [currentScreen, setCurrentScreen] = useState<Screen>("home");
	const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
	const [snackbar, setSnackbar] = useState({
		isVisible: false,
		message: "",
		type: "success" as "success" | "error" | "info",
	});

	const navigateTo = (screen: Screen, request?: Request) => {
		setCurrentScreen(screen);
		if (request) {
			setSelectedRequest(request);
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
				return <RequestCreationScreen navigateTo={navigateTo} />;
			case "photo-capture":
				return (
					<PhotoCaptureScreen
						navigateTo={navigateTo}
						request={selectedRequest}
						showSnackbar={showSnackbar}
					/>
				);
			default:
				return <HomeScreen navigateTo={navigateTo} />;
		}
	};

	return (
		<div className="h-screen w-screen overflow-hidden">
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

export default App;
