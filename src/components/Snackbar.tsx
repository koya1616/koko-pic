import type React from "react";
import { useEffect } from "react";

interface SnackbarProps {
	message: string;
	isVisible: boolean;
	onClose: () => void;
	duration?: number; // Duration in milliseconds before auto-hiding (default: 3000ms)
	type?: "success" | "error" | "info"; // Type affects styling
}

const Snackbar: React.FC<SnackbarProps> = ({
	message,
	isVisible,
	onClose,
	duration = 3000,
	type = "info",
}) => {
	useEffect(() => {
		if (!isVisible) return;

		const timer = setTimeout(() => {
			onClose();
		}, duration);

		return () => {
			clearTimeout(timer);
		};
	}, [isVisible, onClose, duration]);

	if (!isVisible) {
		return null;
	}

	// Determine styling based on type
	const getSnackbarStyle = () => {
		switch (type) {
			case "success":
				return "bg-green-500";
			case "error":
				return "bg-red-500";
			default:
				return "bg-gray-800";
		}
	};

	return (
		<div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
			<div
				className={`${getSnackbarStyle()} text-white px-4 py-3 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out w-[80vw] max-w-md`}
			>
				<div className="flex items-center justify-between w-full">
					<span className="flex-grow">{message}</span>
					<button
						type="button"
						onClick={onClose}
						className="ml-4 text-white text-xl hover:opacity-80 focus:outline-none"
					>
						×
					</button>
				</div>
			</div>
		</div>
	);
};

export default Snackbar;
