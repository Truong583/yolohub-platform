import {Skeleton} from "@/components/ui/skeleton";

export function BlogPostSkeleton() {
	return (
		<div className="container mx-auto px-6 py-20">
			<div className="max-w-4xl mx-auto">
				{/* Header Skeleton */}
				<div className="mb-16">
					{/* Category Badge */}
					<div className="flex justify-center mb-4">
						<Skeleton className="h-6 w-32 rounded-full" />
					</div>

					{/* Title */}
					<div className="text-center space-y-4 mb-8">
						<Skeleton className="h-12 w-3/4 mx-auto" />
						<Skeleton className="h-12 w-1/2 mx-auto" />
					</div>

					{/* Meta Info */}
					<div className="flex justify-center items-center space-x-6 text-gray-500 mb-8">
						<div className="flex items-center space-x-2">
							<Skeleton className="h-4 w-4" />
							<Skeleton className="h-4 w-24" />
						</div>
						<div className="flex items-center space-x-2">
							<Skeleton className="h-4 w-4" />
							<Skeleton className="h-4 w-16" />
						</div>
					</div>

					{/* Author Info */}
					<div className="flex justify-center items-center space-x-3">
						<Skeleton className="w-12 h-12 rounded-full" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-3 w-24" />
						</div>
					</div>
				</div>

				{/* Featured Image */}
				<div className="mb-12">
					<Skeleton className="w-full h-96 rounded-lg" />
				</div>

				{/* Content Skeleton */}
				<div className="prose max-w-none space-y-4">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-5/6" />
					<Skeleton className="h-4 w-4/5" />
					<Skeleton className="h-4 w-full" />
					<br />
					<Skeleton className="h-4 w-3/4" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-2/3" />
					<br />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-4/5" />
					<Skeleton className="h-4 w-5/6" />
					<Skeleton className="h-4 w-1/2" />
				</div>
			</div>
		</div>
	);
}
