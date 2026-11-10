import Link from "next/link";
import {BlogCard} from "../../../../components/blog/blog-card";
import {ArrowRight, BookOpen} from "lucide-react";
import {ROUTE_CONFIG} from "@/configs/routes";
import type {BlogsListResponse} from "@/types/blog";

interface BlogSectionProps {
	blogsData: BlogsListResponse;
}

// Blog section component - Arrow function
const BlogSection = ({blogsData}: BlogSectionProps) => {
	const blogs = blogsData?.blogs || [];

	return (
		<section className="py-12 sm:py-16 md:py-20 lg:py-20 bg-white">
			<div className="container mx-auto px-4 sm:px-6 ">
				{/* Section Header */}
				<div className="text-center mb-10 sm:mb-12 md:mb-16">
					{/* Badge */}
					<div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-3 sm:px-4 py-2 rounded-full mb-3 sm:mb-4">
						<BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
						<span className="text-xs sm:text-sm font-medium">
							Latest Articles
						</span>
					</div>

					{/* Main Title */}
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
						From Our Blog
					</h2>
					<p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
						Stay updated with the latest insights, tutorials, and industry news
						from our team of experts.
					</p>

					{/* Quick Stats */}
					<div className="grid grid-cols-3 gap-4 sm:flex sm:items-center sm:justify-center sm:space-x-8 sm:gap-0 mt-6 sm:mt-8 max-w-lg sm:max-w-none mx-auto">
						<div className="text-center">
							<div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
								9,000+
							</div>
							<div className="text-xs sm:text-sm text-gray-500 leading-tight">
								Articles Published
							</div>
						</div>
						<div className="text-center">
							<div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
								5,000+
							</div>
							<div className="text-xs sm:text-sm text-gray-500 leading-tight">
								Monthly Readers
							</div>
						</div>
						<div className="text-center">
							<div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">
								12
							</div>
							<div className="text-xs sm:text-sm text-gray-500 leading-tight">
								Expert Authors
							</div>
						</div>
					</div>
				</div>

				{/* View All Link */}
				<div className="flex justify-center sm:justify-end mb-4 sm:mb-6 px-4 sm:px-0">
					<Link
						href={ROUTE_CONFIG.BLOGS}
						className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm sm:text-base group"
					>
						View All Posts
						<ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-300" />
					</Link>
				</div>

				{/* Blog Grid */}
				{blogs.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
						{blogs.map((post) => (
							<BlogCard key={post._id} post={post} />
						))}
					</div>
				) : (
					<div className="text-center py-8 sm:py-12 px-4">
						<div className="max-w-md mx-auto">
							<div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
							</div>
							<h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
								No Blog Posts Available
							</h3>
							<p className="text-sm sm:text-base text-gray-600">
								Check back later for new articles and insights from our team of
								experts.
							</p>
						</div>
					</div>
				)}
			</div>
		</section>
	);
};

export default BlogSection;
