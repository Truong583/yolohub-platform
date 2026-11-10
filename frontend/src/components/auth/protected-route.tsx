"use client";

import {useAuthStore} from "@/stores/auth-store";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useMemo, useCallback, Suspense} from "react";
import {SYSTEM_ROLE_NAMES} from "@/configs/permission";
import Loader from "../loader";

interface ProtectedRouteProps {
	children: React.ReactNode;
	requireAuth?: boolean;
	allowedRoles?: string[];
	resource?: string;
	action?: "create" | "read" | "update" | "delete";
	redirectTo?: string;
	fallback?: React.ReactNode;
}

// Internal component that uses useSearchParams safely
function ProtectedRouteInner({
	children,
	requireAuth = true,
	allowedRoles,
	resource,
	action,
	redirectTo,
	fallback,
}: ProtectedRouteProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const {user, isLoading, canPerformAction} = useAuthStore();

	const isAuthenticated = !!user;

	// Reusable loading component with fallback
	const loadingComponent = fallback || <Loader />;

	const userRoles = useMemo(
		() => user?.roles?.map((role) => role.name) || [],
		[user?.roles]
	);

	// Helper function to get the highest priority role for redirects
	const getPrimaryRole = useCallback(() => {
		if (userRoles.includes(SYSTEM_ROLE_NAMES.SUPER_ADMIN))
			return SYSTEM_ROLE_NAMES.SUPER_ADMIN;
		if (userRoles.includes(SYSTEM_ROLE_NAMES.ADMIN))
			return SYSTEM_ROLE_NAMES.ADMIN;
		return userRoles[0]; // fallback to first role
	}, [userRoles]);

	// Helper function to check if user has any of the allowed roles
	const hasAllowedRole = useCallback(
		(allowedRoles: string[]) => {
			return allowedRoles.some((role) => userRoles.includes(role));
		},
		[userRoles]
	);

	useEffect(() => {
		// Don't redirect while loading
		if (isLoading) return;

		// Handle unauthenticated users on protected routes
		if (requireAuth && !isAuthenticated) {
			const callbackUrl = window.location.pathname + window.location.search;
			const signInUrl = `/auth/sign-in?callbackUrl=${encodeURIComponent(
				callbackUrl
			)}`;
			router.push(redirectTo || signInUrl);
			return;
		}

		// Handle authenticated users on auth-only routes (like sign-in)
		if (!requireAuth && isAuthenticated) {
			const callbackUrl = searchParams.get("callbackUrl");
			const primaryRole = getPrimaryRole();

			// Redirect based on user role
			if (
				primaryRole === SYSTEM_ROLE_NAMES.SUPER_ADMIN ||
				primaryRole === SYSTEM_ROLE_NAMES.ADMIN
			) {
				router.push(callbackUrl || "/admin/dashboard");
			} else {
				router.push(callbackUrl || "/");
			}
			return;
		}

		// Check role-based access
		if (
			requireAuth &&
			isAuthenticated &&
			allowedRoles &&
			allowedRoles.length > 0
		) {
			if (!hasAllowedRole(allowedRoles)) {
				router.push("/forbidden"); // User is authenticated but doesn't have required role
				return;
			}
		}
	}, [
		isLoading,
		requireAuth,
		isAuthenticated,
		userRoles,
		allowedRoles,
		router,
		redirectTo,
		searchParams,
		getPrimaryRole,
		hasAllowedRole,
	]);

	// Show loading state for various scenarios
	if (
		isLoading ||
		(requireAuth && !isAuthenticated) ||
		(!requireAuth && isAuthenticated)
	) {
		return loadingComponent; // Show loader while loading or redirecting
	}
	// Check role and resource permissions - redirect to forbidden if unauthorized
	const hasRoleAccess = !allowedRoles?.length || hasAllowedRole(allowedRoles);
	const hasResourceAccess =
		!resource || !action || canPerformAction(resource, action);

	if (
		requireAuth &&
		isAuthenticated &&
		(!hasRoleAccess || !hasResourceAccess)
	) {
		router.push("/forbidden"); // User is authenticated but lacks permissions
		return loadingComponent; // Show loader while redirecting
	}

	return <>{children}</>;
}

// Main ProtectedRoute component with Suspense boundary
export function ProtectedRoute(props: ProtectedRouteProps) {
	return (
		<Suspense fallback={props.fallback || <Loader />}>
			<ProtectedRouteInner {...props} />
		</Suspense>
	);
}

// Convenience components for common protection patterns
export function AdminProtectedRoute({
	children,
	...props
}: Omit<ProtectedRouteProps, "allowedRoles">) {
	return (
		<ProtectedRoute
			{...props}
			allowedRoles={[SYSTEM_ROLE_NAMES.SUPER_ADMIN, SYSTEM_ROLE_NAMES.ADMIN]}
		>
			{children}
		</ProtectedRoute>
	);
}

export function SuperAdminProtectedRoute({
	children,
	...props
}: Omit<ProtectedRouteProps, "allowedRoles">) {
	return (
		<ProtectedRoute {...props} allowedRoles={[SYSTEM_ROLE_NAMES.SUPER_ADMIN]}>
			{children}
		</ProtectedRoute>
	);
}

export function UserProtectedRoute({
	children,
	...props
}: Omit<ProtectedRouteProps, "allowedRoles">) {
	return <ProtectedRoute {...props}>{children}</ProtectedRoute>;
}

export function AuthOnlyRoute({
	children,
	...props
}: Omit<ProtectedRouteProps, "requireAuth">) {
	return (
		<ProtectedRoute {...props} requireAuth={false}>
			{children}
		</ProtectedRoute>
	);
}
