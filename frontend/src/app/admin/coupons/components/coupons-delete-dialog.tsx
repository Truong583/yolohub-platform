"use client";

import AlertDialogDestructive from "@/components/alert-dialog";
import {useDeleteCoupon} from "@/hooks/use-coupons";
import {Coupon} from "@/types/coupon";

interface CouponsDeleteDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	currentRow: Coupon;
}

const CouponsDeleteDialog = ({
	open,
	onOpenChange,
	currentRow,
}: CouponsDeleteDialogProps) => {
	const deleteCouponMutation = useDeleteCoupon();

	const handleDelete = () => {
		deleteCouponMutation.mutate(currentRow._id);
	};

	return (
		<AlertDialogDestructive
			open={open}
			onOpenChange={onOpenChange}
			handleConfirm={handleDelete}
			disabled={deleteCouponMutation.isPending}
		/>
	);
};

export default CouponsDeleteDialog;
