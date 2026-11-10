"use client";

import {useAuthStore} from "@/stores/auth-store";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import Loader from "../loader";

interface AuthGuardProps {
	children: React.ReactNode;
	requireAuth?: boolean;
	resource?: string;
	action?: "create" | "read" | "update" | "delete";
	redirectTo?: string;
}

export function AuthGuard({
	children,
	requireAuth = true,
	resource,
	action,
	redirectTo = "/auth/sign-in",
}: AuthGuardProps) {
	const router = useRouter();
	const isAuthenticated = useAuthStore((state) => !!state.user);
	const isLoading = useAuthStore((state) => state.isLoading);
	const canPerformAction = useAuthStore((state) => state.canPerformAction);

	useEffect(() => {
		// Redirect to login if auth is required but user is not authenticated
		if (!isLoading && requireAuth && !isAuthenticated) {
			router.push(redirectTo);
			return;
		}

		// Redirect to admin if user is authenticated but auth is not required
		if (!isLoading && !requireAuth && isAuthenticated) {
			router.push("/admin");
			return;
		}
	}, [isLoading, requireAuth, isAuthenticated, router, redirectTo]);

	// Show loading while checking auth
	if (isLoading) {
		return <Loader />;
	}

	// Check authentication
	if (requireAuth && !isAuthenticated) {
		return null; // Will redirect via useEffect
	}

	if (!requireAuth && isAuthenticated) {
		return null; // Will redirect via useEffect
	}

	// Check resource-action permission if specified
	if (resource && action) {
		const hasPermission = canPerformAction(resource, action);
		if (!hasPermission) {
			router.push("/forbidden"); // User is authenticated but doesn't have resource permission
			return null;
		}
	}

	return <>{children}</>;
}
