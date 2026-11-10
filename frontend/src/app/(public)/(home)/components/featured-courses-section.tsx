import {CourseCard} from "@/components/course/course-card";
import {ROUTE_CONFIG} from "@/configs/routes";
import type {IPublicCourse, PublicCoursesListResponse} from "@/types/course";
import {ArrowRight, TrendingUp} from "lucide-react";
import Link from "next/link";

interface FeaturedCoursesSectionProps {
	coursesData: PublicCoursesListResponse;
}

// Featured courses section component - Arrow function
const FeaturedCoursesSection = ({coursesData}: FeaturedCoursesSectionProps) => {
	// Get featured courses from props
	const featuredCourses = coursesData?.courses || [];

	return (
		<section className="py-12 sm:py-16 md:py-20 lg:py-20 bg-gray-50">
			<div className="container mx-auto px-4 sm:px-6 ">
				{/* Section Header */}
				<div className="text-center mb-8 sm:mb-10 lg:mb-12">
					{/* Badge */}
					<div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 sm:px-4 py-2 rounded-full mb-3 sm:mb-4">
						<TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
						<span className="text-xs sm:text-sm font-medium">Most Popular</span>
					</div>

					{/* Main Title */}
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
						Featured Courses
					</h2>
					<p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
						Discover our most popular and highly-rated courses, carefully
						selected to help you master in-demand skills and advance your
						career.
					</p>
				</div>

				{/* View All Link */}
				<div className="flex justify-center sm:justify-end mb-4 sm:mb-6 px-4 sm:px-0">
					<Link
						href={ROUTE_CONFIG.COURSES}
						className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm sm:text-base group"
					>
						View All Courses
						<ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-300" />
					</Link>
				</div>

				{/* Courses Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
					{featuredCourses.length > 0 ? (
						featuredCourses.map((course: IPublicCourse) => (
							<CourseCard key={course._id} course={course} />
						))
					) : (
						<div className="col-span-full text-center py-8 sm:py-12 px-4">
							<div className="max-w-md mx-auto">
								<div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
									<TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
								</div>
								<h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
									No Courses Available
								</h3>
								<p className="text-sm sm:text-base text-gray-600">
									No featured courses available at the moment. Check back soon
									for new content!
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

export default FeaturedCoursesSection;
