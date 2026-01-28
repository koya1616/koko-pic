import type React from "react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "../shared/context/LanguageContext";
import { useSnackbar } from "../shared/context/SnackbarContext";
import { resendVerificationEmail } from "../api/emailVerification";
import { STORAGE_KEYS } from "../constants/storage";

const EmailVerificationRequiredScreen: React.FC = () => {
	const navigate = useNavigate();
	const { showSnackbar } = useSnackbar();
	const { t } = useTranslation();

	const [isSending, setIsSending] = useState(false);

	const userEmail =
		localStorage.getItem(STORAGE_KEYS.pendingVerificationEmail) || "";
	const verificationMessage = userEmail
		? t("verificationRequiredMessage", { email: userEmail })
		: t("pleaseVerifyEmail");

	const handleResend = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!userEmail || isSending) {
			return;
		}

		setIsSending(true);
		try {
			await resendVerificationEmail(userEmail);
			showSnackbar(t("verificationSent"), "success");
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : t("resendVerificationFailed");
			showSnackbar(errorMessage, "error");
		} finally {
			setIsSending(false);
		}
	};

	return (
		<div className="flex h-full flex-col bg-gray-50 p-4">
			{/* Header */}
			<header className="flex items-center mb-4">
				<button
					type="button"
					className="mr-2 text-gray-600"
					onClick={() => navigate({ to: "/account" })}
				>
					{t("back")}
				</button>
				<h1 className="text-lg font-semibold">{t("emailVerification")}</h1>
			</header>

			{/* Verification Required Message */}
			<div className="flex-1 flex flex-col items-center justify-center p-4">
				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md w-full text-center">
					<div className="mx-auto bg-yellow-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
						<svg
							className="w-8 h-8 text-yellow-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<title>Envelope Icon</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							></path>
						</svg>
					</div>
					<h2 className="text-xl font-bold text-gray-900 mb-2">
						{t("verifyYourEmail")}
					</h2>
					<p className="text-gray-600 mb-4">{verificationMessage}</p>
					{userEmail && (
						<form onSubmit={handleResend} className="space-y-3">
							<button
								type="submit"
								className={`w-full px-4 py-2 text-white rounded-lg font-medium transition-colors ${
									isSending
										? "bg-indigo-300"
										: "bg-indigo-500 hover:bg-indigo-600"
								}`}
								disabled={isSending}
							>
								{isSending ? t("sending") : t("resendVerificationEmail")}
							</button>
						</form>
					)}
					<div className="mt-6">
						<button
							type="button"
							className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors"
							onClick={() => navigate({ to: "/signup" })}
						>
							{t("backToSignup")}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EmailVerificationRequiredScreen;
