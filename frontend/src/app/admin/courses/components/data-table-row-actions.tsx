"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {DotsHorizontalIcon} from "@radix-ui/react-icons";
import {Row} from "@tanstack/react-table";
import {IconEdit, IconTrash, IconList} from "@tabler/icons-react";
import {Button} from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {usePermissions} from "@/hooks/use-permissions";
import {RESOURCES, OPERATIONS} from "@/configs/permission";
import {ICourse} from "@/types/course";
import CoursesActionDialog from "./courses-action-dialog";
import CoursesDeleteDialog from "./courses-delete-dialog";

interface DataTableRowActionsProps {
	row: Row<ICourse>;
}

const DataTableRowActions = ({row}: DataTableRowActionsProps) => {
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const router = useRouter();

	const {UPDATE, DELETE} = usePermissions(RESOURCES.COURSE, [
		OPERATIONS.UPDATE,
		OPERATIONS.DELETE,
	]);

	const course = row.original;

	const handleEditClick = () => {
		setEditDialogOpen(true);
	};

	const handleDeleteClick = () => {
		setDeleteDialogOpen(true);
	};

	const handleOutlineClick = () => {
		router.push(`/admin/courses/${course._id}/outline`);
	};

	return (
		<>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
					>
						<DotsHorizontalIcon className="h-4 w-4" />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-[160px]">
					{UPDATE && (
						<DropdownMenuItem onClick={handleOutlineClick}>
							Outline
							<DropdownMenuShortcut>
								<IconList size={16} />
							</DropdownMenuShortcut>
						</DropdownMenuItem>
					)}
					{UPDATE && (
						<DropdownMenuItem onClick={handleEditClick}>
							Edit
							<DropdownMenuShortcut>
								<IconEdit size={16} />
							</DropdownMenuShortcut>
						</DropdownMenuItem>
					)}
					{(UPDATE || DELETE) && <DropdownMenuSeparator />}
					{DELETE && (
						<DropdownMenuItem
							onClick={handleDeleteClick}
							className="text-red-500!"
						>
							Delete
							<DropdownMenuShortcut>
								<IconTrash size={16} />
							</DropdownMenuShortcut>
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Edit Dialog - Only render when UPDATE permission and dialog is open */}
			{UPDATE && editDialogOpen && (
				<CoursesActionDialog
					mode="edit"
					course={course}
					open={editDialogOpen}
					onOpenChange={setEditDialogOpen}
				/>
			)}

			{/* Delete Dialog - Only render when DELETE permission and dialog is open */}
			{DELETE && deleteDialogOpen && (
				<CoursesDeleteDialog
					open={deleteDialogOpen}
					onOpenChange={setDeleteDialogOpen}
					currentRow={course}
				/>
			)}
		</>
	);
};

export default DataTableRowActions;
