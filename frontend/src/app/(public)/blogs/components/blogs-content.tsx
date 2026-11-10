"use client";

import {useState} from "react";
import * as React from "react";
import {BookOpen} from "lucide-react";
import {Button} from "@/components/ui/button";

import {usePublishedBlogs} from "@/hooks/use-blogs";
import {IBlog} from "@/types/blog";
import {BlogCardSkeleton} from "@/components/blog/blog-card-skeleton";
import {BlogCard} from "@/components/blog/blog-card";

// Blogs content component - Arrow function
const BlogsContent = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [allBlogs, setAllBlogs] = useState<IBlog[]>([]);

	// Fetch blogs
	const {data: blogsData, isLoading} = usePublishedBlogs({
		page: currentPage,
		limit: 12,
	});

	const pagination = blogsData?.pagination;

	// Update allBlogs when new data comes in
	React.useEffect(() => {
		if (blogsData?.blogs) {
			if (currentPage === 1) {
				// Reset for first load
				setAllBlogs(blogsData.blogs);
			} else {
				// Append for load more
				setAllBlogs((prev) => [...prev, ...blogsData.blogs]);
			}
		}
	}, [blogsData, currentPage]);

	// Handle load more - Arrow function
	const handleLoadMore = () => {
		setCurrentPage((prev) => prev + 1);
	};

	return (
		<>
			{/* Blog Grid/List */}
			{isLoading && currentPage === 1 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
					{Array.from({length: 12}, (_, i) => (
						<BlogCardSkeleton key={i} />
					))}
				</div>
			) : allBlogs.length > 0 ? (
				<>
					{/* Blog Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
						{allBlogs.map((blog) => (
							<BlogCard key={blog._id} post={blog} />
						))}

						{/* Load More Skeletons */}
						{isLoading &&
							currentPage > 1 &&
							Array.from({length: 12}, (_, i) => (
								<BlogCardSkeleton key={`loading-${i}`} />
							))}
					</div>

					{/* Load More Button */}
					{pagination && pagination.hasNextPage && !isLoading && (
						<div className="flex justify-center">
							<Button
								variant="outline"
								size="lg"
								onClick={handleLoadMore}
								className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base h-10 sm:h-12"
							>
								Load More Articles
							</Button>
						</div>
					)}

					{/* End of Results Message */}
					{pagination && !pagination.hasNextPage && allBlogs.length > 0 && (
						<div className="text-center py-6 sm:py-8">
							<p className="text-gray-500 text-xs sm:text-sm">
								You&apos;ve reached the end of all articles
							</p>
						</div>
					)}
				</>
			) : (
				<div className="text-center py-12 sm:py-16 md:py-20 px-4">
					<BookOpen className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
					<h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1.5 sm:mb-2">
						No articles found
					</h3>
					<p className="text-sm sm:text-base text-gray-600">
						Check back later for new articles and insights.
					</p>
				</div>
			)}
		</>
	);
};

export default BlogsContent;
