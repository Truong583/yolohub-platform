"use client";

import AlertDialogDestructive from "@/components/alert-dialog";
import {useBulkDeleteBlogs} from "@/hooks/use-blogs";
import {IBlog} from "@/types/blog";
import {toast} from "sonner";

interface BlogsBulkDeleteDialogProps {
	selectedBlogs: IBlog[];
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
}

const BlogsBulkDeleteDialog = ({
	selectedBlogs,
	open,
	onOpenChange,
	onSuccess,
}: BlogsBulkDeleteDialogProps) => {
	const bulkDeleteMutation = useBulkDeleteBlogs();

	const handleBulkDelete = () => {
		const blogIds = selectedBlogs.map((blog) => blog._id);
		bulkDeleteMutation.mutate(blogIds, {
			onSuccess: () => {
				toast.success(`${selectedBlogs.length} blogs deleted successfully!`);
				onSuccess();
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

export default BlogsBulkDeleteDialog;
