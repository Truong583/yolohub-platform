"use client";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {useUpdateOrderStatus} from "@/hooks/use-orders";
import {IOrder} from "@/types/order";
import {Loader2} from "lucide-react";
import {useState} from "react";

// Status configuration
const STATUS_CONFIG = {
	pending: {
		label: "Chờ thanh toán",
		className: "bg-amber-50 text-amber-700 border-amber-200",
		variant: "secondary" as const,
	},
	completed: {
		label: "Hoàn thành",
		className: "bg-emerald-50 text-emerald-700 border-emerald-200",
		variant: "default" as const,
	},
	cancelled: {
		label: "Đã hủy",
		className: "bg-red-50 text-red-700 border-red-200",
		variant: "destructive" as const,
	},
};

interface OrderStatusDialogProps {
	order: IOrder;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const OrderStatusDialog = ({
	order,
	open,
	onOpenChange,
}: OrderStatusDialogProps) => {
	const [selectedStatus, setSelectedStatus] = useState<string>(order.status);

	// Use the mutation hook for updating order status
	const {mutate: updateOrderStatus, isPending} = useUpdateOrderStatus();

	const currentStatusConfig = STATUS_CONFIG[order.status];
	const newStatusConfig =
		STATUS_CONFIG[selectedStatus as keyof typeof STATUS_CONFIG];

	const handleUpdateStatus = () => {
		if (selectedStatus === order.status) {
			onOpenChange(false);
			return;
		}

		updateOrderStatus(
			{
				orderId: order._id,
				status: selectedStatus,
			},
			{
				onSuccess: () => {
					onOpenChange(false);
				},
			}
		);
	};

	const handleClose = () => {
		if (!isPending) {
			setSelectedStatus(order.status); // Reset to original status
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Update Order Status</DialogTitle>
					<DialogDescription>
						Change the status for order #{order.code}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* Current Status */}
					<div>
						<label className="text-sm font-medium text-muted-foreground">
							Current Status
						</label>
						<div className="mt-1">
							<Badge className={currentStatusConfig.className}>
								{currentStatusConfig.label}
							</Badge>
						</div>
					</div>

					{/* New Status */}
					<div>
						<label className="text-sm font-medium text-muted-foreground">
							New Status
						</label>
						<Select
							value={selectedStatus}
							onValueChange={setSelectedStatus}
							disabled={isPending}
						>
							<SelectTrigger className="mt-1 w-full">
								<SelectValue placeholder="Select new status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="pending">
									<div className="flex items-center gap-2">
										<span>⏳</span>
										<span>Chờ thanh toán</span>
									</div>
								</SelectItem>
								<SelectItem value="completed">
									<div className="flex items-center gap-2">
										<span>✅</span>
										<span>Hoàn thành</span>
									</div>
								</SelectItem>
								<SelectItem value="cancelled">
									<div className="flex items-center gap-2">
										<span>❌</span>
										<span>Đã hủy</span>
									</div>
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Preview */}
					{selectedStatus !== order.status && (
						<div className="p-3 bg-muted rounded-lg">
							<p className="text-sm text-muted-foreground mb-2">Preview:</p>
							<div className="flex items-center gap-2">
								<span className="text-sm">Status will change to:</span>
								<Badge className={newStatusConfig.className}>
									{newStatusConfig.label}
								</Badge>
							</div>
						</div>
					)}
				</div>

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={handleClose}
						disabled={isPending}
					>
						Cancel
					</Button>
					<Button
						onClick={handleUpdateStatus}
						disabled={isPending || selectedStatus === order.status}
					>
						{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Update Status
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default OrderStatusDialog;
