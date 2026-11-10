"use client";

import {CourseCard} from "@/components/course/course-card";
import {Button} from "@/components/ui/button";
import type {IPublicCourse} from "@/types/course";
import {Filter} from "lucide-react";

interface CoursesGridProps {
	courses: IPublicCourse[];
	isLoading: boolean;
}

const CoursesGrid = ({courses, isLoading}: CoursesGridProps) => {
	// Loading state
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
				{Array.from({length: 6}).map((_, i) => (
					<div
						key={i}
						className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden animate-pulse"
					>
						<div className="aspect-video bg-gray-200"></div>
						<div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
							<div className="h-3 sm:h-4 bg-gray-200 rounded"></div>
							<div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
							<div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div>
			{/* No Results */}
			{!isLoading && courses.length === 0 && (
				<div className="text-center py-12 sm:py-16 lg:py-20 px-4">
					<div className="mb-3 sm:mb-4">
						<Filter className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto" />
					</div>
					<h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
						No courses found
					</h3>
					<p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
						Try adjusting your filters or search terms to find what you&apos;re
						looking for.
					</p>
					<Button
						variant="outline"
						className="text-sm sm:text-base h-9 sm:h-10"
					>
						Clear All Filters
					</Button>
				</div>
			)}

			{/* Courses Grid */}
			{!isLoading && courses.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
					{courses.map((course: IPublicCourse) => (
						<CourseCard key={course._id} course={course} />
					))}
				</div>
			)}
		</div>
	);
};

export default CoursesGrid;
