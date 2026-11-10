"use client";

import {useState} from "react";
import {DotsHorizontalIcon} from "@radix-ui/react-icons";
import {Row} from "@tanstack/react-table";
import {IconEdit, IconTrash, IconCopy} from "@tabler/icons-react";
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
import {Coupon} from "@/types/coupon";
import CouponsActionDialog from "./coupons-action-dialog";
import CouponsDeleteDialog from "./coupons-delete-dialog";
import {toast} from "sonner";

interface DataTableRowActionsProps {
	row: Row<Coupon>;
}

const DataTableRowActions = ({row}: DataTableRowActionsProps) => {
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const {UPDATE, DELETE} = usePermissions(RESOURCES.COUPON, [
		OPERATIONS.UPDATE,
		OPERATIONS.DELETE,
	]);

	const coupon = row.original;

	const handleEditClick = () => {
		setEditDialogOpen(true);
	};

	const handleDeleteClick = () => {
		setDeleteDialogOpen(true);
	};

	const handleCopyCode = async () => {
		try {
			await navigator.clipboard.writeText(coupon.code);
			toast.success(`Coupon code "${coupon.code}" copied to clipboard!`);
		} catch (error) {
			console.error("Failed to copy coupon code:", error);
			toast.error("Failed to copy coupon code");
		}
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
					<DropdownMenuItem onClick={handleCopyCode}>
						Copy Code
						<DropdownMenuShortcut>
							<IconCopy size={16} />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
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
				<CouponsActionDialog
					mode="edit"
					coupon={coupon}
					open={editDialogOpen}
					onOpenChange={setEditDialogOpen}
				/>
			)}

			{/* Delete Dialog - Only render when DELETE permission and dialog is open */}
			{DELETE && deleteDialogOpen && (
				<CouponsDeleteDialog
					open={deleteDialogOpen}
					onOpenChange={setDeleteDialogOpen}
					currentRow={coupon}
				/>
			)}
		</>
	);
};

export default DataTableRowActions;
