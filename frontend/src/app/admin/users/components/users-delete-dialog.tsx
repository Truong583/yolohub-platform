"use client";

import AlertDialogDestructive from "@/components/alert-dialog";
import {useDeleteUser} from "@/hooks/use-users";
import {IUser} from "@/types/user";

interface UsersDeleteDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	currentRow: IUser;
}

const UsersDeleteDialog = ({
	open,
	onOpenChange,
	currentRow,
}: UsersDeleteDialogProps) => {
	const deleteUserMutation = useDeleteUser();

	const handleDelete = () => {
		deleteUserMutation.mutate(currentRow._id);
	};

	return (
		<AlertDialogDestructive
			open={open}
			onOpenChange={onOpenChange}
			handleConfirm={handleDelete}
			disabled={deleteUserMutation.isPending}
		/>
	);
};

export default UsersDeleteDialog;
