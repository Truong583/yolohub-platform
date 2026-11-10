import {Badge} from "@/components/ui/badge";
import {formatPrice} from "@/utils/format";
import Image from "next/image";

interface OrderItemProps {
	title: string;
	thumbnail: string;
	price: number;
	oldPrice?: number;
}

export function OrderItem({title, thumbnail, price, oldPrice}: OrderItemProps) {
	const hasDiscount = oldPrice && oldPrice > price;
	const discountPercentage = hasDiscount
		? Math.round(((oldPrice - price) / oldPrice) * 100)
		: 0;

	return (
		<div className="flex gap-2.5 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
			<div className="w-14 h-14 sm:w-20 sm:h-20 relative flex-shrink-0">
				<Image
					src={thumbnail}
					alt={title}
					fill
					className="object-cover rounded-md sm:rounded-lg"
					sizes="(max-width: 640px) 56px, 80px"
				/>
			</div>
			<div className="flex-1 space-y-1 sm:space-y-2 min-w-0">
				<h5 className="font-medium text-xs sm:text-sm line-clamp-2">{title}</h5>
				<div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
					{hasDiscount && (
						<span className="text-xs sm:text-sm text-gray-500 line-through">
							{formatPrice(oldPrice)}
						</span>
					)}
					<p className="text-base sm:text-lg font-semibold">
						{formatPrice(price)}
					</p>
					{hasDiscount && (
						<Badge
							variant="destructive"
							className="text-[10px] sm:text-xs font-bold uppercase tracking-wide px-1.5 sm:px-2 py-0 sm:py-0.5"
						>
							{discountPercentage}% OFF
						</Badge>
					)}
				</div>
			</div>
		</div>
	);
}
