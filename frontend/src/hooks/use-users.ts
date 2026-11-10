import UsersService from "@/services/users";
import type {UpdateUserRequest, UsersFilterParams} from "@/types/user";
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import {toast} from "sonner";

// Query keys for users
export const userKeys = {
	all: ["users"] as const,
	lists: () => [...userKeys.all, "list"] as const,
	list: (filters: UsersFilterParams) => [...userKeys.lists(), filters] as const,
	details: () => [...userKeys.all, "detail"] as const,
	detail: (id: string) => [...userKeys.details(), id] as const,
};

// Default empty params object for stable reference
const DEFAULT_PARAMS: UsersFilterParams = {};

// Hook to get all users with optional filtering
export function useUsers(params?: UsersFilterParams) {
	const normalizedParams = params || DEFAULT_PARAMS;

	return useQuery({
		queryKey: userKeys.list(normalizedParams),
		queryFn: () => UsersService.getUsers(normalizedParams),
		placeholderData: keepPreviousData,
	});
}

// Hook to get a single user by ID
export function useUser(id: string) {
	return useQuery({
		queryKey: userKeys.detail(id),
		queryFn: () => UsersService.getUser(id),
		enabled: !!id,
	});
}

// Note: User creation is handled by registration/external auth
// This functionality is intentionally removed from admin panel

// Hook to update a user
export function useUpdateUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (userData: UpdateUserRequest) =>
			UsersService.updateUser(userData),
		onSuccess: (updatedUser) => {
			// Update the user in the cache
			queryClient.setQueryData(userKeys.detail(updatedUser._id), updatedUser);
			// Invalidate users list to ensure consistency
			queryClient.invalidateQueries({queryKey: userKeys.lists()});
		},
		onError: (error) => {
			toast.error(error?.message || "Failed to update user");
		},
	});
}

// Hook to delete a user
export function useDeleteUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => UsersService.deleteUser(id),
		onSuccess: (_, deletedUserId) => {
			// Remove user from cache
			queryClient.removeQueries({
				queryKey: userKeys.detail(deletedUserId),
			});
			// Invalidate users list
			queryClient.invalidateQueries({queryKey: userKeys.lists()});
		},
	});
}

// Hook to bulk delete users
export function useBulkDeleteUsers() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (userIds: string[]) => UsersService.bulkDeleteUsers(userIds),
		onSuccess: (_, deletedUserIds) => {
			// Remove all deleted users from cache
			deletedUserIds.forEach((userId) => {
				queryClient.removeQueries({
					queryKey: userKeys.detail(userId),
				});
			});
			// Invalidate users list
			queryClient.invalidateQueries({queryKey: userKeys.lists()});
		},
	});
}
