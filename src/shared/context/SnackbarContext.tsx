import { createContext, useContext, useState, useCallback } from "react";
import type React from "react";

type SnackbarType = "success" | "error" | "info";

interface SnackbarState {
	isVisible: boolean;
	message: string;
	type: SnackbarType;
}

interface SnackbarContextType {
	snackbar: SnackbarState;
	showSnackbar: (message: string, type?: SnackbarType) => void;
	hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
	undefined,
);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [snackbar, setSnackbar] = useState<SnackbarState>({
		isVisible: false,
		message: "",
		type: "success",
	});

	const showSnackbar = useCallback(
		(message: string, type: SnackbarType = "success") => {
			setSnackbar({
				isVisible: true,
				message,
				type,
			});
		},
		[],
	);

	const hideSnackbar = useCallback(() => {
		setSnackbar((prev) => ({
			...prev,
			isVisible: false,
		}));
	}, []);

	return (
		<SnackbarContext.Provider value={{ snackbar, showSnackbar, hideSnackbar }}>
			{children}
		</SnackbarContext.Provider>
	);
};

export const useSnackbar = (): SnackbarContextType => {
	const context = useContext(SnackbarContext);
	if (!context) {
		throw new Error("useSnackbar must be used within a SnackbarProvider");
	}
	return context;
};
