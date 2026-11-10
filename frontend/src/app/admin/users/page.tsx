"use client";

import dynamic from "next/dynamic";
import {ProtectedRoute} from "@/components/auth/protected-route";
import {RESOURCES, OPERATIONS} from "@/configs/permission";
import AdminHeading from "@/components/admin/admin-heading";
import DataTableSkeleton from "@/components/table/data-table-skeleton";

const UsersTable = dynamic(() => import("./components/users-table"), {
	loading: () => <DataTableSkeleton />,
	ssr: false,
});

const UsersPage = () => {
	return (
		<ProtectedRoute resource={RESOURCES.USER} action={OPERATIONS.READ}>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<AdminHeading
						title="Users"
						description="Manage user accounts and status"
					/>
				</div>

				<UsersTable />
			</div>
		</ProtectedRoute>
	);
};

export default UsersPage;
