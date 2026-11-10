"use client";

import AlertDialogDestructive from "@/components/alert-dialog";
import {useDeleteBlog} from "@/hooks/use-blogs";
import {IBlog} from "@/types/blog";

interface BlogsDeleteDialogProps {
	currentRow: IBlog; // Alternative prop name for compatibility
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const BlogsDeleteDialog = ({
	currentRow,
	open,
	onOpenChange,
}: BlogsDeleteDialogProps) => {
	const deleteBlogMutation = useDeleteBlog();

	const handleDelete = () => {
		deleteBlogMutation.mutate(currentRow?._id);
	};

	return (
		<AlertDialogDestructive
			open={open}
			onOpenChange={onOpenChange}
			handleConfirm={handleDelete}
			disabled={deleteBlogMutation.isPending}
		/>
	);
};

export default BlogsDeleteDialog;
