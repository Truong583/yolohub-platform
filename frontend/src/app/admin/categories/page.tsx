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

const CategoriesTable = dynamic(() => import("./components/categories-table"), {
	loading: () => <DataTableSkeleton />,
	ssr: false,
});

const CategoriesActionDialog = dynamic(
	() => import("./components/categories-action-dialog"),
	{
		ssr: false,
	}
);

const CategoriesPage = () => {
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const {CREATE} = usePermissions(RESOURCES.CATEGORY, [OPERATIONS.CREATE]);

	const handleCreateClick = () => {
		setCreateDialogOpen(true);
	};

	return (
		<ProtectedRoute resource={RESOURCES.CATEGORY} action={OPERATIONS.READ}>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<AdminHeading
						title="Categories"
						description="Manage course categories and organization"
					/>
					{CREATE && (
						<Button onClick={handleCreateClick}>
							<MdAdd className="mr-2 h-4 w-4" />
							Add Category
						</Button>
					)}
				</div>

				<CategoriesTable />

				{CREATE && createDialogOpen && (
					<CategoriesActionDialog
						mode="create"
						open={createDialogOpen}
						onOpenChange={setCreateDialogOpen}
					/>
				)}
			</div>
		</ProtectedRoute>
	);
};

export default CategoriesPage;
