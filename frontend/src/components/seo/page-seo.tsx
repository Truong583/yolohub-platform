import {Metadata} from "next";
import {generateMetadata} from "./seo-head";
import {PAGE_SEO, SEO_TEMPLATES} from "@/configs/seo";

// Home page SEO - Use the default title directly to avoid duplication
export function generateHomeMetadata(): Metadata {
	return generateMetadata({
		title: "", // Empty title means use default title without template
		description: PAGE_SEO.home.description,
		canonical: "/",
		openGraph: {
			type: "website",
			title: PAGE_SEO.home.title, // Use page title for OpenGraph
			description: PAGE_SEO.home.description,
		},
	});
}

// About page SEO
export function generateAboutMetadata(): Metadata {
	return generateMetadata({
		title: PAGE_SEO.about.title,
		description: PAGE_SEO.about.description,
		canonical: "/about",
		openGraph: {
			type: "website",
			title: PAGE_SEO.about.title,
			description: PAGE_SEO.about.description,
		},
	});
}

// Courses page SEO
export function generateCoursesMetadata(): Metadata {
	return generateMetadata({
		title: PAGE_SEO.courses.title,
		description: PAGE_SEO.courses.description,
		canonical: "/courses",
		openGraph: {
			type: "website",
			title: PAGE_SEO.courses.title,
			description: PAGE_SEO.courses.description,
		},
	});
}

// Blog page SEO
export function generateBlogMetadata(): Metadata {
	return generateMetadata({
		title: PAGE_SEO.blog.title,
		description: PAGE_SEO.blog.description,
		canonical: "/blogs",
		openGraph: {
			type: "website",
			title: PAGE_SEO.blog.title,
			description: PAGE_SEO.blog.description,
		},
	});
}

// Contact page SEO
export function generateContactMetadata(): Metadata {
	return generateMetadata({
		title: PAGE_SEO.contact.title,
		description: PAGE_SEO.contact.description,
		canonical: "/contact",
		openGraph: {
			type: "website",
			title: PAGE_SEO.contact.title,
			description: PAGE_SEO.contact.description,
		},
	});
}

// Cart page SEO
export function generateCartMetadata(): Metadata {
	return generateMetadata({
		title: "Shopping Cart - Complete Your Course Purchase",
		description:
			"Review your selected courses and complete your purchase. Secure checkout with lifetime access to your courses.",
		canonical: "/cart",
		openGraph: {
			type: "website",
			title: "Shopping Cart - Complete Your Course Purchase",
			description: "Review your selected courses and complete your purchase.",
		},
		noIndex: true, // Cart pages should not be indexed
	});
}

// Profile page SEO
export function generateProfileMetadata(): Metadata {
	return generateMetadata({
		title: "My Profile - Manage Your Learning Journey",
		description:
			"Manage your YoloHub profile, track your course progress, view certificates, and customize your learning experience.",
		canonical: "/my-profile",
		openGraph: {
			type: "profile",
			title: "My Profile - Manage Your Learning Journey",
			description:
				"Manage your YoloHub profile and track your course progress.",
		},
		noIndex: true, // Profile pages should not be indexed
	});
}

// Individual course page SEO
export function generateCourseMetadata(course: {
	title: string;
	description: string;
	slug: string;
	thumbnail?: string;
	instructor?: {name: string};
	level?: string;
	category?: string;
}): Metadata {
	const title = SEO_TEMPLATES.course.title.replace("%s", course.title);
	const description =
		course.description.slice(0, 160) +
		(course.description.length > 160 ? "..." : "");

	const keywords = [
		course.title.toLowerCase(),
		`${course.title.toLowerCase()} course`,
		"online course",
		"learn " + course.title.toLowerCase(),
	];

	if (course.category) {
		keywords.push(course.category.toLowerCase());
	}

	if (course.instructor) {
		keywords.push(course.instructor.name.toLowerCase());
	}

	if (course.level) {
		keywords.push(`${course.level.toLowerCase()} level`);
	}

	return generateMetadata({
		title,
		description,
		keywords,
		canonical: `/courses/${course.slug}`,
		openGraph: {
			type: "article",
			title,
			description,
			image: course.thumbnail,
		},
	});
}

// Individual blog post SEO
export function generateBlogPostMetadata(blog: {
	title: string;
	description: string;
	slug: string;
	thumbnail?: string;
	author?: {name: string};
	createdAt: string;
	tags?: string[];
}): Metadata {
	const title = SEO_TEMPLATES.blog.title.replace("%s", blog.title);
	const description =
		blog.description.slice(0, 160) +
		(blog.description.length > 160 ? "..." : "");

	const keywords = [
		blog.title.toLowerCase(),
		"education blog",
		"learning tips",
	];

	if (blog.tags) {
		keywords.push(...blog.tags.map((tag) => tag.toLowerCase()));
	}

	if (blog.author) {
		keywords.push(blog.author.name.toLowerCase());
	}

	return generateMetadata({
		title,
		description,
		keywords,
		canonical: `/blogs/${blog.slug}`,
		openGraph: {
			type: "article",
			title,
			description,
			image: blog.thumbnail,
		},
		twitter: {
			title,
			description,
			image: blog.thumbnail,
		},
	});
}

// Learning page SEO (protected)
export function generateLearningMetadata(course: {
	title: string;
	slug: string;
}): Metadata {
	return generateMetadata({
		title: `Learning: ${course.title}`,
		description: `Continue learning ${course.title}. Access your course materials, track progress, and complete lessons.`,
		canonical: `/learning/${course.slug}`,
		noIndex: true, // Learning pages should not be indexed
		noFollow: true,
		openGraph: {
			type: "website",
			title: `Learning: ${course.title}`,
			description: `Continue learning ${course.title}`,
		},
	});
}

// Search results SEO
export function generateSearchMetadata(query?: string): Metadata {
	const title = query
		? `Search Results for "${query}" | YoloHub`
		: "Search Courses and Blogs | YoloHub";

	const description = query
		? `Find courses and blog posts related to "${query}". Discover relevant learning content and educational resources.`
		: "Search through our extensive library of courses and educational blog posts. Find the perfect learning content for your needs.";

	return generateMetadata({
		title,
		description,
		canonical: `/search${query ? `?q=${encodeURIComponent(query)}` : ""}`,
		keywords: query
			? [query, "search", "courses", "blogs"]
			: ["search", "courses", "blogs"],
		noIndex: !query, // Only index search results with queries
		openGraph: {
			type: "website",
			title,
			description,
		},
	});
}

// Category page SEO
export function generateCategoryMetadata(category: {
	name: string;
	description?: string;
	slug: string;
}): Metadata {
	const title = `${category.name} Courses | YoloHub`;
	const description =
		category.description ||
		`Explore ${
			category.name
		} courses on YoloHub. Learn from expert instructors and advance your skills in ${category.name.toLowerCase()}.`;

	return generateMetadata({
		title,
		description,
		keywords: [
			category.name.toLowerCase(),
			`${category.name.toLowerCase()} courses`,
			"online learning",
		],
		canonical: `/categories/${category.slug}`,
		openGraph: {
			type: "website",
			title,
			description,
		},
	});
}
