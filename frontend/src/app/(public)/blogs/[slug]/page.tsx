"use client";

import * as React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {ArrowLeft} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useBlogBySlug} from "@/hooks/use-blogs";
import {BlogPostSkeleton} from "@/components/blog/blog-post-skeleton";
import {ROUTE_CONFIG} from "@/configs/routes";

interface BlogPostPageProps {
	params: Promise<{slug: string}>;
}

// Static import for above-the-fold critical content
import BlogHeader from "./components/blog-header";

// Dynamic import for heavy content section
const BlogContent = dynamic(() => import("./components/blog-content"));

// Main blog post page - Arrow function
const BlogPostPage = ({params}: BlogPostPageProps) => {
	const resolvedParams = React.use(params);

	const {data: blog, isLoading} = useBlogBySlug(resolvedParams.slug);

	if (isLoading || !resolvedParams.slug) {
		return <BlogPostSkeleton />;
	}

	if (!blog) {
		return (
			<div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
				<div className="max-w-4xl mx-auto text-center">
					<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
						Blog Post Not Found
					</h1>
					<p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 px-4">
						The blog post you&apos;re looking for doesn&apos;t exist or has been
						removed.
					</p>
					<Link href={ROUTE_CONFIG.BLOGS}>
						<Button className="h-10 sm:h-11 text-sm sm:text-base">
							<ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
							Back to Blog
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
				<div className="max-w-4xl mx-auto">
					{/* Critical above-the-fold content - loads immediately */}
					<BlogHeader blog={blog} />

					{/* Below-the-fold content - progressive loading */}
					<BlogContent blog={blog} />
				</div>
			</div>
		</div>
	);
};

export default BlogPostPage;
