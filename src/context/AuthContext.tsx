import type React from "react";
import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import type { ReactNode } from "react";

interface User {
	id: number;
	email: string;
	display_name: string;
}

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
			const response = await fetch(
				`${import.meta.env.VITE_API_BASE_URL || "http://0.0.0.0:8000"}/api/v1/users/me`,
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				},
			);

			if (response.ok) {
				const userData = await response.json();
				setUser({
					id: userData.id,
					email: userData.email,
					display_name: userData.display_name,
				});
			} else {
				localStorage.removeItem("authToken");
				setToken(null);
				setUser(null);
			}
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
			const response = await fetch(
				`${import.meta.env.VITE_API_BASE_URL || "http://0.0.0.0:8000"}/api/v1/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, password }),
				},
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Login failed");
			}

			const data = await response.json();
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
			const response = await fetch(
				`${import.meta.env.VITE_API_BASE_URL || "http://0.0.0.0:8000"}/api/v1/users`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, display_name: displayName, password }),
				},
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Signup failed");
			}
		} catch (error) {
			setIsLoading(false);
			throw error;
		}
	};

	const verifyEmail = async (token: string) => {
		const response = await fetch(
			`${import.meta.env.VITE_API_BASE_URL || "http://0.0.0.0:8000"}/api/v1/verify-email/${token}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || "Email verification failed");
		}

		const data = await response.json();

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
