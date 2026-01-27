import type React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../context/LanguageContext";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

const AccountScreen: React.FC = () => {
	useAuthRedirect();

	const navigate = useNavigate();
	const { user, logout } = useAuth();
	const { t } = useTranslation();

	const handleLogout = () => {
		logout();
		navigate({ to: "/" });
	};

	if (!user) {
		return (
			<div className="flex h-full flex-col bg-gray-50 p-4">
				<header className="flex items-center mb-4">
					<button
						type="button"
						className="mr-2 text-gray-600"
						onClick={() => navigate({ to: "/" })}
					>
						{t("back")}
					</button>
					<h1 className="text-lg font-semibold">{t("account")}</h1>
				</header>
				<div className="flex-1 flex items-center justify-center">
					<p>{t("notLoggedIn")}</p>
				</div>
			</div>
		);
	}

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
				<h1 className="text-lg font-semibold">{t("account")}</h1>
			</header>

			{/* Account Info */}
			<div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
				<div className="mb-4">
					<h2 className="text-md font-medium text-gray-900">
						{t("profileInfo")}
					</h2>
				</div>

				<div className="space-y-3">
					<div>
						<p className="text-sm text-gray-500">{t("displayName")}</p>
						<p className="text-gray-900">{user.display_name}</p>
					</div>

					<div>
						<p className="text-sm text-gray-500">{t("email")}</p>
						<p className="text-gray-900">{user.email}</p>
					</div>
				</div>
			</div>

			{/* Logout Button */}
			<div className="mt-auto pt-4">
				<button
					type="button"
					className="w-full py-3 bg-red-500 text-white rounded-lg font-medium flex items-center justify-center hover:bg-red-600 transition-colors"
					onClick={handleLogout}
				>
					{t("logout")}
				</button>
			</div>
		</div>
	);
};

export default AccountScreen;
