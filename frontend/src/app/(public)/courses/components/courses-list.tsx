"use client";

import type {IPublicCourse} from "@/types/course";
import CourseListItem from "./course-list-item";
import {Button} from "@/components/ui/button";
import {Filter} from "lucide-react";

interface CoursesListProps {
	courses: IPublicCourse[];
	isLoading: boolean;
}

const CoursesList = ({courses, isLoading}: CoursesListProps) => {
	// Loading state
	if (isLoading) {
		return (
			<div className="space-y-3 sm:space-y-4">
				{Array.from({length: 6}).map((_, i) => (
					<div
						key={i}
						className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 animate-pulse"
					>
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
							<div className="w-full sm:w-48 md:w-56 lg:w-64 aspect-video bg-gray-200 rounded-lg flex-shrink-0"></div>
							<div className="flex-grow space-y-2 sm:space-y-3">
								<div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4"></div>
								<div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
								<div className="h-3 sm:h-4 bg-gray-200 rounded"></div>
								<div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3"></div>
							</div>
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

			{/* Courses List */}
			{!isLoading && courses.length > 0 && (
				<div className="space-y-3 sm:space-y-4">
					{courses.map((course: IPublicCourse) => (
						<CourseListItem key={course._id} course={course} />
					))}
				</div>
			)}
		</div>
	);
};

export default CoursesList;
