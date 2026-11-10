"use client";

import {Button} from "@/components/ui/button";
import {Tooltip, TooltipTrigger} from "@/components/ui/tooltip";
import {ROUTE_CONFIG} from "@/configs/routes";
import {useCart} from "@/hooks/use-cart";
import {cn} from "@/lib/utils";
import {useIsAuthenticated} from "@/stores/auth-store";
import {formatPrice} from "@/utils/format";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import {ShoppingCart} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Custom TooltipContent with proper arrow styling
function CustomTooltipContent({
	className,
	sideOffset = 0,
	children,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				sideOffset={sideOffset}
				className={cn(
					"z-50 w-fit origin-[--radix-tooltip-content-transform-origin] rounded-md px-3 py-1.5 text-sm text-gray-900 shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
					className
				)}
				{...props}
			>
				{children}
				<TooltipPrimitive.Arrow
					className="fill-white stroke-gray-200 stroke-1"
					style={{
						fill: "white",
						stroke: "rgb(229, 231, 235)",
						strokeWidth: "1px",
					}}
				/>
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	);
}

export default function CartTooltip() {
	const isAuthenticated = useIsAuthenticated();
	const {data: cart, isLoading: cartLoading} = useCart({
		enabled: isAuthenticated,
	});

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="relative h-8 w-8 sm:h-10 sm:w-10 p-0 text-gray-500 hover:text-blue-600 transition-all duration-300 group hover:bg-gradient-to-br hover:from-blue-50 hover:via-blue-100/50 hover:to-purple-50 hover:shadow-lg hover:shadow-blue-200/20 rounded-full border border-transparent hover:border-blue-100 focus:outline-none"
					asChild
				>
					<Link
						href={
							isAuthenticated ? ROUTE_CONFIG.CART : ROUTE_CONFIG.AUTH.SIGN_IN
						}
						aria-label={
							isAuthenticated
								? `Shopping cart with ${cart?.items?.length || 0} items`
								: "Sign in to view cart"
						}
					>
						<div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/8 group-hover:to-purple-500/8 rounded-full transition-all duration-300"></div>
						<ShoppingCart
							size={16}
							className="sm:w-[18px] sm:h-[18px] relative z-10 group-hover:scale-110 transition-transform duration-300"
						/>
						{isAuthenticated && cart && cart.items && cart.items.length > 0 && (
							<span className="absolute z-20 -top-1 -right-1 sm:top-0 sm:right-0 w-4 h-4 sm:w-4 sm:h-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] rounded-full flex items-center justify-center font-semibold shadow-lg">
								{cart.items.length > 99 ? "99+" : cart.items.length}
							</span>
						)}
					</Link>
				</Button>
			</TooltipTrigger>
			<CustomTooltipContent
				side="bottom"
				className="w-72 sm:w-80 p-0 hidden sm:block"
			>
				<div className="bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-hidden">
					{!isAuthenticated ? (
						<div className="p-6 text-center">
							<ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
							<p className="text-gray-500 font-medium">
								Sign in to view your cart
							</p>
							<p className="text-sm text-gray-400 mt-1 mb-4">
								Save courses and track your learning progress
							</p>
							<Button
								className="w-full bg-blue-600 hover:bg-blue-700"
								size="sm"
								asChild
							>
								<Link
									href={ROUTE_CONFIG.AUTH.SIGN_IN}
									aria-label="Sign in to your account"
								>
									Sign In
								</Link>
							</Button>
						</div>
					) : cartLoading ? (
						<div className="p-4 text-center text-gray-500">Loading cart...</div>
					) : !cart || !cart.items || cart.items.length === 0 ? (
						<div className="p-6 text-center">
							<ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
							<p className="text-gray-500 font-medium">Your cart is empty</p>
							<p className="text-sm text-gray-400 mt-1">
								Add some courses to get started
							</p>
						</div>
					) : (
						<>
							<div className="p-3 border-b border-gray-100">
								<h3 className="font-semibold text-gray-900">Shopping Cart</h3>
								<p className="text-sm text-gray-500">
									{cart.items.length} item{cart.items.length !== 1 ? "s" : ""}
								</p>
							</div>
							<div className="max-h-64 overflow-y-auto">
								{cart.items.slice(0, 3).map((item) => (
									<div
										key={item.courseId._id}
										className="p-3 border-b border-gray-50 last:border-b-0"
									>
										<div className="flex items-center gap-3">
											<div className="relative w-12 h-8 rounded overflow-hidden bg-gray-100 flex-shrink-0">
												{item.thumbnail ? (
													<Image
														src={item.thumbnail}
														alt={item.title}
														fill
														className="object-cover"
														sizes="48px"
													/>
												) : (
													<div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
														<span className="text-white text-xs">📚</span>
													</div>
												)}
											</div>
											<div className="flex-1 min-w-0">
												<h4 className="text-sm font-medium text-gray-900 line-clamp-1">
													{item.title}
												</h4>
												<div className="flex items-center gap-2 mt-1">
													{item.oldPrice && item.oldPrice > item.price && (
														<span className="text-xs text-gray-400 line-through">
															{formatPrice(item.oldPrice)}
														</span>
													)}
													<span className="text-sm font-semibold text-gray-900">
														{formatPrice(item.price)}
													</span>
												</div>
											</div>
										</div>
									</div>
								))}
								{cart.items.length > 3 && (
									<div className="p-3 text-center">
										<p className="text-sm text-gray-500">
											+{cart.items.length - 3} more item
											{cart.items.length - 3 !== 1 ? "s" : ""}
										</p>
									</div>
								)}
							</div>
							<div className="p-3 border-t border-gray-100 bg-gray-50">
								<div className="flex items-center justify-between mb-2">
									<span className="text-sm font-medium text-gray-700">
										Total:
									</span>
									<span className="text-lg font-bold text-gray-900">
										{formatPrice(cart.totalPrice || 0)}
									</span>
								</div>
								<Button
									className="w-full bg-blue-600 hover:bg-blue-700"
									size="sm"
									asChild
								>
									<Link
										href={
											isAuthenticated
												? ROUTE_CONFIG.CART
												: ROUTE_CONFIG.AUTH.SIGN_IN
										}
										aria-label="View shopping cart and proceed to checkout"
									>
										View Cart & Checkout
									</Link>
								</Button>
							</div>
						</>
					)}
				</div>
			</CustomTooltipContent>
		</Tooltip>
	);
}
