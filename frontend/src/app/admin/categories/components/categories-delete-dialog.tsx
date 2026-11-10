"use client";

import AlertDialogDestructive from "@/components/alert-dialog";
import {useDeleteCategory} from "@/hooks/use-categories";
import {ICategory} from "@/types/category";

interface CategoriesDeleteDialogProps {
	currentRow: ICategory; // Alternative prop name for compatibility
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const CategoriesDeleteDialog = ({
	currentRow,
	open,
	onOpenChange,
}: CategoriesDeleteDialogProps) => {
	const deleteCategoryMutation = useDeleteCategory();

	const handleDelete = () => {
		deleteCategoryMutation.mutate(currentRow?._id);
	};

	return (
		<AlertDialogDestructive
			open={open}
			onOpenChange={onOpenChange}
			handleConfirm={handleDelete}
			disabled={deleteCategoryMutation.isPending}
		/>
	);
};

export default CategoriesDeleteDialog;
