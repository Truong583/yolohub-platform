import {ApiService} from "@/lib/api-service";
import type {
	IUser,
	UpdateUserRequest,
	UpdateUserStatusRequest,
	UpdateUserRolesRequest,
	UpdateUserCoursesRequest,
	UsersFilterParams,
	UsersListResponse,
	UserStats,
} from "@/types/user";

// User API endpoints
const ENDPOINTS = {
	USERS: "/users",
	USER: (id: string) => `/users/${id}`,
	USER_STATUS: (id: string) => `/users/${id}/status`,
	USER_ROLES: (id: string) => `/users/${id}/roles`,
	USER_COURSES: (id: string) => `/users/${id}/courses`,
	USER_STATS: "/users/stats",
	BULK_DELETE: "/users/bulk-delete",
} as const;

// Users service
export class UsersService {
	// Get all users with optional filtering
	static async getUsers(
		params?: UsersFilterParams
	): Promise<UsersListResponse> {
		try {
			return await ApiService.get<UsersListResponse>(ENDPOINTS.USERS, params);
		} catch {
			return {
				users: [],
				pagination: {
					page: 1,
					limit: 10,
					total: 0,
					totalPages: 0,
					hasNextPage: false,
					hasPrevPage: false,
				},
			};
		}
	}

	// Get a single user by ID
	static async getUser(id: string): Promise<IUser> {
		return ApiService.get<IUser>(ENDPOINTS.USER(id));
	}

	// Note: User creation is handled by registration/external auth
	// This functionality is intentionally removed from admin panel

	// Update an existing user
	static async updateUser(userData: UpdateUserRequest): Promise<IUser> {
		const {id, ...updateData} = userData;
		return ApiService.put<IUser, Omit<UpdateUserRequest, "id">>(
			ENDPOINTS.USER(id),
			updateData
		);
	}

	// Update user status
	static async updateUserStatus(
		statusData: UpdateUserStatusRequest
	): Promise<IUser> {
		const {id, status} = statusData;
		return ApiService.put<IUser, {status: string}>(ENDPOINTS.USER_STATUS(id), {
			status,
		});
	}

	// Update user roles
	static async updateUserRoles(
		rolesData: UpdateUserRolesRequest
	): Promise<IUser> {
		const {id, roles} = rolesData;
		return ApiService.put<IUser, {roles: string[]}>(ENDPOINTS.USER_ROLES(id), {
			roles,
		});
	}

	// Update user courses
	static async updateUserCourses(
		coursesData: UpdateUserCoursesRequest
	): Promise<IUser> {
		const {id, courses} = coursesData;
		return ApiService.put<IUser, {courses: string[]}>(
			ENDPOINTS.USER_COURSES(id),
			{courses}
		);
	}

	// Delete a user
	static async deleteUser(id: string): Promise<void> {
		return ApiService.delete<void>(ENDPOINTS.USER(id));
	}

	// Bulk delete users
	static async bulkDeleteUsers(userIds: string[]): Promise<void> {
		return ApiService.post<void, {userIds: string[]}>(ENDPOINTS.BULK_DELETE, {
			userIds,
		});
	}

	// Get user statistics
	static async getUserStats(): Promise<UserStats> {
		return ApiService.get<UserStats>(ENDPOINTS.USER_STATS);
	}
}

// Export as default for consistency with other services
export default UsersService;
