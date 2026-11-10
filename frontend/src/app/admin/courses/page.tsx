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
const CoursesTable = dynamic(() => import("./components/courses-table"), {
	loading: () => <DataTableSkeleton />,
	ssr: false,
});

const CoursesActionDialog = dynamic(
	() => import("./components/courses-action-dialog"),
	{
		ssr: false,
	}
);

const CoursesPage = () => {
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const {CREATE} = usePermissions(RESOURCES.COURSE, [OPERATIONS.CREATE]);

	const handleCreateClick = () => {
		setCreateDialogOpen(true);
	};

	return (
		<ProtectedRoute resource={RESOURCES.COURSE} action={OPERATIONS.READ}>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<AdminHeading
						title="Courses"
						description="Manage courses and course content"
					/>
					{CREATE && (
						<Button onClick={handleCreateClick}>
							<MdAdd className="mr-2 h-4 w-4" />
							Add Course
						</Button>
					)}
				</div>

				<CoursesTable />

				{CREATE && createDialogOpen && (
					<CoursesActionDialog
						mode="create"
						open={createDialogOpen}
						onOpenChange={setCreateDialogOpen}
					/>
				)}
			</div>
		</ProtectedRoute>
	);
};

export default CoursesPage;
