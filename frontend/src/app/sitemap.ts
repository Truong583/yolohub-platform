import {SEO_CONFIG} from "@/configs/seo";
import {MetadataRoute} from "next";
import CoursesService from "@/services/courses";
import BlogsService from "@/services/blogs";

// Define your static routes and their priorities
const STATIC_ROUTES = [
	{path: "", priority: 1.0, changeFrequency: "daily" as const}, // Home page
	{path: "about", priority: 0.8, changeFrequency: "monthly" as const},
	{path: "courses", priority: 0.9, changeFrequency: "weekly" as const},
	{path: "blogs", priority: 0.8, changeFrequency: "weekly" as const},
	{path: "contact", priority: 0.6, changeFrequency: "monthly" as const},
];

// Function to fetch dynamic routes from your API/database
async function getDynamicRoutes() {
	try {
		// Fetch courses and blogs in parallel using existing services
		const [coursesData, blogsData] = await Promise.all([
			CoursesService.getPublicCourses({limit: 1000}), // Get all public courses for sitemap
			BlogsService.getPublishedBlogs({limit: 1000, page: 1}), // Get all published blogs for sitemap
		]);

		return {
			courses: coursesData.courses || [],
			blogs: blogsData.blogs || [],
		};
	} catch (error) {
		console.error("Error fetching dynamic routes for sitemap:", error);
		return {courses: [], blogs: []};
	}
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const {courses, blogs} = await getDynamicRoutes();
	const currentDate = new Date();

	// Static routes
	const staticUrls: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
		url: `${SEO_CONFIG.siteUrl}/${route.path}`,
		lastModified: currentDate,
		changeFrequency: route.changeFrequency,
		priority: route.priority,
	}));

	// Dynamic course URLs
	const courseUrls: MetadataRoute.Sitemap = courses.map((course) => ({
		url: `${SEO_CONFIG.siteUrl}/courses/${course.slug}`,
		lastModified: course.updatedAt || course.createdAt || currentDate,
		changeFrequency: "monthly" as const,
		priority: 0.8,
	}));

	// Dynamic blog URLs
	const blogUrls: MetadataRoute.Sitemap = blogs.map((blog) => ({
		url: `${SEO_CONFIG.siteUrl}/blogs/${blog.slug}`,
		lastModified: new Date(blog.updatedAt || blog.createdAt || currentDate),
		changeFrequency: "monthly" as const,
		priority: 0.7,
	}));

	// Combine all URLs
	return [...staticUrls, ...courseUrls, ...blogUrls];
}
