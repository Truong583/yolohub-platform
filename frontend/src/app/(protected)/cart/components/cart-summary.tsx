"use client";

import {Card, CardContent} from "@/components/ui/card";
import {Sheet, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {CreditCard, Banknote} from "lucide-react";
import {useCreateOrder} from "@/hooks/use-orders";
import {useActiveCoupons, useValidateCoupon} from "@/hooks/use-coupons";
import type {Cart, OrderDiscount} from "@/types/cart";
import type {CreateOrderRequest} from "@/types/order";
import type {ValidateCouponResponse} from "@/types/coupon";
import CartTotals from "./cart-totals";
import CheckoutActions from "./checkout-actions";
import DiscountDrawer from "./discount-drawer";
import DiscountTrigger from "./discount-trigger";

import {useMemo, useState} from "react";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {ROUTE_CONFIG} from "@/configs/routes";

const calculateDiscountAmount = (
	coupon: {
		discountType: string;
		discountValue: number;
		courseIds: Array<{
			_id: string;
			title: string;
			price?: number;
		}>;
	},
	cartItems: Array<{
		courseId: {_id: string};
		price: number;
	}>,
	applicableCourses: Array<{
		_id: string;
		title: string;
		price: number;
	}>
): number => {
	let baseAmount = 0;

	// If courseIds is empty or undefined, apply to entire cart
	if (!coupon.courseIds || coupon.courseIds.length === 0) {
		baseAmount = cartItems.reduce((sum, item) => sum + item.price, 0);
	} else {
		// Apply discount only to specific courses that match the coupon
		const applicableCourseIds = applicableCourses.map((course) => course._id);

		baseAmount = cartItems
			.filter((item) => applicableCourseIds.includes(item.courseId._id))
			.reduce((sum, item) => sum + item.price, 0);
	}

	// Calculate discount based on type
	if (coupon.discountType === "fixed") {
		// For fixed discount, return the fixed value but don't exceed the base amount
		return Math.min(coupon.discountValue, baseAmount);
	} else if (coupon.discountType === "percent") {
		// For percentage discount, calculate percentage of base amount
		return (baseAmount * coupon.discountValue) / 100;
	}

	return 0;
};

interface CartSummaryProps {
	cart: Cart;
}

// Cart summary component - Arrow function
const CartSummary = ({cart}: CartSummaryProps) => {
	const [selectedDiscountCode, setSelectedDiscountCode] = useState<string>("");
	const [manualDiscountCode, setManualDiscountCode] = useState<string>("");
	const [appliedDiscount, setAppliedDiscount] = useState<OrderDiscount | null>(
		null
	);
	const [applyingCouponCode, setApplyingCouponCode] = useState<string>("");
	const [selectedPaymentMethod, setSelectedPaymentMethod] =
		useState<CreateOrderRequest["paymentMethod"]>("stripe");
	const router = useRouter();

	const checkout = useCreateOrder();

	// Fetch active coupons from API
	const {data: couponsData, isLoading: isCouponsLoading} = useActiveCoupons();

	const validateCoupon = useValidateCoupon();

	const summary = useMemo(() => {
		const subtotal = cart.items.reduce((sum, item) => sum + item.price, 0);
		const discountAmount = appliedDiscount?.discountAmount || 0;
		const total = subtotal - discountAmount;
		const itemCount = cart.items.length;

		return {
			subtotal,
			discountAmount,
			total,
			itemCount,
		};
	}, [cart, appliedDiscount]);

	const applyDiscountCode = (code: string) => {
		if (!code.trim()) return;

		setApplyingCouponCode(code.trim());

		// Validate coupon through API
		validateCoupon.mutate(
			{
				code: code.trim(),
				courseIds: cart.items.map((item) => item.courseId._id),
			},
			{
				onSuccess: (response: ValidateCouponResponse) => {
					const coupon = response;

					// Calculate discount amount based on coupon type and courseIds
					const discountAmount = calculateDiscountAmount(
						{
							discountType: coupon.discountType,
							discountValue: coupon.discountValue,
							courseIds: coupon.courseIds,
						},
						cart.items,
						coupon.courseIds
					);

					// Apply discount
					setAppliedDiscount({
						code: coupon.code,
						discountAmount,
						appliedSuccessfully: true,
					});
					setSelectedDiscountCode(coupon.code);
					setManualDiscountCode("");
					setApplyingCouponCode("");
				},
				onError: () => {
					setApplyingCouponCode("");
				},
			}
		);
	};

	const removeDiscount = () => {
		setAppliedDiscount(null);
		setSelectedDiscountCode("");
		setManualDiscountCode("");
		setApplyingCouponCode("");
		toast.success("Discount code removed");
	};

	const handleCheckout = () => {
		checkout.mutate(
			{
				courseIds: cart.items.map((item) => item.courseId._id),
				paymentMethod: selectedPaymentMethod,
				couponCode: appliedDiscount?.code,
			},
			{
				onSuccess: (response) => {
					if (response?._id) {
						if (response.paymentMethod === "stripe") {
							router.push(
								`${ROUTE_CONFIG.STRIPE_PAYMENT}?orderid=${response?._id}`
							);
						} else {
							router.push(
								`${ROUTE_CONFIG.QR_PAYMENT}?orderid=${response?._id}`
							);
						}
					}
				},
			}
		);
	};

	const paymentMethods = [
		{
			id: "stripe" as const,
			name: "Card",
			description: "Payment with Stripe",
			icon: CreditCard,
			bgColor: "bg-blue-50",
			borderColor: "border-blue-200",
			textColor: "text-blue-700",
		},
		{
			id: "bank_transfer" as const,
			name: "Bank",
			description: "Direct bank transfer",
			icon: Banknote,
			bgColor: "bg-green-50",
			borderColor: "border-green-200",
			textColor: "text-green-700",
		},
	];

	if (cart.items.length === 0) {
		return (
			<Card className="sticky top-24">
				<CardContent className="p-6">
					<div className="text-center">
						<p className="text-muted-foreground">Your cart is empty</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-md sm:shadow-lg lg:sticky lg:top-24">
			<div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
				{/* Summary Header */}
				<div className="text-center pb-2 sm:pb-3 border-b border-gray-100">
					<h3 className="text-base sm:text-lg font-bold text-gray-900 mb-0.5 sm:mb-1">
						Order Summary
					</h3>
					<p className="text-[10px] sm:text-xs text-gray-600">
						Review your items and complete your purchase
					</p>
				</div>

				{/* Cart Totals */}
				<CartTotals
					summary={summary}
					appliedDiscount={appliedDiscount}
					onRemoveDiscount={removeDiscount}
				/>

				{/* Discount Section */}
				<div className="space-y-2 sm:space-y-3">
					<h4 className="font-semibold text-gray-900 text-[10px] sm:text-xs">
						Have a discount code?
					</h4>
					<Sheet>
						<SheetTrigger asChild>
							<div>
								<DiscountTrigger />
							</div>
						</SheetTrigger>

						<DiscountDrawer
							cart={cart}
							summary={summary}
							appliedDiscount={appliedDiscount}
							manualDiscountCode={manualDiscountCode}
							applyingCouponCode={applyingCouponCode}
							selectedDiscountCode={selectedDiscountCode}
							couponsData={couponsData}
							isCouponsLoading={isCouponsLoading}
							onManualDiscountCodeChange={setManualDiscountCode}
							onApplyDiscount={applyDiscountCode}
							onRemoveDiscount={removeDiscount}
							onCheckout={handleCheckout}
							onCloseDrawer={() => {}}
						/>
					</Sheet>
				</div>

				{/* Payment Method Selection */}
				<div className="space-y-3 sm:space-y-4">
					<h4 className="font-semibold text-gray-900 text-xs sm:text-sm">
						Payment Method
					</h4>
					<div className="grid grid-cols-2 gap-2 sm:gap-3">
						{paymentMethods.map((method) => {
							const Icon = method.icon;
							const isSelected = selectedPaymentMethod === method.id;

							return (
								<Button
									key={method.id}
									variant="outline"
									className={`p-2 sm:p-3 h-auto min-h-[70px] sm:min-h-[80px] flex-col transition-all duration-200 relative group ${
										isSelected
											? `${method.bgColor} ${method.borderColor} border-2 ${method.textColor} shadow-md`
											: "bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-sm"
									}`}
									onClick={() => setSelectedPaymentMethod(method.id)}
								>
									{/* Selection indicator */}
									{isSelected && (
										<div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
											<div
												className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${method.textColor.replace(
													"text-",
													"bg-"
												)}`}
											/>
										</div>
									)}

									<div className="flex flex-col items-center gap-1.5 sm:gap-2">
										<div
											className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
												isSelected
													? `${method.bgColor} ${method.borderColor} border`
													: "bg-gray-100 group-hover:bg-gray-200"
											}`}
										>
											<Icon
												className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-200 ${
													isSelected ? method.textColor : "text-gray-600"
												}`}
											/>
										</div>
										<div className="text-center">
											<div
												className={`font-semibold text-xs sm:text-sm transition-colors duration-200 ${
													isSelected ? method.textColor : "text-gray-700"
												}`}
											>
												{method.name}
											</div>
											<div
												className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 transition-colors duration-200 ${
													isSelected
														? method.textColor.replace("700", "600")
														: "text-gray-500"
												}`}
											>
												{method.description}
											</div>
										</div>
									</div>
								</Button>
							);
						})}
					</div>
				</div>

				{/* Checkout Actions */}
				<div className="pt-2 sm:pt-3 border-t border-gray-100">
					<CheckoutActions
						isCheckoutPending={checkout.isPending}
						onCheckout={handleCheckout}
					/>
				</div>
			</div>
		</div>
	);
};

export default CartSummary;
