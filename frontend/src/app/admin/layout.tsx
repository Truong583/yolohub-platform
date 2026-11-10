import {AdminLayout} from "@/components/layout/admin-layout";
import {AdminProtectedRoute} from "@/lib/auth";

const Layout = ({children}: {children: React.ReactNode}) => {
	return (
		<AdminProtectedRoute>
			<AdminLayout>{children}</AdminLayout>
		</AdminProtectedRoute>
	);
};

export default Layout;
