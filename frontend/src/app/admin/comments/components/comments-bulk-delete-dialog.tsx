"use client";

import AlertDialogDestructive from "@/components/alert-dialog";
import {useBulkDeleteComments} from "@/hooks/use-comments";
import {IComment} from "@/types/comment";
import {toast} from "sonner";

interface CommentsBulkDeleteDialogProps {
	selectedComments: IComment[];
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
}

const CommentsBulkDeleteDialog = ({
	selectedComments,
	open,
	onOpenChange,
	onSuccess,
}: CommentsBulkDeleteDialogProps) => {
	const bulkDeleteMutation = useBulkDeleteComments();

	const handleBulkDelete = () => {
		const commentIds = selectedComments.map((comment) => comment._id);

		bulkDeleteMutation.mutate(commentIds, {
			onSuccess: () => {
				toast.success(
					`${selectedComments.length} comments deleted successfully!`
				);
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

export default CommentsBulkDeleteDialog;
