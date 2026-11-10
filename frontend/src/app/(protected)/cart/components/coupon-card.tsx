"use client";

import {Clock, Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";

import CouponConditionsDialog from "./coupon-conditions-dialog";
import {useState} from "react";
import dayjs from "dayjs";
import type {Coupon} from "@/types/coupon";
import type {Cart} from "@/types/cart";
import {formatPrice} from "@/utils/format";

const isCouponApplicable = (coupon: Coupon, cart: Cart): boolean => {
	// If courseIds is empty or undefined, coupon applies to entire cart (always applicable)
	if (!coupon.courseIds || coupon.courseIds.length === 0) {
		return true;
	}

	// For specific courses, check if any courses in cart match the coupon's courseIds
	const cartCourseIds = cart.items.map((item) => item.courseId._id);

	const couponCourseIds = coupon.courseIds.map((course) => course._id);

	// all cartCourseIds must be in couponCourseIds
	return cartCourseIds.every((courseId: string) =>
		couponCourseIds.includes(courseId)
	);
	// return couponCourseIds.some((courseId: string) =>
	// 	cartCourseIds.includes(courseId)
	// );
};

interface CouponCardProps {
	coupon: Coupon;
	cart: Cart;
	selectedDiscountCode: string;
	isApplyingDiscount: boolean;
	onApplyDiscount: (code: string) => void;
	onRemoveDiscount: () => void;
}

// Coupon card component - Arrow function
const CouponCard = ({
	coupon,
	cart,
	selectedDiscountCode,
	isApplyingDiscount,
	onApplyDiscount,
	onRemoveDiscount,
}: CouponCardProps) => {
	const [showConditions, setShowConditions] = useState(false);
	const expiryDate = dayjs(coupon.endDate).format("DD/MM/YYYY");
	const isApplicable = isCouponApplicable(coupon, cart);

	return (
		<>
			<div className="relative overflow-hidden border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
				{/* Hot Badge */}
				<div className="absolute top-0 left-0">
					<div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-br-lg relative overflow-hidden">
						{/* Animated background pattern like header */}
						<div className="absolute inset-0 opacity-20">
							<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-pulse"></div>
						</div>
						<div className="absolute inset-0 bg-black/10"></div>
						<div className="relative z-10">
							<div className="text-[10px] sm:text-xs font-bold">
								HOT DISCOUNT
							</div>
							<div className="text-base sm:text-lg font-bold leading-none">
								{coupon.discountType === "percent"
									? `${coupon.discountValue}%`
									: `${formatPrice(coupon.discountValue)}`}
							</div>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="pt-10 sm:pt-12 px-3 sm:px-4 pb-2.5 sm:pb-3">
					{/* Coupon Code */}
					<div className="mb-1.5 sm:mb-2">
						<h3 className="font-bold text-sm sm:text-base text-gray-900 mb-0.5 truncate">
							{coupon.code}
						</h3>
						<p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
							{coupon.title}{" "}
						</p>
					</div>

					{/* Bottom Section */}
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
						{/* Expiry Date */}
						<div className="flex items-center text-xs sm:text-sm text-gray-500">
							<Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
							<span className="truncate">Expires: {expiryDate}</span>
						</div>

						{/* Action Buttons */}
						<div className="flex items-center space-x-1.5 sm:space-x-2 w-full sm:w-auto">
							<button
								onClick={() => setShowConditions(true)}
								className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium underline whitespace-nowrap"
							>
								Conditions
							</button>

							{selectedDiscountCode === coupon.code ? (
								<Button
									variant="outline"
									onClick={onRemoveDiscount}
									className="text-red-600 border-red-200 hover:bg-red-50 h-8 sm:h-9 text-xs sm:text-sm flex-1 sm:flex-none"
									size="sm"
								>
									Remove
								</Button>
							) : (
								<Button
									onClick={() => onApplyDiscount(coupon.code)}
									disabled={isApplyingDiscount || !isApplicable}
									className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 text-white disabled:bg-gray-400 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group h-8 sm:h-9 text-xs sm:text-sm flex-1 sm:flex-none"
									size="sm"
								>
									{/* Animated shine effect like header */}
									<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
									<span className="relative z-10">
										{isApplyingDiscount ? (
											<div className="flex items-center justify-center gap-0.5 sm:gap-1">
												<Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mr-1 sm:mr-2" />
												<span className="hidden sm:inline">Applying...</span>
												<span className="sm:hidden">...</span>
											</div>
										) : !isApplicable ? (
											<>
												<span className="hidden sm:inline">Not applicable</span>
												<span className="sm:hidden">N/A</span>
											</>
										) : (
											"Apply"
										)}
									</span>
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Conditions Dialog */}
			<CouponConditionsDialog
				coupon={coupon}
				isOpen={showConditions}
				onClose={() => setShowConditions(false)}
			/>
		</>
	);
};

export default CouponCard;
