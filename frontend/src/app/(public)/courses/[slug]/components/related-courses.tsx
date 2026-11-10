"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {ArrowRight} from "lucide-react";
import {useRelatedCourses} from "@/hooks/use-courses";
import {CourseCard} from "@/components/course/course-card";

interface RelatedCoursesProps {
	currentCourseId: string;
}

// Course card skeleton component
function CourseCardSkeleton() {
	return (
		<Card className="h-full">
			<CardContent className="p-0">
				<div className="relative aspect-video">
					<Skeleton className="h-full w-full rounded-t-lg" />
				</div>
				<div className="p-4 space-y-3">
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-6 w-full" />
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-12 w-full" />
					<div className="flex justify-between items-center">
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-6 w-16" />
					</div>
					<Skeleton className="h-10 w-full" />
				</div>
			</CardContent>
		</Card>
	);
}

const RelatedCourses = ({currentCourseId}: RelatedCoursesProps) => {
	const {
		data: relatedCourses,
		isLoading,
		error,
	} = useRelatedCourses(currentCourseId);
	console.log("relatedCourses", relatedCourses);

	// Don't render if there are no courses, not loading, or there's an error
	if (!isLoading && (!relatedCourses || relatedCourses.length === 0 || error)) {
		return null;
	}

	return (
		<div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 relative">
			{/* Section Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
				<div>
					<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
						Students also bought
					</h2>
					<p className="text-sm sm:text-base text-gray-600">
						Courses frequently taken together with this course
					</p>
				</div>
				{!isLoading && relatedCourses && relatedCourses.length > 0 && (
					<Button variant="outline" className="hidden md:flex text-sm h-10">
						View All Related Courses
						<ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				)}
			</div>

			{/* Loading State */}
			{isLoading && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
					{Array.from({length: 4}).map((_, index) => (
						<CourseCardSkeleton key={index} />
					))}
				</div>
			)}

			{/* Courses Grid */}
			{!isLoading && relatedCourses && relatedCourses.length > 0 && (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
						{relatedCourses.map((course) => (
							<CourseCard key={course._id} course={course} />
						))}
					</div>

					{/* Mobile View All Button */}
					<div className="text-center mt-6 sm:mt-8 md:hidden">
						<Button variant="outline" className="w-full text-sm h-10">
							View All Related Courses
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</>
			)}
		</div>
	);
};

export default RelatedCourses;
