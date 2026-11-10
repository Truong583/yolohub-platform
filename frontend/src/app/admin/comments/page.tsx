"use client";

import dynamic from "next/dynamic";
import {ProtectedRoute} from "@/components/auth/protected-route";
import {RESOURCES, OPERATIONS} from "@/configs/permission";
import AdminHeading from "@/components/admin/admin-heading";
import DataTableSkeleton from "@/components/table/data-table-skeleton";

const CommentsTable = dynamic(() => import("./components/comments-table"), {
	loading: () => <DataTableSkeleton />,
	ssr: false,
});

const CommentsPage = () => {
	return (
		<ProtectedRoute resource={RESOURCES.COMMENT} action={OPERATIONS.READ}>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<AdminHeading
						title="Comments"
						description="Manage user comments and moderation"
					/>
				</div>

				<CommentsTable />
			</div>
		</ProtectedRoute>
	);
};

export default CommentsPage;
