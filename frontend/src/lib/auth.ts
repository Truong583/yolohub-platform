// Re-export zustand auth store (new default)
export {useAuthStore} from "@/stores/auth-store";
export type {AuthUser} from "@/stores/auth-store";
export {
	useUser,
	useIsAuthenticated,
	useIsLoading,
	useCanPerformAction,
} from "@/stores/auth-store";

// Re-export permission hooks
export * from "@/hooks/use-permissions";

// Re-export auth guard and initializer
export {AuthGuard} from "@/components/auth/auth-guard";
export {AuthInitializer} from "@/components/auth/auth-initializer";

// Re-export new protected route components
export {
	ProtectedRoute,
	AdminProtectedRoute,
	SuperAdminProtectedRoute,
	UserProtectedRoute,
	AuthOnlyRoute,
} from "@/components/auth/protected-route";
