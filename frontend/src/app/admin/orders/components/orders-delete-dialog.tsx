"use client";

import AlertDialogDestructive from "@/components/alert-dialog";
import {useDeleteAdminOrder} from "@/hooks/use-orders";
import {IOrder} from "@/types/order";

interface OrdersDeleteDialogProps {
	currentRow: IOrder; // Following categories pattern
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const OrdersDeleteDialog = ({
	currentRow,
	open,
	onOpenChange,
}: OrdersDeleteDialogProps) => {
	const deleteOrderMutation = useDeleteAdminOrder();

	const handleDelete = () => {
		deleteOrderMutation.mutate(currentRow._id);
	};

	return (
		<AlertDialogDestructive
			open={open}
			onOpenChange={onOpenChange}
			handleConfirm={handleDelete}
			disabled={deleteOrderMutation.isPending}
		/>
	);
};

export default OrdersDeleteDialog;
