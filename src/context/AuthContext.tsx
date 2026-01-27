import type React from "react";
import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import type { ReactNode } from "react";
import type { ApiUser, LoginResponse, VerifyEmailResponse } from "../types/api";
import { apiRequest } from "../utils/api";

type User = Pick<ApiUser, "id" | "email" | "display_name">;

interface AuthContextType {
	user: User | null;
	token: string | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	signup: (
		email: string,
		displayName: string,
		password: string,
	) => Promise<void>;
	verifyEmail: (token: string) => Promise<void>;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const fetchUserInfo = useCallback(async (authToken: string) => {
		try {
			const userData = await apiRequest<ApiUser>("/api/v1/users/me", {
				token: authToken,
			});
			setUser({
				id: userData.id,
				email: userData.email,
				display_name: userData.display_name,
			});
		} catch (error) {
			console.error("Error fetching user info:", error);
			localStorage.removeItem("authToken");
			setToken(null);
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		const storedToken = localStorage.getItem("authToken");
		if (storedToken) {
			setToken(storedToken);
			fetchUserInfo(storedToken);
		} else {
			setIsLoading(false);
		}
	}, [fetchUserInfo]);

	const login = async (email: string, password: string) => {
		setIsLoading(true);
		try {
			const data = await apiRequest<LoginResponse>("/api/v1/login", {
				method: "POST",
				body: { email, password },
			});
			const { token, user_id, email: userEmail, display_name } = data;

			localStorage.setItem("authToken", token);

			setToken(token);
			setUser({
				id: user_id,
				email: userEmail,
				display_name,
			});
		} catch (error) {
			setIsLoading(false);
			throw error;
		}
	};

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
		} catch (error) {
			setIsLoading(false);
			throw error;
		}
	};

	const verifyEmail = async (token: string) => {
		const data = await apiRequest<VerifyEmailResponse>(
			`/api/v1/verify-email/${token}`,
		);

		const { token: authToken, user_id, email, display_name } = data;

		localStorage.setItem("authToken", authToken);
		setToken(authToken);

		setUser({
			id: user_id,
			email: email,
			display_name: display_name,
		});
	};

	const logout = () => {
		localStorage.removeItem("authToken");
		setToken(null);
		setUser(null);
	};

	const value = {
		user,
		token,
		login,
		logout,
		signup,
		verifyEmail,
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
