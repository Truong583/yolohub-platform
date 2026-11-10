"use client";

import AlertDialogDestructive from "@/components/alert-dialog";
import {useBulkDeleteCategories} from "@/hooks/use-categories";
import {ICategory} from "@/types/category";
import {toast} from "sonner";

interface CategoriesBulkDeleteDialogProps {
	selectedCategories: ICategory[];
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
}

const CategoriesBulkDeleteDialog = ({
	selectedCategories,
	open,
	onOpenChange,
	onSuccess,
}: CategoriesBulkDeleteDialogProps) => {
	const bulkDeleteMutation = useBulkDeleteCategories();

	const handleBulkDelete = () => {
		const categoryIds = selectedCategories.map((category) => category._id);

		bulkDeleteMutation.mutate(categoryIds, {
			onSuccess: () => {
				toast.success(
					`${selectedCategories.length} categories deleted successfully!`
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

export default CategoriesBulkDeleteDialog;
