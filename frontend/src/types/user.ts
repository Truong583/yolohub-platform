import {IRole} from "./role";

// Base user interface representing the user entity
export interface IUser {
	_id: string;
	username: string;
	email: string;
	password: string; // Hashed password (not exposed in API responses)
	status: "active" | "inactive" | "banned";
	avatar?: string;
	courses: string[]; // Array of course IDs
	userType: "facebook" | "google" | "default";
	roles: IRole[]; // Array of role objects
	createdAt: string;
	updatedAt: string;
}

// User status enum matching your schema
export type UserStatus = "active" | "inactive" | "banned";

// User type enum matching your schema
export type UserType = "facebook" | "google" | "default";

// Form data interface for creating/updating users
export interface UserFormData {
	username: string;
	email: string;
	status: UserStatus;
	avatar?: string;
	courses: string[];
	userType: UserType;
	roles: string[];
	password?: string; // Only for creation
}

// Statistics interface for user metrics
export interface UserStats {
	totalUsers: number;
	activeUsers: number;
	inactiveUsers: number;
	bannedUsers: number;
	facebookUsers: number;
	googleUsers: number;
	defaultUsers: number;
}

// User with additional computed properties
export interface IUserWithStats extends IUser {
	coursesCount?: number; // Number of courses the user is enrolled in
	completedCoursesCount?: number; // Number of completed courses
}

// Pagination interface for user lists
export interface UserPagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNextPage?: boolean;
	hasPrevPage?: boolean;
}

// Users list response
export interface UsersListResponse {
	users: IUser[];
	pagination: UserPagination;
}

// Filter and search parameters for users
export interface UsersFilterParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: string[];
	userType?: string[];
	role?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	[key: string]: unknown;
}

// Request interfaces for API calls
export interface CreateUserRequest {
	username: string;
	email: string;
	password: string;
	status?: UserStatus;
	avatar?: string;
	courses?: string[];
	userType?: UserType;
	roles?: string[];
}

export interface UpdateUserRequest {
	id: string;
	username?: string;
	email?: string;
	status?: UserStatus;
	avatar?: string;
	courses?: string[];
	userType?: UserType;
	roles?: string[];
}
export interface UpdateUserStatusRequest {
	id: string;
	status: UserStatus;
}

export interface UpdateUserRolesRequest {
	id: string;
	roles: string[];
}

export interface UpdateUserCoursesRequest {
	id: string;
	courses: string[];
}
