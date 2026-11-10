import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {formatPrice} from "@/utils/format";
import {OrderItem} from "./order-item";

interface OrderItemData {
	_id: string;
	title: string;
	thumbnail: string;
	price: number;
	oldPrice?: number;
}

interface OrderSummaryCardProps {
	code: string;
	items: OrderItemData[];
	subTotal: number;
	totalDiscount: number;
	totalAmount: number;
}

export function OrderSummaryCard({
	code,
	items,
	subTotal,
	totalDiscount,
	totalAmount,
}: OrderSummaryCardProps) {
	return (
		<Card>
			<CardHeader className="p-4 sm:p-6">
				<CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
				{/* Order Details */}
				<div className="space-y-2 sm:space-y-3">
					<div className="flex justify-between items-center">
						<span className="text-xs sm:text-sm text-gray-600">
							Order Code:
						</span>
						<span className="font-medium text-xs sm:text-sm truncate ml-2">
							#{code}
						</span>
					</div>
				</div>

				{/* Course Items */}
				<div className="space-y-3 sm:space-y-4">
					<h4 className="font-medium text-sm sm:text-base">Items:</h4>
					{items?.map((item, index) => (
						<OrderItem
							key={item._id || index}
							title={item.title}
							thumbnail={item.thumbnail}
							price={item.price}
							oldPrice={item.oldPrice}
						/>
					))}
				</div>

				{/* Pricing Breakdown */}
				<div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t">
					<div className="flex justify-between text-sm sm:text-base">
						<span>Subtotal:</span>
						<span>{formatPrice(subTotal)}</span>
					</div>
					{!!totalDiscount && totalDiscount > 0 && (
						<div className="flex justify-between text-green-600 text-sm sm:text-base">
							<span>Discount:</span>
							<span>-{formatPrice(totalDiscount)}</span>
						</div>
					)}
					<div className="flex justify-between text-base sm:text-lg font-bold border-t pt-2 sm:pt-3">
						<span>Total:</span>
						<span>{formatPrice(totalAmount)}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
