"use client";

import Loader from "@/components/loader";
import {useMyCourses} from "@/hooks/use-courses";
import CourseProgressCard from "./course-progress-card";
import ProfileStatsCards from "./profile-stats-cards";

// Account info tab component - Arrow function
const AccountInfoTab = () => {
	const {data: myCourses = [], isLoading} = useMyCourses();

	// Calculate statistics from fetched courses
	const totalCourses = myCourses.length;
	const completedCourses = myCourses.filter(
		(course) =>
			course.completedLessons === course.totalLessons && course.totalLessons > 0
	).length;
	const studyingCourses = totalCourses - completedCourses;

	// Show loading state while fetching courses
	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-20">
				<Loader />
			</div>
		);
	}

	return (
		<div className="space-y-6 sm:space-y-8 lg:space-y-10">
			{/* Header */}
			{/* <div>
				<h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
					Account Information
				</h1>
				<p className="text-sm sm:text-base text-muted-foreground">
					Manage your learning information and course progress
				</p>
			</div> */}

			{/* Stats Cards */}
			<ProfileStatsCards
				totalCourses={totalCourses}
				studyingCourses={studyingCourses}
				completedCourses={completedCourses}
			/>

			{/* Ongoing Courses Section */}
			<div>
				<div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
					<div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-primary to-primary/60 rounded-full"></div>
					<h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
						My Courses
					</h2>
				</div>

				{myCourses.length > 0 ? (
					<div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6">
						{myCourses.map((course) => (
							<CourseProgressCard key={course._id} course={course} />
						))}
					</div>
				) : (
					<div className="text-center py-12 sm:py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
						<div className="mb-4 sm:mb-6">
							<div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
								<svg
									className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
									/>
								</svg>
							</div>
						</div>
						<h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
							🎯 No Courses Enrolled Yet
						</h3>
						<p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-md mx-auto">
							Start your learning journey today! Discover exciting courses
							waiting for you.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default AccountInfoTab;
