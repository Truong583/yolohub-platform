import {ApiService} from "@/lib/api-service";

// Auth endpoints
const ENDPOINTS = {
	LOGIN: "/auth/login",
	LOGOUT: "/auth/logout",
	REFRESH: "/auth/refresh",
	PROFILE: "/auth/profile",
	ME: "/auth/me", // Add me endpoint
	REGISTER: "/auth/register",
	REGISTER_GOOGLE: "/auth/register-google",
	LOGIN_GOOGLE: "/auth/login-google",
	REGISTER_FACEBOOK: "/auth/register-facebook",
	LOGIN_FACEBOOK: "/auth/login-facebook",
	FORGOT_PASSWORD: "/auth/forgot-password",
	RESET_PASSWORD: "/auth/reset-password",
	VERIFY_EMAIL: "/auth/verify-email",
	RESEND_VERIFICATION: "/auth/resend-verification",
	UPDATE_PROFILE: "/auth/profile",
	CHANGE_PASSWORD: "/auth/password/change",
} as const;

// Auth types
export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export interface GoogleRegisterRequest {
	idToken: string;
}

export interface GoogleLoginRequest {
	idToken: string;
}

export interface FacebookLoginRequest {
	accessToken: string;
}

export interface AuthResponse {
	user: {
		id: string;
		username: string;
		email: string;
		avatar?: string; // Optional avatar URL
		roles: string[];
	};
	token: string;
	refreshToken: string;
}

// Extended user interface for /auth/me response
export interface CurrentUser {
	_id: string;
	username: string;
	email: string;
	avatar?: string; // Optional avatar URL from UploadThing
	status: string;
	userType: string;
	roles: {
		_id: string;
		name: string;
		description: string;
		permissions: string[];
	}[];
	userPermissions: string[];
	courses: string[];
}

export interface ForgotPasswordRequest {
	email: string;
}

export interface ResetPasswordRequest {
	token: string;
	newPassword: string;
}

export interface UpdateProfileRequest {
	username?: string;
	email?: string;
	avatar?: string;
}

export interface ChangePasswordRequest {
	currentPassword: string;
	newPassword: string;
}

// Auth service
export class AuthService {
	// Login user
	static async login(credentials: LoginRequest): Promise<AuthResponse> {
		return ApiService.post<AuthResponse, LoginRequest>(
			ENDPOINTS.LOGIN,
			credentials
		);
	}

	// Register new user
	static async register(userData: RegisterRequest): Promise<AuthResponse> {
		return ApiService.post<AuthResponse, RegisterRequest>(
			ENDPOINTS.REGISTER,
			userData
		);
	}

	// Register user with Google idToken
	static async registerWithGoogle(idToken: string): Promise<{message: string}> {
		return ApiService.post<{message: string}, GoogleRegisterRequest>(
			ENDPOINTS.REGISTER_GOOGLE,
			{idToken}
		);
	}

	// Login user with Google idToken
	static async loginWithGoogle(idToken: string): Promise<AuthResponse> {
		return ApiService.post<AuthResponse, GoogleLoginRequest>(
			ENDPOINTS.LOGIN_GOOGLE,
			{idToken}
		);
	}

	// Register user with Facebook access token
	static async registerWithFacebook(
		accessToken: string
	): Promise<{message: string}> {
		return ApiService.post<{message: string}, FacebookLoginRequest>(
			ENDPOINTS.REGISTER_FACEBOOK,
			{accessToken}
		);
	}

	// Login user with Facebook access token
	static async loginWithFacebook(accessToken: string): Promise<AuthResponse> {
		return ApiService.post<AuthResponse, FacebookLoginRequest>(
			ENDPOINTS.LOGIN_FACEBOOK,
			{accessToken}
		);
	}

	// Logout user
	static async logout(): Promise<void> {
		return ApiService.post<void>(ENDPOINTS.LOGOUT);
	}

	// Refresh token
	static async refreshToken(): Promise<{
		token: string;
		refreshToken: string;
	}> {
		return ApiService.post<{token: string; refreshToken: string}>(
			ENDPOINTS.REFRESH
		);
	}

	// Get user profile
	static async getProfile(): Promise<AuthResponse["user"]> {
		return ApiService.get<AuthResponse["user"]>(ENDPOINTS.PROFILE);
	}

	// Get current user with full details including role and permissions
	static async getAuthMe(): Promise<CurrentUser> {
		return ApiService.get<CurrentUser>(ENDPOINTS.ME);
	}

	// Forgot password
	static async forgotPassword(
		data: ForgotPasswordRequest
	): Promise<{message: string}> {
		return ApiService.post<{message: string}, ForgotPasswordRequest>(
			ENDPOINTS.FORGOT_PASSWORD,
			data
		);
	}

	// Reset password
	static async resetPassword(
		data: ResetPasswordRequest
	): Promise<{message: string}> {
		return ApiService.post<{message: string}, ResetPasswordRequest>(
			ENDPOINTS.RESET_PASSWORD,
			data
		);
	}

	// Update user profile
	static async updateProfile(data: UpdateProfileRequest): Promise<CurrentUser> {
		return ApiService.put<CurrentUser, UpdateProfileRequest>(
			ENDPOINTS.UPDATE_PROFILE,
			data
		);
	}

	// Change password
	static async changePassword(
		data: ChangePasswordRequest
	): Promise<{message: string}> {
		return ApiService.put<{message: string}, ChangePasswordRequest>(
			ENDPOINTS.CHANGE_PASSWORD,
			data
		);
	}

	// Verify email
	static async verifyEmail(data: {token: string}): Promise<{
		success: boolean;
		message: string;
		statusCode: number;
	}> {
		const res = await ApiService.post<
			{
				success: boolean;
				message: string;
				statusCode: number;
			},
			{token: string}
		>(ENDPOINTS.VERIFY_EMAIL, data);

		return res;
	}
}

export default AuthService;
