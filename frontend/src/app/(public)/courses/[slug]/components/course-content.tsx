"use client";

import {useState} from "react";
import dynamic from "next/dynamic";
import type {IPublicCourse} from "@/types/course";

// Dynamic imports for client components
const CourseReviews = dynamic(() => import("./course-reviews"), {
	ssr: false, // Client-side component with user interactions
});

// Import lighter components statically
import CourseOverview from "./course-overview";
import CourseCurriculum from "./course-curriculum";
import EnrollmentCard from "./enrollment-card";
import {usePublicCourseChapters} from "@/hooks/use-chapters";

interface CourseContentProps {
	course: IPublicCourse;
}

const CourseContent = ({course}: CourseContentProps) => {
	const [activeTab, setActiveTab] = useState("overview");
	const {data: chapters = [], isLoading} = usePublicCourseChapters(course._id);

	return (
		<div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
			<div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 sm:gap-8">
				{/* Right Sidebar - Mobile (at top) */}
				<div className="lg:hidden">
					<EnrollmentCard
						course={course}
						lastLessonId={chapters[0]?.lessons?.[0]?._id || ""}
					/>
				</div>

				{/* Left Content */}
				<div className="lg:col-span-2 space-y-6 sm:space-y-8">
					{/* Course Overview */}
					<CourseOverview
						course={course}
						activeTab={activeTab}
						onTabChange={setActiveTab}
					/>

					{/* Course Curriculum */}
					<CourseCurriculum chapters={chapters} isLoading={isLoading} />

					{/* Reviews Section */}
					<CourseReviews
						courseTitle={course.title}
						courseId={course._id}
						fallbackAverageRating={course.averageRating || 0}
						fallbackTotalReviews={course.totalReviews || 0}
					/>
				</div>

				{/* Right Sidebar - Desktop (sticky) */}
				<div className="hidden lg:block lg:col-span-1">
					<div className="sticky top-24">
						<EnrollmentCard
							course={course}
							lastLessonId={chapters[0]?.lessons?.[0]?._id || ""}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CourseContent;
