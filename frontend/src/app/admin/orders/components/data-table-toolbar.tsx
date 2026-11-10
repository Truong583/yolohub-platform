"use client";

import {Cross2Icon} from "@radix-ui/react-icons";
import {Table} from "@tanstack/react-table";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {DataTableViewOptions} from "@/components/table/data-table-view-options";
import {DataTableFacetedFilter} from "@/components/table/data-table-faceted-filter";
import {IOrder} from "@/types/order";
import {
	Search,
	Trash2,
	Clock,
	CheckCircle,
	XCircle,
	CreditCard,
	Building2,
} from "lucide-react";

interface FilterState {
	search: string;
	status: string[];
	paymentMethod: string[];
	sortBy: string;
	sortOrder: "asc" | "desc";
}

interface DataTableToolbarProps {
	table: Table<IOrder>;
	filters: FilterState;
	onFiltersChange: (filters: Partial<FilterState>) => void;
	selectedRowCount: number;
	onBulkDelete: () => void;
}

// Filter options for status
const statusOptions = [
	{
		label: "Chờ thanh toán",
		value: "pending",
		icon: Clock,
	},
	{
		label: "Hoàn thành",
		value: "completed",
		icon: CheckCircle,
	},
	{
		label: "Đã hủy",
		value: "cancelled",
		icon: XCircle,
	},
] as const;

// Filter options for payment methods
const paymentMethodOptions = [
	{
		label: "Stripe",
		value: "stripe",
		icon: CreditCard,
	},
	{
		label: "Chuyển khoản",
		value: "bank_transfer",
		icon: Building2,
	},
] as const;

const DataTableToolbar = ({
	table,
	filters,
	onFiltersChange,
	selectedRowCount,
	onBulkDelete,
}: DataTableToolbarProps) => {
	const isFiltered =
		filters.search ||
		filters.status.length > 0 ||
		filters.paymentMethod.length > 0;

	// Handle search input
	const handleSearchChange = (value: string) => {
		onFiltersChange({search: value});
	};

	// Handle status filter change
	const handleStatusChange = (values: string[]) => {
		onFiltersChange({status: values});
	};

	// Handle payment method filter change
	const handlePaymentMethodChange = (values: string[]) => {
		onFiltersChange({paymentMethod: values});
	};

	// Reset all filters
	const resetFilters = () => {
		onFiltersChange({
			search: "",
			status: [],
			paymentMethod: [],
		});
	};

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				{/* Search input */}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search orders..."
						value={filters.search}
						onChange={(e) => handleSearchChange(e.target.value)}
						className="pl-9 h-8 w-[150px] lg:w-[250px]"
					/>
				</div>

				{/* Status filter */}
				<DataTableFacetedFilter
					title="Status"
					options={statusOptions}
					selectedValues={filters.status}
					onSelectionChange={handleStatusChange}
				/>

				{/* Payment method filter */}
				<DataTableFacetedFilter
					title="Payment Method"
					options={paymentMethodOptions}
					selectedValues={filters.paymentMethod}
					onSelectionChange={handlePaymentMethodChange}
				/>

				{/* Reset filters button */}
				{isFiltered && (
					<Button
						variant="ghost"
						onClick={resetFilters}
						className="h-8 px-2 lg:px-3"
					>
						Reset
						<Cross2Icon className="ml-2 h-4 w-4" />
					</Button>
				)}
			</div>

			<div className="flex items-center space-x-2">
				{/* Bulk delete button */}
				{selectedRowCount > 0 && (
					<Button
						variant="destructive"
						size="sm"
						onClick={onBulkDelete}
						className="h-8"
					>
						<Trash2 className="mr-2 h-4 w-4" />
						Delete ({selectedRowCount})
					</Button>
				)}

				{/* Column visibility toggle */}
				<DataTableViewOptions table={table} />
			</div>
		</div>
	);
};

export default DataTableToolbar;
