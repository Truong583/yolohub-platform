"use client";

import {DataTable, DataTablePagination} from "@/components/table";
import {useCoupons} from "@/hooks/use-coupons";
import {useDebounce} from "@/hooks/use-debounce";
import {
	VisibilityState,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {useCallback, useEffect, useMemo, useState} from "react";
import {columns} from "./coupons-columns";
import DataTableToolbar from "./data-table-toolbar";
import CouponsBulkDeleteDialog from "./coupons-bulk-delete-dialog";
import {TABLE_CONSTANTS, PAGINATION_CONSTANTS, SortOrder} from "@/constants";

// Filter state interface for better organization
interface FilterState {
	search: string;
	status: string[];
	discountType: string[];
	sortBy: string;
	sortOrder: SortOrder;
}

const CouponsTable = () => {
	// Essential table state
	const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

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
		discountType: [],
		sortBy: TABLE_CONSTANTS.DEFAULT_SORT_BY,
		sortOrder: TABLE_CONSTANTS.DEFAULT_SORT_ORDER,
	});

	// Debounce search input
	const debouncedSearch = useDebounce(
		filters.search,
		TABLE_CONSTANTS.SEARCH_DEBOUNCE_MS
	);

	// Optimized query parameters
	const queryParams = useMemo(
		() => ({
			page: currentPage,
			limit: pageSize,
			search: debouncedSearch,
			status: filters.status,
			discountType: filters.discountType,
			sortBy: filters.sortBy,
			sortOrder: filters.sortOrder,
		}),
		[
			currentPage,
			pageSize,
			debouncedSearch,
			filters.status,
			filters.discountType,
			filters.sortBy,
			filters.sortOrder,
		]
	);

	const {data: couponsData, isLoading} = useCoupons(queryParams);

	// Reset to first page when filters change (optimized dependencies)
	useEffect(() => {
		setCurrentPage(PAGINATION_CONSTANTS.DEFAULT_PAGE);
	}, [
		debouncedSearch,
		filters.status,
		filters.discountType,
		filters.sortBy,
		filters.sortOrder,
	]);

	// Memoized handlers for better performance
	const handleSearchChange = useCallback((search: string) => {
		setFilters((prev) => ({...prev, search}));
	}, []);

	const handleStatusFilterChange = useCallback((status: string[]) => {
		setFilters((prev) => ({...prev, status}));
	}, []);

	const handleDiscountTypeFilterChange = useCallback(
		(discountType: string[]) => {
			setFilters((prev) => ({...prev, discountType}));
		},
		[]
	);

	const handleClearFilters = useCallback(() => {
		setFilters({
			search: "",
			status: [],
			discountType: [],
			sortBy: TABLE_CONSTANTS.DEFAULT_SORT_BY,
			sortOrder: TABLE_CONSTANTS.DEFAULT_SORT_ORDER,
		});
		setCurrentPage(PAGINATION_CONSTANTS.DEFAULT_PAGE);
	}, []);

	const handlePageChange = useCallback((page: number) => {
		setCurrentPage(page);
	}, []);

	const handlePageSizeChange = useCallback((size: number) => {
		setPageSize(size);
		setCurrentPage(PAGINATION_CONSTANTS.DEFAULT_PAGE);
	}, []);

	const handleBulkDelete = useCallback(() => {
		setBulkDeleteDialogOpen(true);
	}, []);

	const handleBulkDeleteSuccess = useCallback(() => {
		setRowSelection({});
	}, []);

	// Memoized coupons data
	const coupons = useMemo(
		() => couponsData?.coupons || [],
		[couponsData?.coupons]
	);

	// Get selected coupons for bulk operations
	const selectedCoupons = useMemo(() => {
		return coupons.filter((_, index) => rowSelection[index]);
	}, [coupons, rowSelection]);

	// Memoized table configuration
	const table = useReactTable({
		data: coupons,
		columns,
		state: {
			columnVisibility,
			rowSelection,
		},
		enableRowSelection: TABLE_CONSTANTS.ENABLE_ROW_SELECTION,
		onRowSelectionChange: setRowSelection,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="space-y-4">
			<DataTableToolbar
				searchValue={filters.search}
				statusFilter={filters.status}
				discountTypeFilter={filters.discountType}
				onSearchChange={handleSearchChange}
				onStatusFilterChange={handleStatusFilterChange}
				onDiscountTypeFilterChange={handleDiscountTypeFilterChange}
				onClearFilters={handleClearFilters}
				onBulkDelete={handleBulkDelete}
				isLoading={isLoading}
				table={table}
			/>

			<div className="overflow-hidden rounded-md border">
				<DataTable table={table} />
			</div>

			{couponsData?.pagination && (
				<DataTablePagination
					pagination={couponsData.pagination}
					currentDataLength={coupons.length}
					pageSize={pageSize}
					pageSizeOptions={PAGINATION_CONSTANTS.PAGE_SIZE_OPTIONS}
					onPageChange={handlePageChange}
					onPageSizeChange={handlePageSizeChange}
				/>
			)}

			{/* Bulk Delete Dialog */}
			<CouponsBulkDeleteDialog
				selectedCoupons={selectedCoupons}
				open={bulkDeleteDialogOpen}
				onOpenChange={setBulkDeleteDialogOpen}
				onSuccess={handleBulkDeleteSuccess}
			/>
		</div>
	);
};

export default CouponsTable;
