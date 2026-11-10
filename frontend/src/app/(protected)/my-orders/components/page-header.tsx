import {ShoppingBag} from "lucide-react";

interface PageHeaderProps {
	ordersCount: number;
}

// Page header component - Arrow function
const PageHeader = ({ordersCount}: PageHeaderProps) => {
	return (
		<div className="mb-4 sm:mb-6">
			<div className="flex items-center justify-between gap-3">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
						<div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl shadow-md">
							<ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
						</div>
						<div className="min-w-0">
							<h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent truncate">
								My Orders
							</h1>
							<p className="text-gray-500 text-xs sm:text-sm hidden sm:block">
								Manage and track your orders easily
							</p>
						</div>
					</div>
				</div>
				{ordersCount > 0 && (
					<div className="text-right flex-shrink-0">
						<div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
							{ordersCount}
						</div>
						<div className="text-[10px] sm:text-xs text-gray-500">orders</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default PageHeader;
