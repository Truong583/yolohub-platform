"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {IOrder} from "@/types/order";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {formatDate, formatPrice} from "@/utils/format";
import {Calendar, CreditCard, Mail, Package, User} from "lucide-react";
import Image from "next/image";

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

// Payment method labels
const PAYMENT_METHOD_LABELS = {
	stripe: "Stripe",
	bank_transfer: "Chuyển khoản ngân hàng",
} as const;

interface OrderViewDialogProps {
	order: IOrder;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const OrderViewDialog = ({order, open, onOpenChange}: OrderViewDialogProps) => {
	const statusConfig = STATUS_CONFIG[order.status];

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-xl">Order #{order.code}</DialogTitle>
					<DialogDescription>
						View order details and customer information
					</DialogDescription>
				</DialogHeader>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Order Information */}
					<div className="lg:col-span-2 space-y-4">
						{/* Order Summary */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Package className="h-5 w-5" />
									Order Summary
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div>
											<p className="font-medium">Status</p>
											<Badge className={statusConfig.className}>
												{statusConfig.label}
											</Badge>
										</div>
									</div>
									<div className="text-right">
										<p className="text-sm text-muted-foreground">
											Total Amount
										</p>
										<p className="text-xl font-bold text-green-600">
											{formatPrice(order.totalAmount)}
										</p>
									</div>
								</div>

								<Separator />

								<div className="grid grid-cols-2 gap-4">
									<div className="flex items-center gap-2">
										<Calendar className="h-4 w-4 text-muted-foreground" />
										<div>
											<p className="text-sm text-muted-foreground">Created</p>
											<p className="font-medium">
												{formatDate(order.createdAt)}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<CreditCard className="h-4 w-4 text-muted-foreground" />
										<div>
											<p className="text-sm text-muted-foreground">
												Payment Method
											</p>
											<p className="font-medium">
												{PAYMENT_METHOD_LABELS[order.paymentMethod]}
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Order Items */}
						<Card>
							<CardHeader>
								<CardTitle>Order Items ({order.items.length})</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{order.items.map((item) => (
										<div
											key={item._id}
											className="flex items-center gap-3 p-3 border rounded-lg"
										>
											<div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
												<Image
													src={
														item.thumbnail || "/images/course-placeholder.jpg"
													}
													alt={item.title}
													fill
													className="object-cover"
												/>
											</div>
											<div className="flex-1 min-w-0">
												<h4 className="font-medium text-gray-900 text-sm">
													{item.title}
												</h4>
												<p className="text-xs text-muted-foreground">
													Course ID: {item.courseId}
												</p>
											</div>
											<div className="text-right">
												<p className="font-semibold text-sm">
													{formatPrice(item.price)}
												</p>
											</div>
										</div>
									))}
								</div>

								<Separator className="my-4" />

								{/* Order Totals */}
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span>Subtotal:</span>
										<span>{formatPrice(order.subTotal)}</span>
									</div>
									{order.totalDiscount > 0 && (
										<div className="flex justify-between text-sm text-emerald-600">
											<span>Discount:</span>
											<span>-{formatPrice(order.totalDiscount)}</span>
										</div>
									)}
									<Separator />
									<div className="flex justify-between font-medium">
										<span>Total:</span>
										<span className="text-green-600">
											{formatPrice(order.totalAmount)}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Customer Information */}
					<div className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<User className="h-5 w-5" />
									Customer Information
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="text-center">
									<Avatar className="w-12 h-12 mx-auto mb-3">
										<AvatarImage
											src={order.user?.avatar}
											alt={order.user?.username}
										/>
										<AvatarFallback>
											<User className="h-6 w-6" />
										</AvatarFallback>
									</Avatar>
									<p className="font-medium">{order.user?.username}</p>
									<p className="text-sm text-muted-foreground">Customer</p>
								</div>

								<Separator />

								<div className="space-y-3 text-sm">
									<div className="flex items-center gap-2">
										<Mail className="h-4 w-4 text-muted-foreground" />
										<span>{order.user?.email || "Email not available"}</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default OrderViewDialog;
