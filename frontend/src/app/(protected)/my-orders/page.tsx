"use client";

import dynamic from "next/dynamic";

// Dynamic import for data-heavy content (includes header with actual data)
const OrdersContent = dynamic(() => import("./components/orders-content"), {
	loading: () => (
		<div className="animate-pulse space-y-4 sm:space-y-6">
			{/* Header skeleton */}
			<div className="mb-4 sm:mb-6">
				<div className="flex items-center gap-2 sm:gap-3 mb-2">
					<div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl"></div>
					<div>
						<div className="h-6 sm:h-8 bg-gray-200 rounded w-32 sm:w-48 mb-2"></div>
						<div className="h-3 sm:h-4 bg-gray-200 rounded w-48 sm:w-64"></div>
					</div>
				</div>
			</div>
			{/* Content skeleton */}
			<div className="space-y-3 sm:space-y-4">
				{Array.from({length: 3}).map((_, i) => (
					<div key={i} className="h-24 sm:h-32 bg-gray-200 rounded-lg"></div>
				))}
			</div>
		</div>
	),
});

// Main my orders page - Arrow function
const MyOrdersPage = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
				{/* Progressive loading with proper data and SEO */}
				<OrdersContent />
			</div>
		</div>
	);
};

export default MyOrdersPage;
