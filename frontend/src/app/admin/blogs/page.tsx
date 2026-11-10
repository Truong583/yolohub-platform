"use client";

import AdminHeading from "@/components/admin/admin-heading";
import {ProtectedRoute} from "@/components/auth/protected-route";
import DataTableSkeleton from "@/components/table/data-table-skeleton";
import {Button} from "@/components/ui/button";
import {OPERATIONS, RESOURCES} from "@/configs/permission";
import {usePermissions} from "@/hooks/use-permissions";
import dynamic from "next/dynamic";
import {useState} from "react";
import {MdAdd} from "react-icons/md";

const BlogsTable = dynamic(() => import("./components/blogs-table"), {
	loading: () => <DataTableSkeleton />,
	ssr: false,
});

const BlogsActionDialog = dynamic(
	() => import("./components/blogs-action-dialog"),
	{
		ssr: false,
	}
);

const BlogsPage = () => {
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const {CREATE} = usePermissions(RESOURCES.BLOG, [OPERATIONS.CREATE]);

	const handleCreateClick = () => {
		setCreateDialogOpen(true);
	};

	return (
		<ProtectedRoute resource={RESOURCES.BLOG} action={OPERATIONS.READ}>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<AdminHeading
						title="Blogs"
						description="Manage blog posts and content"
					/>
					{CREATE && (
						<Button onClick={handleCreateClick}>
							<MdAdd className="mr-2 h-4 w-4" />
							Add Blog
						</Button>
					)}
				</div>

				<BlogsTable />

				{CREATE && createDialogOpen && (
					<BlogsActionDialog
						mode="create"
						open={createDialogOpen}
						onOpenChange={setCreateDialogOpen}
					/>
				)}
			</div>
		</ProtectedRoute>
	);
};

export default BlogsPage;
