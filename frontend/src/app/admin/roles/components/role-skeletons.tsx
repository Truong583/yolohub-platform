import {Skeleton} from "@/components/ui/skeleton";

export const RoleCardSkeleton = () => (
	<div className="border rounded-lg shadow-sm bg-card">
		<div className="p-6 pb-3">
			{/* Header */}
			<div className="flex items-start justify-between gap-3">
				<div className="flex items-start gap-3 flex-1">
					<Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
					<div className="space-y-2 flex-1">
						<Skeleton className="h-5 w-32" />
						<div className="flex items-center gap-2">
							<Skeleton className="h-4 w-14" />
							<div className="h-1 w-1 bg-muted-foreground/40 rounded-full" />
							<Skeleton className="h-3 w-20" />
						</div>
					</div>
				</div>
				<Skeleton className="h-8 w-8 rounded flex-shrink-0" />
			</div>
		</div>

		<div className="px-6 pb-6 space-y-4">
			{/* Description */}
			<div className="space-y-2">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-2/3" />
			</div>

			{/* Permissions */}
			<div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
				<Skeleton className="h-4 w-20" />
				<Skeleton className="h-5 w-8 rounded-full" />
			</div>

			{/* Inherited Roles */}
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-4 w-4 rounded" />
				</div>
				<div className="flex flex-wrap gap-1.5">
					<Skeleton className="h-5 w-16 rounded-full" />
					<Skeleton className="h-5 w-20 rounded-full" />
				</div>
			</div>
		</div>
	</div>
);

export const RoleListSkeleton = () => (
	<div className="border rounded-lg p-4">
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-4">
				<Skeleton className="h-10 w-10 rounded-lg" />
				<div className="space-y-2">
					<Skeleton className="h-5 w-24" />
					<Skeleton className="h-4 w-16" />
				</div>
			</div>
			<div className="flex items-center gap-4">
				<div className="space-y-1">
					<Skeleton className="h-4 w-20" />
				</div>
				<div className="space-y-1">
					<Skeleton className="h-4 w-16" />
					<Skeleton className="h-4 w-20" />
				</div>
				<Skeleton className="h-8 w-8 rounded" />
			</div>
		</div>
	</div>
);

interface RolesSkeletonProps {
	view: "grid" | "list";
	count?: number;
}

const RolesSkeleton = ({view, count}: RolesSkeletonProps) => {
	const gridCount = count || 6;
	const listCount = count || 5;

	if (view === "grid") {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{Array.from({length: gridCount}).map((_, i) => (
					<RoleCardSkeleton key={i} />
				))}
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{Array.from({length: listCount}).map((_, i) => (
				<RoleListSkeleton key={i} />
			))}
		</div>
	);
};

export default RolesSkeleton;
