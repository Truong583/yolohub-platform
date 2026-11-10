import {useAuthStore} from "@/stores/auth-store";

// Define the permission actions type
type PermissionAction = "create" | "read" | "update" | "delete";
type TActions = PermissionAction;

// Default values for permissions
const defaultValues = {
	READ: false,
	CREATE: false,
	UPDATE: false,
	DELETE: false,
};

// Main permission hook - accepts resource and actions array
export const usePermissions = (resource: string, actions: TActions[]) => {
	const canPerformAction = useAuthStore((state) => state.canPerformAction);

	// Create permission object based on defaultValues structure
	const result = {...defaultValues};

	// Map actions to defaultValues keys
	const actionMap = {
		read: "READ" as const,
		create: "CREATE" as const,
		update: "UPDATE" as const,
		delete: "DELETE" as const,
	};

	// Update permissions for requested actions
	actions.forEach((action) => {
		const key = actionMap[action];
		if (key) {
			result[key] = canPerformAction(resource, action);
		}
	});

	return {
		...result,
		// Helper method to check specific action
		can: (action: PermissionAction) => canPerformAction(resource, action),
	};
};
