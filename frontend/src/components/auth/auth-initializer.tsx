"use client";

import {useAuthStore} from "@/stores/auth-store";
import {useEffect} from "react";

interface AuthInitializerProps {
	children: React.ReactNode;
}

export function AuthInitializer({children}: AuthInitializerProps) {
	const {getCurrentUser} = useAuthStore();

	useEffect(() => {
		getCurrentUser();
	}, [getCurrentUser]);

	return <>{children}</>;
}
