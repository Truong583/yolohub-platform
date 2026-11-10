import {Skeleton} from "@/components/ui/skeleton";

interface DataTableSkeletonProps {
	rows?: number;
	showToolbar?: boolean;
	showPagination?: boolean;
}

const DataTableSkeleton = ({
	rows = 5,
	showToolbar = true,
	showPagination = true,
}: DataTableSkeletonProps) => {
	return (
		<div className="space-y-4">
			{/* Toolbar skeleton */}
			{showToolbar && (
				<div className="flex items-center justify-between">
					<div className="flex flex-1 items-center space-x-2">
						<Skeleton className="h-8 w-[250px]" />
						<Skeleton className="h-8 w-[120px]" />
						<Skeleton className="h-8 w-[120px]" />
						<Skeleton className="h-8 w-[120px]" />
					</div>
					<Skeleton className="h-8 w-[70px]" />
				</div>
			)}

			{/* Table skeleton */}
			<div className="rounded-md border">
				{/* Table header */}
				<div className="border-b bg-muted/50 px-4 py-3">
					<div className="flex items-center space-x-4">
						<Skeleton className="h-4 w-4" />
						<Skeleton className="h-4 w-[100px]" />
						<Skeleton className="h-4 w-[120px]" />
						<Skeleton className="h-4 w-[80px]" />
						<Skeleton className="h-4 w-[100px]" />
						<Skeleton className="h-4 w-[80px]" />
					</div>
				</div>

				{/* Table rows */}
				{Array.from({length: rows}).map((_, i) => (
					<div key={i} className="border-b last:border-b-0 px-4 py-3">
						<div className="flex items-center space-x-4">
							<Skeleton className="h-4 w-4" />
							<div className="flex items-center space-x-3">
								<Skeleton className="h-10 w-10 rounded" />
								<Skeleton className="h-4 w-[150px]" />
							</div>
							<Skeleton className="h-6 w-[80px] rounded-full" />
							<Skeleton className="h-4 w-[60px]" />
							<Skeleton className="h-4 w-[80px]" />
							<Skeleton className="h-8 w-8 rounded" />
						</div>
					</div>
				))}
			</div>

			{/* Pagination skeleton */}
			{showPagination && (
				<div className="flex items-center justify-between">
					<Skeleton className="h-4 w-[100px]" />
					<div className="flex items-center space-x-2">
						<Skeleton className="h-8 w-8" />
						<Skeleton className="h-8 w-8" />
						<Skeleton className="h-4 w-[100px]" />
						<Skeleton className="h-8 w-8" />
						<Skeleton className="h-8 w-8" />
					</div>
				</div>
			)}
		</div>
	);
};

export default DataTableSkeleton;
