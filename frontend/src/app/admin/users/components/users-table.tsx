import {DataTable, DataTablePagination} from "@/components/table";
import {PAGINATION_CONSTANTS, TABLE_CONSTANTS, SortOrder} from "@/constants";
import {useDebounce} from "@/hooks/use-debounce";
import {useUsers} from "@/hooks/use-users";
import {
	getCoreRowModel,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";
import {useCallback, useEffect, useMemo, useState} from "react";
import DataTableToolbar from "./data-table-toolbar";
import UsersBulkDeleteDialog from "./users-bulk-delete-dialog";
import {usersColumns} from "./users-columns";

// Filter state interface for better organization
interface FilterState {
	search: string;
	status: string[];
	userType: string[];
	sortBy: string;
	sortOrder: SortOrder;
}

const UsersTable = () => {
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
		userType: [],
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
			userType: filters.userType,
			sortBy: filters.sortBy,
			sortOrder: filters.sortOrder,
		}),
		[
			currentPage,
			pageSize,
			debouncedSearch,
			filters.status,
			filters.userType,
			filters.sortBy,
			filters.sortOrder,
		]
	);

	const {data: usersData, isLoading} = useUsers(queryParams);

	// Reset to first page when filters change (optimized dependencies)
	useEffect(() => {
		setCurrentPage(PAGINATION_CONSTANTS.DEFAULT_PAGE);
	}, [
		debouncedSearch,
		filters.status,
		filters.userType,
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

	const handleUserTypeFilterChange = useCallback((userType: string[]) => {
		setFilters((prev) => ({...prev, userType}));
	}, []);

	const handleClearFilters = useCallback(() => {
		setFilters({
			search: "",
			status: [],
			userType: [],
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
		setCurrentPage(PAGINATION_CONSTANTS.DEFAULT_PAGE); // Reset to first page when page size changes
	}, []);

	const handleBulkDelete = useCallback(() => {
		setBulkDeleteDialogOpen(true);
	}, []);

	const handleBulkDeleteSuccess = useCallback(() => {
		setRowSelection({}); // Clear selection after successful delete
	}, []);

	// Memoized users data
	const users = useMemo(() => usersData?.users || [], [usersData?.users]);

	// Get selected users for bulk operations
	const selectedUsers = useMemo(() => {
		return users.filter((_, index) => rowSelection[index]);
	}, [users, rowSelection]);

	// Memoized table configuration
	const table = useReactTable({
		data: users,
		columns: usersColumns,
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
				userTypeFilter={filters.userType}
				onSearchChange={handleSearchChange}
				onStatusFilterChange={handleStatusFilterChange}
				onUserTypeFilterChange={handleUserTypeFilterChange}
				onClearFilters={handleClearFilters}
				onBulkDelete={handleBulkDelete}
				isLoading={isLoading}
				table={table}
			/>

			<div className="overflow-hidden rounded-md border">
				<DataTable table={table} />
			</div>

			{usersData?.pagination && (
				<DataTablePagination
					pagination={usersData.pagination}
					currentDataLength={users.length}
					pageSize={pageSize}
					pageSizeOptions={PAGINATION_CONSTANTS.PAGE_SIZE_OPTIONS}
					onPageChange={handlePageChange}
					onPageSizeChange={handlePageSizeChange}
				/>
			)}

			{/* Bulk Delete Dialog */}
			<UsersBulkDeleteDialog
				selectedUsers={selectedUsers}
				open={bulkDeleteDialogOpen}
				onOpenChange={setBulkDeleteDialogOpen}
				onSuccess={handleBulkDeleteSuccess}
			/>
		</div>
	);
};

export default UsersTable;
