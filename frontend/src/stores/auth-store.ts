"use client";

import {AuthService, type CurrentUser} from "@/services/auth";
import {create} from "zustand";
import {devtools} from "zustand/middleware";

// Use the CurrentUser type from auth service
export type AuthUser = CurrentUser;

// Auth store state
interface AuthState {
	// User state
	user: AuthUser | null;
	isLoading: boolean;

	// Auth actions
	logout: () => Promise<void>;
	getCurrentUser: () => Promise<void>;
	setUser: (user: AuthUser | null) => void;
	setLoading: (loading: boolean) => void;

	// Permission helper - only keep the one we actually use
	canPerformAction: (
		resource: string,
		action: "create" | "read" | "update" | "delete"
	) => boolean;
}

export const useAuthStore = create<AuthState>()(
	devtools(
		(set, get) => ({
			// Initial state
			user: null,
			isLoading: true,

			// Actions
			setUser: (user) => {
				set({user});
			},

			setLoading: (isLoading) => {
				set({isLoading});
			},

			// Fetch current user from /auth/me
			getCurrentUser: async () => {
				try {
					const token = getTokenFromStorage();
					if (!token) {
						set({isLoading: false, user: null});
						return;
					}

					const userData = await AuthService.getAuthMe();

					set({user: userData, isLoading: false});
				} catch {
					// Clear invalid token
					clearTokenFromStorage();
					set({user: null, isLoading: false});
				}
			},

			// Logout function using NextAuth
			logout: async () => {
				clearTokenFromStorage();
				set({user: null, isLoading: false});
			},

			canPerformAction: (resource, action) => {
				const state = get();
				const userPermissions = state?.user?.userPermissions || [];
				const permissionKey = `${resource.toLowerCase()}:${action}`;
				return userPermissions.includes(permissionKey);
			},
		}),
		{
			name: "auth-store",
		}
	)
);

// Selectors for performance optimization
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => !!state.user);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);

// Main permission selector
export const useCanPerformAction = (
	resource: string,
	action: "create" | "read" | "update" | "delete"
) => useAuthStore((state) => state.canPerformAction(resource, action));

// Token management helpers (only store tokens, not user data)
function getTokenFromStorage(): string | null {
	if (typeof window !== "undefined") {
		return localStorage.getItem("access_token");
	}
	return null;
}

function clearTokenFromStorage(): void {
	if (typeof window !== "undefined") {
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
	}
}
