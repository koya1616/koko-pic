import type React from "react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../context/LanguageContext";
import { validateSignupPassword } from "../utils/signupValidation";

type Screen =
	| "home"
	| "request-creation"
	| "photo-capture"
	| "signup"
	| "signin"
	| "account"
	| "email-verification-required";

const SignupScreen: React.FC<{
	navigateTo: (screen: Screen) => void;
	showSnackbar: (message: string, type?: "success" | "error" | "info") => void;
}> = ({ navigateTo, showSnackbar }) => {
	const { signup } = useAuth();
	const { t } = useTranslation();
	const [email, setEmail] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const validationError = validateSignupPassword({
			password,
			confirmPassword,
		});
		if (validationError) {
			showSnackbar(t(validationError), "error");
			return;
		}

		setIsLoading(true);
		try {
			await signup(email, displayName, password);
			navigateTo("email-verification-required");
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : t("signupFailed");
			showSnackbar(errorMessage, "error");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex h-full flex-col bg-gray-50 p-4">
			{/* Header */}
			<header className="flex items-center mb-4">
				<button
					type="button"
					className="mr-2 text-gray-600"
					onClick={() => navigateTo("signin")}
				>
					{t("back")}
				</button>
				<h1 className="text-lg font-semibold">{t("signup")}</h1>
			</header>

			{/* Signup Form */}
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						{t("email")}
					</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full p-2 border border-gray-300 rounded-lg"
						placeholder={t("emailPlaceholder")}
						required
					/>
				</div>

				<div>
					<label
						htmlFor="displayName"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						{t("displayName")}
					</label>
					<input
						id="displayName"
						type="text"
						value={displayName}
						onChange={(e) => setDisplayName(e.target.value)}
						className="w-full p-2 border border-gray-300 rounded-lg"
						placeholder={t("displayNamePlaceholder")}
						required
					/>
				</div>

				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						{t("password")}
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full p-2 border border-gray-300 rounded-lg"
						placeholder={t("passwordPlaceholder")}
						required
					/>
				</div>

				<div>
					<label
						htmlFor="confirmPassword"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						{t("confirmPassword")}
					</label>
					<input
						id="confirmPassword"
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						className="w-full p-2 border border-gray-300 rounded-lg"
						placeholder={t("confirmPasswordPlaceholder")}
						required
					/>
				</div>

				<button
					type="submit"
					className={`w-full py-3 text-white rounded-lg font-medium flex items-center justify-center ${
						isLoading ? "bg-indigo-400" : "bg-indigo-500 hover:bg-indigo-600"
					} transition-colors`}
					disabled={isLoading}
				>
					{isLoading ? `${t("loading")}...` : t("signup")}
				</button>
			</form>

			<div className="mt-4 text-center">
				<p className="text-sm text-gray-600">
					{t("alreadyHaveAccount")}{" "}
					<button
						type="button"
						className="text-indigo-500 font-medium"
						onClick={() => navigateTo("signin")}
					>
						{t("signin")}
					</button>
				</p>
			</div>
		</div>
	);
};

export default SignupScreen;
