"use client";

import AlertDialogDestructive from "@/components/alert-dialog";
import {useBulkDeleteAdminOrders} from "@/hooks/use-orders";
import {toast} from "sonner";

interface OrdersBulkDeleteDialogProps {
	selectedOrders: string[]; // Following the current pattern with order IDs
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
}

const OrdersBulkDeleteDialog = ({
	selectedOrders,
	open,
	onOpenChange,
	onSuccess,
}: OrdersBulkDeleteDialogProps) => {
	const bulkDeleteMutation = useBulkDeleteAdminOrders();

	const handleBulkDelete = () => {
		bulkDeleteMutation.mutate(selectedOrders, {
			onSuccess: () => {
				toast.success(
					`Successfully deleted ${selectedOrders.length} order${
						selectedOrders.length === 1 ? "" : "s"
					}`
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

export default OrdersBulkDeleteDialog;
