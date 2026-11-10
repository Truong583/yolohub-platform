import {Skeleton} from "@/components/ui/skeleton";

export function BlogCardSkeleton() {
	return (
		<article className="group overflow-hidden border border-gray-200 bg-white rounded-xl">
			{/* Thumbnail Skeleton */}
			<div className="relative aspect-[16/10] overflow-hidden">
				<Skeleton className="w-full h-full" />
				{/* Category Badge Skeleton */}
				<div className="absolute top-4 left-4">
					<Skeleton className="h-6 w-20 rounded-full" />
				</div>
			</div>

			{/* Content Skeleton */}
			<div className="p-6 space-y-4">
				{/* Meta Info Skeleton */}
				<div className="flex items-center space-x-4">
					<div className="flex items-center space-x-1">
						<Skeleton className="h-4 w-4" />
						<Skeleton className="h-4 w-24" />
					</div>
					<div className="flex items-center space-x-1">
						<Skeleton className="h-4 w-4" />
						<Skeleton className="h-4 w-16" />
					</div>
				</div>

				{/* Title Skeleton */}
				<div className="space-y-2">
					<Skeleton className="h-6 w-full" />
					<Skeleton className="h-6 w-3/4" />
				</div>

				{/* Excerpt Skeleton */}
				<div className="space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-2/3" />
				</div>

				{/* Author & Read More Skeleton */}
				<div className="flex items-center justify-between pt-4">
					{/* Author Skeleton */}
					<div className="flex items-center space-x-3">
						<Skeleton className="w-10 h-10 rounded-full" />
						<div className="space-y-1">
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-3 w-12" />
						</div>
					</div>

					{/* Read More Skeleton */}
					<Skeleton className="h-6 w-20" />
				</div>
			</div>
		</article>
	);
}
