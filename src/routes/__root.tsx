import { createRootRoute, Outlet } from "@tanstack/react-router";
import { LanguageProvider } from "../context/LanguageContext";
import { SnackbarProvider, useSnackbar } from "../context/SnackbarContext";
import Snackbar from "../components/Snackbar";

function RootLayout() {
	const { snackbar, hideSnackbar } = useSnackbar();

	return (
		<div className="min-h-screen w-screen">
			<Outlet />
			<Snackbar
				message={snackbar.message}
				isVisible={snackbar.isVisible}
				onClose={hideSnackbar}
				type={snackbar.type}
			/>
		</div>
	);
}

function RootComponent() {
	return (
		<LanguageProvider>
			<SnackbarProvider>
				<RootLayout />
			</SnackbarProvider>
		</LanguageProvider>
	);
}

export const Route = createRootRoute({
	component: RootComponent,
});
