"use client";

import {useState} from "react";
import {DotsHorizontalIcon} from "@radix-ui/react-icons";
import {Row} from "@tanstack/react-table";
import {IconEdit, IconTrash} from "@tabler/icons-react";
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
import {ICategory} from "@/types/category";
import CategoriesActionDialog from "./categories-action-dialog";
import CategoriesDeleteDialog from "./categories-delete-dialog";

interface DataTableRowActionsProps {
	row: Row<ICategory>;
}

const DataTableRowActions = ({row}: DataTableRowActionsProps) => {
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const {UPDATE, DELETE} = usePermissions(RESOURCES.CATEGORY, [
		OPERATIONS.UPDATE,
		OPERATIONS.DELETE,
	]);

	const category = row.original;

	const handleEditClick = () => {
		setEditDialogOpen(true);
	};

	const handleDeleteClick = () => {
		setDeleteDialogOpen(true);
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
				<CategoriesActionDialog
					mode="edit"
					category={category}
					open={editDialogOpen}
					onOpenChange={setEditDialogOpen}
				/>
			)}

			{/* Delete Dialog - Only render when DELETE permission and dialog is open */}
			{DELETE && deleteDialogOpen && (
				<CategoriesDeleteDialog
					open={deleteDialogOpen}
					onOpenChange={setDeleteDialogOpen}
					currentRow={category}
				/>
			)}
		</>
	);
};

export default DataTableRowActions;
