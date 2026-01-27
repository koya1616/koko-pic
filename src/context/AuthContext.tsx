import type React from "react";
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { ApiUser } from "../types/api";
import { apiRequest } from "../utils/api";
import { STORAGE_KEYS } from "../constants/storage";

type User = Pick<ApiUser, "id" | "email" | "display_name">;

interface AuthContextType {
	user: User | null;
	token: string | null;
	signup: (
		email: string,
		displayName: string,
		password: string,
	) => Promise<void>;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, _setUser] = useState<User | null>(null);
	const [token, _setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const signup = async (
		email: string,
		displayName: string,
		password: string,
	) => {
		setIsLoading(true);
		try {
			await apiRequest<ApiUser>("/api/v1/users", {
				method: "POST",
				body: { email, display_name: displayName, password },
			});
			localStorage.setItem(STORAGE_KEYS.pendingVerificationEmail, email);
		} catch (error) {
			setIsLoading(false);
			throw error;
		}
	};

	const value = {
		user,
		token,
		signup,
		isLoading,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
