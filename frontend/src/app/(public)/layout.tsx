import dynamic from "next/dynamic";

// Dynamic imports - default arrow function components
const MainHeader = dynamic(() => import("@/components/layout/main-header"));
const MainFooter = dynamic(() => import("@/components/layout/main-footer"));

interface MainLayoutProps {
	children: React.ReactNode;
}

const MainLayout = ({children}: MainLayoutProps) => {
	return (
		<div className="min-h-screen flex flex-col">
			<MainHeader />
			<main className="flex-1">{children}</main>
			<MainFooter />
		</div>
	);
};

export default MainLayout;
