"use client";

import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {CalendarDays, Clock, User, ArrowLeft} from "lucide-react";

// Extend dayjs with relativeTime plugin
dayjs.extend(relativeTime);
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {ROUTE_CONFIG} from "@/configs/routes";
import {IBlog} from "@/types/blog";
import {DEFAULT_AVATAR} from "@/constants";

interface BlogHeaderProps {
	blog: IBlog;
}

// Blog header component (above-the-fold, critical) - Arrow function
const BlogHeader = ({blog}: BlogHeaderProps) => {
	const formatDate = (dateString: string) => {
		const date = dayjs(dateString);
		const now = dayjs();
		const diffDays = now.diff(date, "day");

		// Show relative time for recent posts (within 7 days)
		if (diffDays < 7) {
			return date.fromNow();
		}

		// Show formatted date for older posts
		return date.format("MMMM D, YYYY");
	};

	const calculateReadTime = (content: string) => {
		const wordsPerMinute = 200;
		const wordCount = content.replace(/<[^>]*>/g, "").split(" ").length;
		const readTime = Math.ceil(wordCount / wordsPerMinute);
		return `${readTime} min`;
	};

	return (
		<>
			{/* Back to Blog */}
			<div className="mb-6 sm:mb-8">
				<Link href={ROUTE_CONFIG.BLOGS} aria-label="Back to all blog posts">
					<Button
						variant="ghost"
						className="pl-0 h-9 sm:h-10 text-sm sm:text-base"
					>
						<ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
						Back to Blog
					</Button>
				</Link>
			</div>

			{/* Article Header */}
			<header
				className="mb-8 sm:mb-10 md:mb-12"
				itemScope
				itemType="https://schema.org/BlogPosting"
			>
				{/* Category */}
				<div className="flex justify-center mb-4 sm:mb-6">
					<Badge
						className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs sm:text-sm px-2.5 sm:px-3 py-1"
						itemProp="articleSection"
					>
						{blog.category?.name || "Uncategorized"}
					</Badge>
				</div>

				{/* Title */}
				<h1
					className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 text-center leading-tight px-4"
					itemProp="headline"
				>
					{blog.title}
				</h1>

				{/* Excerpt */}
				{blog.excerpt && (
					<p
						className="text-base sm:text-lg md:text-xl text-gray-600 text-center mb-6 sm:mb-8 leading-relaxed px-4"
						itemProp="description"
					>
						{blog.excerpt}
					</p>
				)}

				{/* Meta Information */}
				<div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 px-4">
					<div className="flex items-center space-x-1.5 sm:space-x-2">
						<CalendarDays
							className="h-3.5 w-3.5 sm:h-4 sm:w-4"
							aria-hidden="true"
						/>
						<time
							dateTime={blog.publishedAt || blog.createdAt}
							itemProp="datePublished"
						>
							{formatDate(blog.publishedAt || blog.createdAt)}
						</time>
					</div>
					<div className="flex items-center space-x-1.5 sm:space-x-2">
						<Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
						<span itemProp="timeRequired">
							{calculateReadTime(blog.content)} read
						</span>
					</div>
					<div className="flex items-center space-x-1.5 sm:space-x-2">
						<User className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
						<span
							itemProp="author"
							itemScope
							itemType="https://schema.org/Person"
						>
							<span itemProp="name">
								{blog.author?.username || blog.author?.name || "Anonymous"}
							</span>
						</span>
					</div>
				</div>

				{/* Author Info */}
				<div
					className="flex justify-center items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8"
					itemProp="author"
					itemScope
					itemType="https://schema.org/Person"
				>
					<div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden">
						<Image
							src={blog.author?.avatar || DEFAULT_AVATAR}
							alt={blog.author?.username || "Author"}
							fill
							className="object-cover"
							itemProp="image"
						/>
					</div>
					<div className="text-center">
						<p
							className="font-medium text-sm sm:text-base text-gray-900"
							itemProp="name"
						>
							{blog.author?.username || blog.author?.name || "Anonymous"}
						</p>
						<p className="text-xs sm:text-sm text-gray-500">Author</p>
					</div>
				</div>
			</header>
		</>
	);
};

export default BlogHeader;
