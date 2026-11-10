"use client";

import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {Button} from "@/components/ui/button";
import {ROUTE_CONFIG} from "@/configs/routes";
import {IBlog} from "@/types/blog";

interface BlogContentProps {
	blog: IBlog;
}

// Blog content component (below-the-fold) - Arrow function
const BlogContent = ({blog}: BlogContentProps) => {
	return (
		<>
			{/* Article Content */}
			<article className="max-w-none mb-8 sm:mb-10 md:mb-12">
				<div
					dangerouslySetInnerHTML={{__html: blog.content}}
					className="rich-content"
				/>
			</article>

			{/* Article Footer */}
			<footer className="mt-10 sm:mt-12 md:mt-16 pt-6 sm:pt-8 border-t border-gray-200">
				<div className="flex justify-center">
					<Link href={ROUTE_CONFIG.BLOGS} aria-label="Back to all blog posts">
						<Button
							variant="outline"
							size="lg"
							className="h-10 sm:h-12 text-sm sm:text-base px-6 sm:px-8"
						>
							<ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
							Back to All Articles
						</Button>
					</Link>
				</div>
			</footer>
		</>
	);
};

export default BlogContent;
