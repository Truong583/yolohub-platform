import {ApiService} from "@/lib/api-service";
import type {
	CreateRoleRequest,
	IRole,
	RolesFilterParams,
	UpdateRoleRequest,
} from "@/types/role";

const ENDPOINTS = {
	ROLES: "/roles",
	ROLE: (id: string) => `/roles/${id}`,
	ROLE_STATS: "/roles/stats",
} as const;

export class RolesService {
	// Get roles
	static async getRoles(params?: RolesFilterParams): Promise<IRole[]> {
		try {
			return await ApiService.get<IRole[]>(
				ENDPOINTS.ROLES,
				params as Record<string, unknown>
			);
		} catch {
			return [];
		}
	}

	// Get role by ID
	static async getRole(id: string): Promise<IRole> {
		return ApiService.get<IRole>(ENDPOINTS.ROLE(id));
	}

	// Create role
	static async createRole(roleData: CreateRoleRequest): Promise<IRole> {
		return ApiService.post<IRole, CreateRoleRequest>(ENDPOINTS.ROLES, roleData);
	}

	// Update role
	static async updateRole(roleData: UpdateRoleRequest): Promise<IRole> {
		const {id, ...updateData} = roleData;
		return ApiService.put<IRole, Omit<UpdateRoleRequest, "id">>(
			ENDPOINTS.ROLE(id),
			updateData
		);
	}

	// Delete role
	static async deleteRole(id: string): Promise<void> {
		return ApiService.delete<void>(ENDPOINTS.ROLE(id));
	}
}

export default RolesService;
