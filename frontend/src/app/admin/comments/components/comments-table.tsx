import {DataTable, DataTablePagination} from "@/components/table";
import {PAGINATION_CONSTANTS, TABLE_CONSTANTS} from "@/constants";
import {useAllComments} from "@/hooks/use-comments";
import {useDebounce} from "@/hooks/use-debounce";
import {
	getCoreRowModel,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";
import {useCallback, useEffect, useMemo, useState} from "react";
import CommentsBulkDeleteDialog from "./comments-bulk-delete-dialog";
import {commentsColumns} from "./comments-columns";
import DataTableToolbar from "./data-table-toolbar";

// Filter state interface for better organization
interface FilterState {
	search: string;
	status: string[];
}

const CommentsTable = () => {
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
		}),
		[currentPage, pageSize, debouncedSearch, filters.status]
	);

	const {data: commentsData, isLoading} = useAllComments(queryParams);

	// Reset to first page when filters change (optimized dependencies)
	useEffect(() => {
		setCurrentPage(PAGINATION_CONSTANTS.DEFAULT_PAGE);
	}, [debouncedSearch, filters.status]);

	// Memoized handlers for better performance
	const handleSearchChange = useCallback((search: string) => {
		setFilters((prev) => ({...prev, search}));
	}, []);

	const handleStatusFilterChange = useCallback((status: string[]) => {
		setFilters((prev) => ({...prev, status}));
	}, []);

	const handleClearFilters = useCallback(() => {
		setFilters({
			search: "",
			status: [],
		});
		setCurrentPage(PAGINATION_CONSTANTS.DEFAULT_PAGE);
	}, []);

	const handlePageChange = useCallback((page: number) => {
		setCurrentPage(page);
	}, []);

	const handlePageSizeChange = useCallback((size: number) => {
		setPageSize(size);
		setCurrentPage(PAGINATION_CONSTANTS.DEFAULT_PAGE); // Reset to first page when page size changes
	}, []);

	const handleBulkDelete = useCallback(() => {
		setBulkDeleteDialogOpen(true);
	}, []);

	const handleBulkDeleteSuccess = useCallback(() => {
		setRowSelection({}); // Clear selection after successful delete
	}, []);

	// Memoized comments data
	const comments = useMemo(
		() => commentsData?.comments || [],
		[commentsData?.comments]
	);

	// Get selected comments for bulk operations
	const selectedComments = useMemo(() => {
		return comments.filter((_, index) => rowSelection[index]);
	}, [comments, rowSelection]);

	// Memoized table configuration
	const table = useReactTable({
		data: comments,
		columns: commentsColumns,
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
				onSearchChange={handleSearchChange}
				onStatusFilterChange={handleStatusFilterChange}
				onClearFilters={handleClearFilters}
				onBulkDelete={handleBulkDelete}
				isLoading={isLoading}
				table={table}
			/>

			<div className="overflow-hidden rounded-md border">
				<div className="overflow-x-auto">
					<DataTable table={table} />
				</div>
			</div>

			{commentsData?.pagination && (
				<DataTablePagination
					pagination={commentsData.pagination}
					currentDataLength={comments.length}
					pageSize={pageSize}
					pageSizeOptions={PAGINATION_CONSTANTS.PAGE_SIZE_OPTIONS}
					onPageChange={handlePageChange}
					onPageSizeChange={handlePageSizeChange}
				/>
			)}

			{/* Bulk Delete Dialog */}
			<CommentsBulkDeleteDialog
				selectedComments={selectedComments}
				open={bulkDeleteDialogOpen}
				onOpenChange={setBulkDeleteDialogOpen}
				onSuccess={handleBulkDeleteSuccess}
			/>
		</div>
	);
};

export default CommentsTable;
