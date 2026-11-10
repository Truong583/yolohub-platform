"use client";

import {ChevronRight, Home} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {BreadcrumbStructuredData} from "./structured-data";

interface BreadcrumbItem {
	name: string;
	href: string;
	current?: boolean;
}

interface BreadcrumbsProps {
	items?: BreadcrumbItem[];
	className?: string;
}

export function Breadcrumbs({items, className = ""}: BreadcrumbsProps) {
	const pathname = usePathname();

	// Generate breadcrumbs from pathname if items not provided
	const breadcrumbs = items || generateBreadcrumbsFromPath(pathname);

	if (breadcrumbs.length <= 1) return null;

	// Prepare structured data
	const structuredDataItems = breadcrumbs.map((item) => ({
		name: item.name,
		url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}${item.href}`,
	}));

	return (
		<>
			{/* Structured Data for SEO */}
			<BreadcrumbStructuredData items={structuredDataItems} />

			{/* Visual Breadcrumbs */}
			<nav aria-label="Breadcrumb" className={`flex ${className}`}>
				<ol className="flex items-center space-x-2">
					{breadcrumbs.map((item, index) => (
						<li key={item.href} className="flex items-center">
							{index > 0 && (
								<ChevronRight
									className="h-4 w-4 text-gray-400 mx-2"
									aria-hidden="true"
								/>
							)}

							{item.current ? (
								<span
									className="text-sm font-medium text-gray-900 dark:text-gray-100"
									aria-current="page"
								>
									{index === 0 && <Home className="h-4 w-4 mr-1 inline" />}
									{item.name}
								</span>
							) : (
								<Link
									href={item.href}
									className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
								>
									{index === 0 && <Home className="h-4 w-4 mr-1 inline" />}
									{item.name}
								</Link>
							)}
						</li>
					))}
				</ol>
			</nav>
		</>
	);
}

function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
	const pathSegments = pathname.split("/").filter(Boolean);
	const breadcrumbs: BreadcrumbItem[] = [{name: "Home", href: "/"}];

	let currentPath = "";

	pathSegments.forEach((segment, index) => {
		currentPath += `/${segment}`;
		const isLast = index === pathSegments.length - 1;

		// Convert slug to readable name
		const name = segment
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");

		breadcrumbs.push({
			name,
			href: currentPath,
			current: isLast,
		});
	});

	return breadcrumbs;
}

// Pre-built breadcrumb configurations for common pages
export const BREADCRUMB_CONFIGS = {
	courses: (courseName?: string, courseSlug?: string) => [
		{name: "Home", href: "/"},
		{name: "Courses", href: "/courses"},
		...(courseName && courseSlug
			? [{name: courseName, href: `/courses/${courseSlug}`, current: true}]
			: []),
	],

	blogs: (blogTitle?: string, blogSlug?: string) => [
		{name: "Home", href: "/"},
		{name: "Blog", href: "/blogs"},
		...(blogTitle && blogSlug
			? [{name: blogTitle, href: `/blogs/${blogSlug}`, current: true}]
			: []),
	],

	learning: (
		courseName?: string,
		courseSlug?: string,
		lessonTitle?: string
	) => [
		{name: "Home", href: "/"},
		{name: "My Learning", href: "/learning"},
		...(courseName && courseSlug
			? [{name: courseName, href: `/learning/${courseSlug}`}]
			: []),
		...(lessonTitle ? [{name: lessonTitle, href: "#", current: true}] : []),
	],

	profile: (pageName?: string) => [
		{name: "Home", href: "/"},
		{name: "My Profile", href: "/my-profile"},
		...(pageName ? [{name: pageName, href: "#", current: true}] : []),
	],

	admin: (section?: string, itemName?: string) => [
		{name: "Home", href: "/"},
		{name: "Admin", href: "/admin"},
		...(section
			? [{name: section, href: `/admin/${section.toLowerCase()}`}]
			: []),
		...(itemName ? [{name: itemName, href: "#", current: true}] : []),
	],
};
