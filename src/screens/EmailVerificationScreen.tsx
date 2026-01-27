import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../context/LanguageContext";
import type { Screen } from "../types/screen";

const EmailVerificationScreen: React.FC<{
	navigateTo: (screen: Screen) => void;
	showSnackbar: (message: string, type?: "success" | "error" | "info") => void;
	token: string;
}> = ({ navigateTo, showSnackbar, token }) => {
	const { verifyEmail } = useAuth();
	const { t } = useTranslation();
	const [isLoading, setIsLoading] = useState(true);
	const [verificationStatus, setVerificationStatus] = useState<
		"verifying" | "success" | "error"
	>("verifying");
	const hasVerified = useRef(false);

	useEffect(() => {
		if (hasVerified.current) return;
		hasVerified.current = true;

		const verifyToken = async () => {
			try {
				await verifyEmail(token);
				setVerificationStatus("success");
			} catch (error) {
				setVerificationStatus("error");
				const errorMessage =
					error instanceof Error ? error.message : t("verificationFailed");
				showSnackbar(errorMessage, "error");
			} finally {
				setIsLoading(false);
			}
		};

		verifyToken();
	}, [token, verifyEmail, showSnackbar, t]);

	return (
		<div className="flex h-full flex-col bg-gray-50 p-4">
			{/* Header */}
			<header className="flex items-center mb-4">
				<button
					type="button"
					className="mr-2 text-gray-600"
					onClick={() => navigateTo("home")}
				>
					{t("back")}
				</button>
				<h1 className="text-lg font-semibold">{t("emailVerification")}</h1>
			</header>

			{/* Verification Status */}
			<div className="flex-1 flex flex-col items-center justify-center p-4">
				{isLoading ? (
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
						<p className="mt-4 text-gray-600">{t("verifyingEmail")}</p>
					</div>
				) : verificationStatus === "success" ? (
					<div className="text-center">
						<div className="mx-auto bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
							<svg
								className="w-8 h-8 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
							>
								<title>Checkmark Icon</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M5 13l4 4L19 7"
								></path>
							</svg>
						</div>
						<h2 className="mt-4 text-xl font-bold text-gray-900">
							{t("verificationSuccessful")}
						</h2>
						<p className="mt-2 text-gray-600">{t("emailVerifiedMessage")}</p>
						<button
							type="button"
							className="mt-6 px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors"
							onClick={() => navigateTo("account")}
						>
							{t("goToAccount")}
						</button>
					</div>
				) : (
					<div className="text-center">
						<div className="mx-auto bg-red-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
							<svg
								className="w-8 h-8 text-red-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
							>
								<title>X Icon</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								></path>
							</svg>
						</div>
						<h2 className="mt-4 text-xl font-bold text-gray-900">
							{t("verificationFailed")}
						</h2>
						<p className="mt-2 text-gray-600">
							{t("verificationFailedMessage")}
						</p>
						<button
							type="button"
							className="mt-6 px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors"
							onClick={() => navigateTo("account")}
						>
							{t("goToAccount")}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default EmailVerificationScreen;
