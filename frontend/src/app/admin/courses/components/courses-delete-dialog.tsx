"use client";

import AlertDialogDestructive from "@/components/alert-dialog";
import {useDeleteCourse} from "@/hooks/use-courses";
import {ICourse} from "@/types/course";

interface CoursesDeleteDialogProps {
	currentRow: ICourse;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const CoursesDeleteDialog = ({
	currentRow,
	open,
	onOpenChange,
}: CoursesDeleteDialogProps) => {
	const deleteCourse = useDeleteCourse();

	const handleDelete = () => {
		deleteCourse.mutate(currentRow._id);
	};

	return (
		<AlertDialogDestructive
			open={open}
			onOpenChange={onOpenChange}
			handleConfirm={handleDelete}
			disabled={deleteCourse.isPending}
		/>
	);
};

export default CoursesDeleteDialog;
