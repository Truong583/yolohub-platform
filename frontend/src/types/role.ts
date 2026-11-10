// Role interfaces and types for the role management system

import {Permission} from "@/configs/permission";

// Import Permission type from components

// Base role interface
export interface IRole {
	_id: string;
	name: string;
	description: string;
	permissions: Permission[];
	inherits: IRole[];
	totalUsers: number;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

// Form data interface for creating/updating roles
export interface RoleFormData {
	name: string;
	description: string;
	permissions: Permission[];
	inherits: string[]; // Array of role IDs
}

// Role creation request
export interface CreateRoleRequest {
	name: string;
	description: string;
	permissions: Permission[];
	inherits?: string[]; // Array of role IDs
}

// Role update request
export interface UpdateRoleRequest extends Partial<CreateRoleRequest> {
	id: string;
}

// Role permissions update request
export interface UpdateRolePermissionsRequest {
	id: string;
	permissions: Permission[];
}

// Role inheritance update request
export interface UpdateRoleInheritanceRequest {
	id: string;
	inherits: string[]; // Array of role IDs
}

// Resolved permissions interface
export interface ResolvedPermissions {
	direct: Permission[];
	inherited: Permission[];
	effective: Permission[];
	inheritanceChain: {
		roleId: string;
		roleName: string;
		permissions: Permission[];
	}[];
}

// Filter and search parameters for roles
export interface RolesFilterParams {
	search?: string;
	hasPermissions?: boolean;
	hasInheritance?: boolean;
	sortBy?: keyof IRole;
	sortOrder?: "asc" | "desc";
	permissions?: Permission[]; // Filter by specific permissions
	[key: string]: unknown; // Index signature for additional properties
}
