"use client";

import Image from "next/image";
import {Trash2, Loader2} from "lucide-react";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {formatPrice} from "@/utils/format";
import {useRemoveFromCart} from "@/hooks/use-cart";
import type {CartItem} from "@/types/cart";

interface CartItemProps {
	item: CartItem;
}

// Cart item component - Arrow function
const CartItemComponent = ({item}: CartItemProps) => {
	const removeFromCart = useRemoveFromCart();

	const handleRemove = () => {
		removeFromCart.mutate(item.courseId._id);
	};

	return (
		<Card className="p-3 sm:p-4">
			<div className="flex items-start gap-3 sm:gap-4">
				{/* Course Thumbnail */}
				<div className="relative w-16 h-12 sm:w-24 sm:h-16 rounded-md sm:rounded-lg overflow-hidden bg-muted flex-shrink-0">
					{item.thumbnail ? (
						<Image
							src={item.thumbnail}
							alt={item.title}
							fill
							className="object-cover"
							sizes="(max-width: 640px) 64px, 96px"
						/>
					) : (
						<div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
							<span className="text-white text-[10px] sm:text-xs font-medium">
								Course
							</span>
						</div>
					)}
				</div>

				{/* Course Info */}
				<div className="flex-1 min-w-0">
					<h3 className="font-semibold text-xs sm:text-sm line-clamp-2 mb-1 sm:mb-2">
						{item.title}
					</h3>

					{/* Price Display */}
					<div className="flex flex-col gap-0.5 sm:gap-1 mb-2 sm:mb-3">
						{/* Show old price if available and greater than current price */}
						{item.oldPrice && item.oldPrice > item.price && (
							<div className="flex items-center gap-1.5 sm:gap-2">
								<span className="text-xs sm:text-sm text-gray-500 line-through">
									{formatPrice(item.oldPrice)}
								</span>
								<span className="text-[10px] sm:text-xs bg-red-600 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium shadow-sm">
									{Math.round(
										((item.oldPrice - item.price) / item.oldPrice) * 100
									)}
									% OFF
								</span>
							</div>
						)}
						<div className="flex items-center gap-2">
							<span className="font-bold text-base sm:text-lg">
								{formatPrice(item.price)}
							</span>
						</div>
					</div>
				</div>

				{/* Remove Button */}
				<Button
					variant="ghost"
					size="sm"
					onClick={handleRemove}
					disabled={removeFromCart.isPending}
					className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 sm:p-2 h-auto"
				>
					{removeFromCart.isPending ? (
						<Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
					) : (
						<Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
					)}
				</Button>
			</div>
		</Card>
	);
};

export default CartItemComponent;
