import {Card, CardContent} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {Filter} from "lucide-react";

interface OrderFiltersProps {
	statusFilter: string;
	sortBy: string;
	ordersCount: number;
	totalOrders: number;
	onStatusChange: (value: string) => void;
	onSortChange: (value: string) => void;
}

// Order filters component - Arrow function
const OrderFilters = ({
	statusFilter,
	sortBy,
	ordersCount,
	totalOrders,
	onStatusChange,
	onSortChange,
}: OrderFiltersProps) => {
	return (
		<Card className="mb-4 sm:mb-6 border-0 shadow-md bg-white/70 backdrop-blur-sm">
			<CardContent className="p-3 sm:p-4">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
						<div className="flex items-center gap-2 sm:gap-3">
							<div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg">
								<Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
							</div>
							<span className="text-xs sm:text-sm font-semibold text-gray-700">
								Filters
							</span>
						</div>

						<div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
							<Select value={statusFilter} onValueChange={onStatusChange}>
								<SelectTrigger className="w-full sm:w-[160px] md:w-[180px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-9 sm:h-10 text-xs sm:text-sm">
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All statuses</SelectItem>
									<SelectItem value="pending">Pending payment</SelectItem>
									<SelectItem value="completed">Completed</SelectItem>
									<SelectItem value="cancelled">Cancelled</SelectItem>
								</SelectContent>
							</Select>

							<Select value={sortBy} onValueChange={onSortChange}>
								<SelectTrigger className="w-full sm:w-[160px] md:w-[180px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-9 sm:h-10 text-xs sm:text-sm">
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="createdAt">Date created</SelectItem>
									<SelectItem value="updatedAt">Last updated</SelectItem>
									<SelectItem value="totalAmount">Total amount</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{ordersCount > 0 && (
						<div className="bg-gray-50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg self-start sm:self-auto">
							<span className="text-xs sm:text-sm font-medium text-gray-600 whitespace-nowrap">
								{ordersCount} / {totalOrders || 0} orders
							</span>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default OrderFilters;
