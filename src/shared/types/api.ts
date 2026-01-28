export interface ApiError {
	error: string;
}

export interface ApiUser {
	id: number;
	email: string;
	display_name: string;
	email_verified: boolean;
	created_at: string | null;
}

export interface CreateUserRequest {
	email: string;
	display_name: string;
	password: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	token: string;
	user_id: number;
	email: string;
	display_name: string;
}

export interface VerifyEmailResponse {
	token: string;
	user_id: number;
	email: string;
	display_name: string;
}

export interface ResendVerificationRequest {
	email: string;
}

export interface Picture {
	id: number;
	user_id: number;
	image_url: string;
	created_at: string;
}

export interface PicturesResponse {
	pictures: Picture[];
}
