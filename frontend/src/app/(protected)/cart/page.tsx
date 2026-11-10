"use client";

import dynamic from "next/dynamic";
import Loader from "@/components/loader";
import {useCart} from "@/hooks/use-cart";
import {ShoppingCart} from "lucide-react";

// Dynamic imports for cart components (user-specific, interactive)
const CartItemComponent = dynamic(() => import("./components/cart-item"), {
	ssr: false,
});

const CartSummary = dynamic(() => import("./components/cart-summary"), {
	ssr: false,
});

const EmptyCart = dynamic(() => import("./components/empty-cart"), {
	ssr: false,
});

// Main cart page - Arrow function
const CartPage = () => {
	const {data: cart, isLoading} = useCart();

	if (isLoading) {
		return <Loader />;
	}

	if (!cart || cart.items.length === 0) {
		return (
			<div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
				<div className="max-w-6xl mx-auto">
					<EmptyCart />
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
			<div className="max-w-6xl mx-auto">
				{/* Page Header */}
				<div className="mb-6 sm:mb-8">
					<h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-3">
						<ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8" />
						Shopping Cart
					</h1>
					<p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
						Review and manage your selected courses ({cart.items.length}{" "}
						{cart.items.length === 1 ? "item" : "items"})
					</p>
				</div>

				{/* Main Content */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
					{/* Cart Items */}
					<div className="lg:col-span-2 space-y-3 sm:space-y-4">
						<div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-md sm:shadow-lg overflow-hidden">
							<div className="p-4 sm:p-6 border-b border-gray-100">
								<h2 className="text-lg sm:text-xl font-semibold text-gray-900">
									Course Items
								</h2>
								<p className="text-xs sm:text-sm text-gray-600 mt-1">
									Lifetime access to all course materials
								</p>
							</div>

							<div className="divide-y divide-gray-100">
								{cart.items.map((item) => (
									<div key={item.courseId._id} className="p-3 sm:p-6">
										<CartItemComponent item={item} />
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Cart Summary */}
					<div className="lg:col-span-1">
						<CartSummary cart={cart} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartPage;
