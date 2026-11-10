"use client";

import AlertDialogDestructive from "@/components/alert-dialog";
import {useBulkDeleteCoupons} from "@/hooks/use-coupons";
import {Coupon} from "@/types/coupon";
import {toast} from "sonner";

interface CouponsBulkDeleteDialogProps {
	selectedCoupons: Coupon[];
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
}

const CouponsBulkDeleteDialog = ({
	selectedCoupons,
	open,
	onOpenChange,
	onSuccess,
}: CouponsBulkDeleteDialogProps) => {
	const bulkDeleteCouponsMutation = useBulkDeleteCoupons();

	const handleBulkDelete = () => {
		const couponIds = selectedCoupons.map((coupon) => coupon._id);

		bulkDeleteCouponsMutation.mutate(couponIds, {
			onSuccess: () => {
				toast.success(
					`${selectedCoupons.length} coupon${
						selectedCoupons.length === 1 ? "" : "s"
					} deleted successfully.`
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
			disabled={bulkDeleteCouponsMutation.isPending}
		/>
	);
};

export default CouponsBulkDeleteDialog;
