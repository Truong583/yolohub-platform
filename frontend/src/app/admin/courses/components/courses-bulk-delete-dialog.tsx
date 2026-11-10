"use client";

import AlertDialogDestructive from "@/components/alert-dialog";
import {useBulkDeleteCourses} from "@/hooks/use-courses";
import {ICourse} from "@/types/course";
import {toast} from "sonner";

interface CoursesBulkDeleteDialogProps {
	selectedCourses: ICourse[];
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
}

const CoursesBulkDeleteDialog = ({
	selectedCourses,
	open,
	onOpenChange,
	onSuccess,
}: CoursesBulkDeleteDialogProps) => {
	const bulkDeleteMutation = useBulkDeleteCourses();

	const handleBulkDelete = () => {
		const courseIds = selectedCourses.map((course) => course._id);

		bulkDeleteMutation.mutate(courseIds, {
			onSuccess: () => {
				toast.success(
					`${selectedCourses.length} courses deleted successfully!`
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

export default CoursesBulkDeleteDialog;
