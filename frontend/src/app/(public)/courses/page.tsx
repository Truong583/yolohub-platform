export const dynamic = "force-dynamic";

import CoursesService from "@/services/courses";

import CoursesContent from "./components/courses-content";
import CoursesHeader from "./components/courses-header";

// Server-side data fetching function
async function fetchInitialCoursesData() {
	try {
		const coursesData = await CoursesService.getPublicCourses({
			page: 1,
			limit: 10,
			sortBy: "newest",
			sortOrder: "desc",
		});
		return coursesData;
	} catch {
		return {
			courses: [],
			pagination: {
				page: 1,
				limit: 10,
				total: 0,
				totalPages: 0,
				hasNextPage: false,
				hasPrevPage: false,
			},
		};
	}
}

const CoursesPage = async () => {
	// Fetch initial courses data on server side
	const initialCoursesData = await fetchInitialCoursesData();

	return (
		<>
			{/* Header */}
			<CoursesHeader />

			{/* Pass initial data to client component for filtering and pagination */}
			<CoursesContent initialCoursesData={initialCoursesData} />
		</>
	);
};

export default CoursesPage;
