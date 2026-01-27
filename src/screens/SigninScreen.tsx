import type React from "react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "../context/LanguageContext";
import { useSnackbar } from "../context/SnackbarContext";
import type { LoginResponse } from "../types/api";
import { apiRequest } from "../utils/api";
import { STORAGE_KEYS } from "../constants/storage";

const SigninScreen: React.FC = () => {
	const navigate = useNavigate();
	const { showSnackbar } = useSnackbar();
	const { t } = useTranslation();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const login = async (email: string, password: string) => {
		const data = await apiRequest<LoginResponse>("/api/v1/login", {
			method: "POST",
			body: { email, password },
		});
		const { token } = data;

		localStorage.setItem(STORAGE_KEYS.authToken, token);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setIsLoading(true);
		try {
			await login(email, password);
			navigate({ to: "/" });
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : t("loginFailed");
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
					onClick={() => navigate({ to: "/" })}
				>
					{t("back")}
				</button>
				<h1 className="text-lg font-semibold">{t("signin")}</h1>
			</header>

			{/* Signin Form */}
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

				<button
					type="submit"
					className={`w-full py-3 text-white rounded-lg font-medium flex items-center justify-center ${
						isLoading ? "bg-indigo-400" : "bg-indigo-500 hover:bg-indigo-600"
					} transition-colors`}
					disabled={isLoading}
				>
					{isLoading ? `${t("loading")}...` : t("signin")}
				</button>
			</form>

			<div className="mt-4 text-center">
				<p className="text-sm text-gray-600">
					{t("dontHaveAccount")}{" "}
					<button
						type="button"
						className="text-indigo-500 font-medium"
						onClick={() => navigate({ to: "/signup" })}
					>
						{t("signup")}
					</button>
				</p>
			</div>
		</div>
	);
};

export default SigninScreen;
