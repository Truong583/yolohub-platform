import {DataTable, DataTablePagination} from "@/components/table";
import {useBlogs} from "@/hooks/use-blogs";
import {useDebounce} from "@/hooks/use-debounce";
import {
	VisibilityState,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {useCallback, useEffect, useMemo, useState} from "react";
import {columns} from "./blogs-columns";
import DataTableToolbar from "./data-table-toolbar";
import BlogsBulkDeleteDialog from "./blogs-bulk-delete-dialog";
import {TABLE_CONSTANTS, PAGINATION_CONSTANTS, SortOrder} from "@/constants";
import {BlogStatus, IBlog} from "@/types/blog";

// Filter state interface for better organization
interface FilterState {
	search: string;
	status: BlogStatus[];
	sortBy: keyof IBlog;
	sortOrder: SortOrder;
}

const BlogsTable = () => {
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
		sortBy: TABLE_CONSTANTS.DEFAULT_SORT_BY as keyof IBlog,
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
			sortBy: filters.sortBy,
			sortOrder: filters.sortOrder,
		}),
		[
			currentPage,
			pageSize,
			debouncedSearch,
			filters.status,
			filters.sortBy,
			filters.sortOrder,
		]
	);

	const {data: blogsData, isLoading} = useBlogs(queryParams);

	// Reset to first page when filters change (optimized dependencies)
	useEffect(() => {
		setCurrentPage(PAGINATION_CONSTANTS.DEFAULT_PAGE);
	}, [debouncedSearch, filters.status, filters.sortBy, filters.sortOrder]);

	// Memoized handlers for better performance
	const handleSearchChange = useCallback((search: string) => {
		setFilters((prev) => ({...prev, search}));
	}, []);

	const handleStatusFilterChange = useCallback((statusValues: string[]) => {
		const status = statusValues as BlogStatus[];
		setFilters((prev) => ({...prev, status}));
	}, []);

	const handleClearFilters = useCallback(() => {
		setFilters({
			search: "",
			status: [],
			sortBy: TABLE_CONSTANTS.DEFAULT_SORT_BY as keyof IBlog,
			sortOrder: TABLE_CONSTANTS.DEFAULT_SORT_ORDER,
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

	// Memoized blogs data
	const blogs = useMemo(() => blogsData?.blogs || [], [blogsData?.blogs]);

	// Get selected blogs for bulk operations
	const selectedBlogs = useMemo(() => {
		return blogs.filter((_, index) => rowSelection[index]);
	}, [blogs, rowSelection]);

	// Memoized table configuration
	const table = useReactTable({
		data: blogs,
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
				onSearchChange={handleSearchChange}
				onStatusFilterChange={handleStatusFilterChange}
				onClearFilters={handleClearFilters}
				onBulkDelete={handleBulkDelete}
				isLoading={isLoading}
				table={table}
			/>

			<div className="overflow-hidden rounded-md border">
				<DataTable table={table} />
			</div>

			{blogsData?.pagination && (
				<DataTablePagination
					pagination={blogsData.pagination}
					currentDataLength={blogs.length}
					pageSize={pageSize}
					pageSizeOptions={PAGINATION_CONSTANTS.PAGE_SIZE_OPTIONS}
					onPageChange={handlePageChange}
					onPageSizeChange={handlePageSizeChange}
				/>
			)}

			{/* Bulk Delete Dialog */}
			<BlogsBulkDeleteDialog
				selectedBlogs={selectedBlogs}
				open={bulkDeleteDialogOpen}
				onOpenChange={setBulkDeleteDialogOpen}
				onSuccess={handleBulkDeleteSuccess}
			/>
		</div>
	);
};

export default BlogsTable;
