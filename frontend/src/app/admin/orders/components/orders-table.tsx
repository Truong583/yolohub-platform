"use client";

import {DataTable, DataTablePagination} from "@/components/table";
import {useAdminOrders} from "@/hooks/use-orders";
import {useDebounce} from "@/hooks/use-debounce";
import {
	VisibilityState,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {useCallback, useEffect, useMemo, useState} from "react";
import {columns} from "./orders-columns";
import DataTableToolbar from "./data-table-toolbar";
import OrdersBulkDeleteDialog from "./orders-bulk-delete-dialog";
import OrderStatusDialog from "./order-status-dialog";

import {TABLE_CONSTANTS, PAGINATION_CONSTANTS, SortOrder} from "@/constants";
import {IOrder} from "@/types/order";

// Filter state interface for better organization
interface FilterState {
	search: string;
	status: string[];
	paymentMethod: string[];
	sortBy: string;
	sortOrder: SortOrder;
}

const OrdersTable = () => {
	// Essential table state
	const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
	const [statusDialogOpen, setStatusDialogOpen] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

	// Pagination state
	const [currentPage, setCurrentPage] = useState(
		PAGINATION_CONSTANTS.DEFAULT_PAGE
	);
	const [pageSize, setPageSize] = useState(
		PAGINATION_CONSTANTS.DEFAULT_PAGE_SIZE
	);

	// Filter state - grouped for better performance
	const [filters, setFilters] = useState<FilterState>({
		search: "",
		status: [],
		paymentMethod: [],
		sortBy: TABLE_CONSTANTS.DEFAULT_SORT_BY,
		sortOrder: TABLE_CONSTANTS.DEFAULT_SORT_ORDER,
	});

	// Debounced search to avoid excessive API calls
	const debouncedSearch = useDebounce(filters.search, 300);

	// Memoized query parameters
	const queryParams = useMemo(
		() => ({
			page: currentPage,
			limit: pageSize,
			search: debouncedSearch,
			status: filters.status.length > 0 ? filters.status : undefined,
			paymentMethod:
				filters.paymentMethod.length > 0 ? filters.paymentMethod : undefined,
			sortBy: filters.sortBy as
				| "createdAt"
				| "updatedAt"
				| "totalAmount"
				| "code",
			sortOrder: filters.sortOrder,
		}),
		[currentPage, pageSize, debouncedSearch, filters]
	);

	// Fetch orders with error handling
	const {data} = useAdminOrders(queryParams);
	console.log("data", data);

	// Update filters with proper state management
	const updateFilters = useCallback(
		(newFilters: Partial<FilterState>) => {
			setFilters((prev) => ({...prev, ...newFilters}));
			// Reset to first page when filters change
			if (currentPage !== 1) {
				setCurrentPage(1);
			}
		},
		[currentPage]
	);

	// Reset pagination when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [filters.status, filters.paymentMethod, debouncedSearch]);

	// Prepare table data
	const orders = data?.orders ?? [];
	const totalCount = data?.pagination?.total ?? 0;

	// Handle status click
	const handleStatusClick = useCallback((order: IOrder) => {
		setSelectedOrder(order);
		setStatusDialogOpen(true);
	}, []);

	// Configure table
	const table = useReactTable({
		data: orders,
		columns,
		getCoreRowModel: getCoreRowModel(),
		state: {
			rowSelection,
			columnVisibility,
		},
		onRowSelectionChange: setRowSelection,
		onColumnVisibilityChange: setColumnVisibility,
		getRowId: (row) => row._id,
		enableRowSelection: true,
		enableMultiRowSelection: true,
		meta: {
			onStatusClick: handleStatusClick,
		},
	});

	// Get selected row count for bulk operations
	const selectedRowCount = Object.keys(rowSelection).length;

	// Handle bulk delete
	const handleBulkDelete = useCallback(() => {
		if (selectedRowCount > 0) {
			setBulkDeleteDialogOpen(true);
		}
	}, [selectedRowCount]);

	// Handle pagination
	const handlePageChange = useCallback((page: number) => {
		setCurrentPage(page);
	}, []);

	const handlePageSizeChange = useCallback((size: number) => {
		setPageSize(size);
		setCurrentPage(1); // Reset to first page
	}, []);

	// Calculate pagination info
	const pagination = useMemo(
		() => ({
			page: currentPage,
			pageSize,
			limit: pageSize,
			total: totalCount,
			pageCount: Math.ceil(totalCount / pageSize),
			totalPages: Math.ceil(totalCount / pageSize),
		}),
		[currentPage, pageSize, totalCount]
	);

	return (
		<div className="space-y-4">
			{/* Toolbar with filters and actions */}
			<DataTableToolbar
				table={table}
				filters={filters}
				onFiltersChange={updateFilters}
				selectedRowCount={selectedRowCount}
				onBulkDelete={handleBulkDelete}
			/>

			{/* Main data table */}
			<DataTable table={table} />

			{/* Pagination */}
			<DataTablePagination
				pagination={pagination}
				currentDataLength={orders.length}
				pageSize={pageSize}
				onPageChange={handlePageChange}
				onPageSizeChange={handlePageSizeChange}
			/>

			{/* Bulk delete dialog */}
			{bulkDeleteDialogOpen && (
				<OrdersBulkDeleteDialog
					open={bulkDeleteDialogOpen}
					onOpenChange={setBulkDeleteDialogOpen}
					selectedOrders={Object.keys(rowSelection)}
					onSuccess={() => {
						setRowSelection({});
						// Optionally refetch data or handle success
					}}
				/>
			)}

			{/* Status update dialog */}
			{statusDialogOpen && selectedOrder && (
				<OrderStatusDialog
					order={selectedOrder}
					open={statusDialogOpen}
					onOpenChange={setStatusDialogOpen}
				/>
			)}
		</div>
	);
};

export default OrdersTable;
