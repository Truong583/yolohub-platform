import {Button} from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useDeleteUser} from "@/hooks/use-users";
import {IUser} from "@/types/user";
import {DotsHorizontalIcon} from "@radix-ui/react-icons";
import {IconEdit, IconTrash} from "@tabler/icons-react";
import {Row} from "@tanstack/react-table";
import {useState} from "react";
import UsersActionDialog from "./users-action-dialog";

interface DataTableRowActionsProps {
	row: Row<IUser>;
}

const DataTableRowActions = ({row}: DataTableRowActionsProps) => {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const deleteUserMutation = useDeleteUser();

	const user = row.original;

	const handleDelete = async () => {
		await deleteUserMutation.mutateAsync(user._id);
		setDeleteDialogOpen(false);
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
					<DropdownMenuItem
						onClick={(e) => {
							e.preventDefault();
							setEditDialogOpen(true);
						}}
					>
						Edit
						<DropdownMenuShortcut>
							<IconEdit size={16} />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => setDeleteDialogOpen(true)}
						className="text-red-500!"
					>
						Delete
						<DropdownMenuShortcut>
							<IconTrash size={16} />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<UsersActionDialog
				user={user}
				open={editDialogOpen}
				onOpenChange={setEditDialogOpen}
			/>

			{deleteDialogOpen && (
				<div className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
					<div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
						<div className="flex flex-col space-y-2 text-center sm:text-left">
							<h2 className="text-lg font-semibold">Delete User</h2>
							<p className="text-sm text-muted-foreground">
								Are you sure you want to delete the user &quot;{user.username}
								&quot;? This action cannot be undone.
							</p>
						</div>
						<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
							<Button
								variant="outline"
								onClick={() => setDeleteDialogOpen(false)}
								disabled={deleteUserMutation.isPending}
							>
								Cancel
							</Button>
							<Button
								variant="destructive"
								onClick={handleDelete}
								disabled={deleteUserMutation.isPending}
							>
								{deleteUserMutation.isPending ? "Deleting..." : "Delete"}
							</Button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default DataTableRowActions;
