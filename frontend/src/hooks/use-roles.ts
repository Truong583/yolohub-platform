import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import RolesService from "@/services/roles";
import type {
	CreateRoleRequest,
	UpdateRoleRequest,
	RolesFilterParams,
} from "@/types/role";
import {toast} from "sonner";

// Query keys for roles
export const roleKeys = {
	all: ["roles"] as const,
	lists: () => [...roleKeys.all, "list"] as const,
	list: (filters: RolesFilterParams) => [...roleKeys.lists(), filters] as const,
	detail: (id: string) => [...roleKeys.all, "detail", id] as const,
};

// Default empty params object for stable reference
const DEFAULT_PARAMS: RolesFilterParams = {};

// Hook to get all roles with optional filtering
export function useRoles(params?: RolesFilterParams) {
	const normalizedParams = params || DEFAULT_PARAMS;

	return useQuery({
		queryKey: roleKeys.list(normalizedParams),
		queryFn: () => RolesService.getRoles(normalizedParams),
	});
}

// Hook to get a single role by ID
export function useRole(id: string) {
	return useQuery({
		queryKey: roleKeys.detail(id),
		queryFn: () => RolesService.getRole(id),
		enabled: !!id,
	});
}

// Hook to create a new role
export function useCreateRole() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (roleData: CreateRoleRequest) =>
			RolesService.createRole(roleData),
		onSuccess: () => {
			// Invalidate and refetch roles list
			queryClient.invalidateQueries({queryKey: roleKeys.lists()});
		},
		onError: (error) => {
			toast.error(error?.message || "Failed to create role");
		},
	});
}

// Hook to update a role
export function useUpdateRole() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (roleData: UpdateRoleRequest) =>
			RolesService.updateRole(roleData),
		onSuccess: (updatedRole) => {
			// Update the role in the cache
			queryClient.setQueryData(roleKeys.detail(updatedRole._id), updatedRole);
			// Invalidate roles list to ensure consistency
			queryClient.invalidateQueries({queryKey: roleKeys.lists()});
		},
		onError: (error) => {
			toast.error(error?.message || "Failed to update role");
		},
	});
}

// Hook to delete a role
export function useDeleteRole() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => RolesService.deleteRole(id),
		onSuccess: (_, deletedRoleId) => {
			// Remove role from cache
			queryClient.removeQueries({
				queryKey: roleKeys.detail(deletedRoleId),
			});
			// Invalidate roles list
			queryClient.invalidateQueries({queryKey: roleKeys.lists()});
		},
		onError: (error) => {
			toast.error(error?.message || "Failed to delete role");
		},
	});
}
