import dynamic from "next/dynamic";
import {UserProtectedRoute} from "@/components/auth/protected-route";

// Dynamic imports - default arrow function components
const MainHeader = dynamic(() => import("@/components/layout/main-header"));
const MainFooter = dynamic(() => import("@/components/layout/main-footer"));

interface ProtectedMainLayoutProps {
	children: React.ReactNode;
	requireAuth?: boolean;
	fallback?: React.ReactNode;
}

export function ProtectedMainLayout({
	children,
	requireAuth = true,
	...props
}: ProtectedMainLayoutProps) {
	const ProtectionComponent = requireAuth ? UserProtectedRoute : "div";

	return (
		<ProtectionComponent {...props}>
			<div className="min-h-screen flex flex-col">
				<MainHeader />
				<main className="flex-1">{children}</main>
				<MainFooter />
			</div>
		</ProtectionComponent>
	);
}
