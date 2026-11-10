"use client";

import AlertDialogDestructive from "@/components/alert-dialog";
import {useBulkDeleteUsers} from "@/hooks/use-users";
import {IUser} from "@/types/user";
import {toast} from "sonner";

interface UsersBulkDeleteDialogProps {
	selectedUsers: IUser[];
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
}

const UsersBulkDeleteDialog = ({
	selectedUsers,
	open,
	onOpenChange,
	onSuccess,
}: UsersBulkDeleteDialogProps) => {
	const bulkDeleteMutation = useBulkDeleteUsers();

	const handleBulkDelete = () => {
		const userIds = selectedUsers.map((user) => user._id);

		bulkDeleteMutation.mutate(userIds, {
			onSuccess: () => {
				toast.success(`${selectedUsers.length} users deleted successfully!`);
				onSuccess?.();
			},
		});
	};

	return (
		<AlertDialogDestructive
			open={open}
			onOpenChange={onOpenChange}
			handleConfirm={handleBulkDelete}
			disabled={bulkDeleteMutation.isPending}
		/>
	);
};

export default UsersBulkDeleteDialog;
