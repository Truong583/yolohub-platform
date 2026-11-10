export const dynamic = "force-dynamic";

import FloatingButtons from "@/components/floating-buttons";
import {generateHomeMetadata} from "@/components/seo";
import BlogsService from "@/services/blogs";
import CoursesService from "@/services/courses";
import BlogSection from "./components/blog-section";
import FeaturedCoursesSection from "./components/featured-courses-section";
import HeroSection from "./components/hero-section";

// SEO Metadata for Home Page
export const metadata = generateHomeMetadata();

// Server-side data fetching function using existing services
async function fetchHomePageData() {
	const [coursesData, blogsData] = await Promise.all([
		CoursesService.getPublicCourses({limit: 6}),

		BlogsService.getPublishedBlogs({limit: 4, page: 1}),
	]);

	return {
		courses: coursesData,
		blogs: blogsData,
	};
}

// Home page - Server Component with SSR
const HomePage = async () => {
	// Fetch data on server side
	const {courses, blogs} = await fetchHomePageData();

	return (
		<>
			<HeroSection />
			<FeaturedCoursesSection coursesData={courses} />
			<BlogSection blogsData={blogs} />
			<FloatingButtons telegramUrl="https://t.me/yolo7phan" />
		</>
	);
};

export default HomePage;
