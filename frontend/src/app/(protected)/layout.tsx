"use client";
import {ProtectedMainLayout} from "@/components/layout/protected-main-layout";
import {UserProtectedRoute} from "@/lib/auth";
import {usePathname} from "next/navigation";

interface MainLayoutProps {
	children: React.ReactNode;
}

const MainLayout = ({children}: MainLayoutProps) => {
	const pathname = usePathname();

	if (pathname.includes("/learning")) {
		return <UserProtectedRoute>{children} </UserProtectedRoute>;
	}
	return <ProtectedMainLayout>{children}</ProtectedMainLayout>;
};

export default MainLayout;
