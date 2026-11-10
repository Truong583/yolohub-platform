import {Cross2Icon} from "@radix-ui/react-icons";
import {IconTrash} from "@tabler/icons-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {DataTableFacetedFilter, DataTableViewOptions} from "@/components/table";
import {Table} from "@tanstack/react-table";
import {FILTER_OPTIONS} from "@/constants";

interface DataTableToolbarProps<TData> {
	searchValue: string;
	statusFilter: string[];
	onSearchChange: (value: string) => void;
	onStatusFilterChange: (values: string[]) => void;
	onClearFilters: () => void;
	isLoading?: boolean;
	table: Table<TData>;
	onBulkDelete?: () => void;
}

const DataTableToolbar = <TData,>({
	searchValue,
	statusFilter,
	onSearchChange,
	onStatusFilterChange,
	onClearFilters,
	isLoading = false,
	table,
	onBulkDelete,
}: DataTableToolbarProps<TData>) => {
	const isFiltered = searchValue !== "" || statusFilter.length > 0;
	const selectedRows = table.getFilteredSelectedRowModel().rows;
	const hasSelectedRows = selectedRows.length > 0;

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
				<Input
					placeholder="Filter blogs..."
					value={searchValue}
					onChange={(event) => onSearchChange(event.target.value)}
					className="h-8 w-[150px] lg:w-[250px]"
					disabled={isLoading}
				/>
				<div className="flex gap-x-2">
					<DataTableFacetedFilter
						title="Status"
						options={FILTER_OPTIONS.BLOG_STATUS}
						selectedValues={statusFilter}
						onSelectionChange={onStatusFilterChange}
						disabled={isLoading}
					/>
				</div>
				{isFiltered && (
					<Button
						variant="ghost"
						onClick={onClearFilters}
						className="h-8 px-2 lg:px-3"
						disabled={isLoading}
					>
						Reset
						<Cross2Icon className="ml-2 h-4 w-4" />
					</Button>
				)}
			</div>

			<div className="flex items-center gap-2">
				{/* Bulk Actions */}
				{hasSelectedRows && (
					<>
						<Button
							variant="outline"
							size="sm"
							onClick={onBulkDelete}
							disabled={isLoading}
							className="text-destructive h-8 hover:text-destructive border-destructive/20 hover:border-destructive/30"
						>
							<IconTrash className="mr-2 h-4 w-4" />
							Delete {selectedRows.length}{" "}
							{selectedRows.length === 1 ? "blog" : "blogs"}
						</Button>
					</>
				)}
				<DataTableViewOptions table={table} />
			</div>
		</div>
	);
};

export default DataTableToolbar;
