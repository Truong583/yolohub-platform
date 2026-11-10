export const dynamic = "force-dynamic";

import {notFound} from "next/navigation";
import dynamicImport from "next/dynamic";
import CoursesService from "@/services/courses";
import CourseContent from "./components/course-content";

// Dynamic imports for heavy components
const CourseHero = dynamicImport(() => import("./components/course-hero")); // Can be SSR

const RelatedCourses = dynamicImport(
	() => import("./components/related-courses")
); // Can be SSR

interface CourseDetailPageProps {
	params: Promise<{
		slug: string;
	}>;
}

// Server-side data fetching function
async function fetchCourseData(slug: string) {
	try {
		const course = await CoursesService.getPublicCourseBySlug(slug);
		return course;
	} catch {
		return null;
	}
}

const CourseDetailPage = async ({params}: CourseDetailPageProps) => {
	const resolvedParams = await params;

	// Fetch course data on server side
	const course = await fetchCourseData(resolvedParams.slug);

	// If course not found, trigger Next.js not-found page
	if (!course) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Course Hero Section */}
			<CourseHero course={course} />

			{/* Main Content - Pass course data to client component */}
			<CourseContent course={course} />

			{/* Related Courses */}
			<RelatedCourses currentCourseId={course._id} />
		</div>
	);
};

export default CourseDetailPage;
