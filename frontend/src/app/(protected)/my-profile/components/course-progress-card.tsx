"use client";

import {Badge} from "@/components/ui/badge";
import {Card} from "@/components/ui/card";
import {ROUTE_CONFIG} from "@/configs/routes";
import {DEFAULT_THUMBNAIL} from "@/constants";
import {IEnrolledCourse} from "@/types/course";
import Image from "next/image";
import Link from "next/link";
import {MdStar} from "react-icons/md";

interface CourseProgressCardProps {
	course: IEnrolledCourse;
}

// Course progress card component - Arrow function
const CourseProgressCard = ({course}: CourseProgressCardProps) => {
	const {
		title,
		slug,
		description,
		image,
		averageRating,
		completedLessons,
		totalLessons,
		level,
	} = course;

	const progressPercentage =
		totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
	return (
		<Link href={`${ROUTE_CONFIG.COURSES}/${slug}`}>
			<Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/20 shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-[1.01] sm:hover:scale-[1.02] cursor-pointer">
				{/* Animated Background Pattern */}
				<div className="absolute inset-0 opacity-30">
					<div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
					<div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-pink-400/20 to-red-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
				</div>

				{/* Main Content */}
				<div className="relative z-10 p-4 sm:p-5 md:p-6">
					{/* Header with Course Image and Rating */}
					<div className="flex items-start gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-5 md:mb-6">
						{/* Course Thumbnail */}
						<div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 relative group">
							<Image
								src={image || DEFAULT_THUMBNAIL}
								alt={title}
								fill
								className="w-full h-full object-cover rounded-xl sm:rounded-2xl ring-2 sm:ring-4 ring-white/50 shadow-md sm:shadow-lg"
							/>
							{/* Play Button Overlay */}
							<div className="absolute inset-0 bg-black/20 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
								<div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/90 rounded-full flex items-center justify-center">
									<div className="w-0 h-0 border-l-[5px] sm:border-l-[6px] border-l-gray-700 border-y-[3px] sm:border-y-[4px] border-y-transparent ml-0.5 sm:ml-1"></div>
								</div>
							</div>
						</div>

						{/* Course Info */}
						<div className="flex-1 min-w-0">
							{/* Rating */}
							<div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
								<div className="flex items-center gap-0.5 sm:gap-1">
									{Array.from({length: 5}, (_, i) => (
										<MdStar
											key={i}
											className={`h-3 w-3 sm:h-4 sm:w-4 transition-colors ${
												i < Math.floor(averageRating)
													? "text-yellow-400 fill-current drop-shadow-sm"
													: "text-gray-300"
											}`}
										/>
									))}
								</div>
								<span className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300">
									{averageRating.toFixed(2)}
								</span>
								<div className="ml-auto">
									<Badge className="bg-gradient-to-r from-blue-500 to-purple-600 capitalize text-white font-medium px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs shadow-md sm:shadow-lg">
										{level}
									</Badge>
								</div>
							</div>

							{/* Course Title */}
							<h3 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl text-gray-900 dark:text-white mb-1 sm:mb-2 leading-tight line-clamp-2">
								{title}
							</h3>
							<div
								className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2"
								dangerouslySetInnerHTML={{
									__html: description,
								}}
							/>
						</div>
					</div>

					{/* Progress Section */}
					<div className="space-y-2 sm:space-y-3 md:space-y-4">
						{/* Progress Info */}
						<div className="flex items-center justify-between text-xs sm:text-sm">
							<div className="flex items-center gap-1.5 sm:gap-2">
								<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
								<span className="text-gray-600 dark:text-gray-400 font-medium">
									<span className="hidden sm:inline">Learning Progress: </span>
									<span className="font-bold text-gray-900 dark:text-white">
										{completedLessons}
									</span>
									/{totalLessons}
									<span className="hidden sm:inline"> lessons</span>
								</span>
							</div>
						</div>

						{/* Enhanced Progress Bar */}
						<div className="space-y-2 sm:space-y-3">
							<div className="relative group/progress">
								<div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
									<div
										className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
										style={{width: `${progressPercentage}%`}}
									>
										{/* Shimmer effect */}
										<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
									</div>
								</div>

								{/* Progress percentage indicator */}
								{progressPercentage > 0 && (
									<div
										className="absolute top-0 -mt-6 sm:-mt-8 transform -translate-x-1/2 transition-all duration-300 opacity-0 group-hover/progress:opacity-100"
										style={{left: `${Math.min(progressPercentage, 95)}%`}}
									>
										<div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md shadow-lg">
											{progressPercentage}%
										</div>
										<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-500 to-purple-600 rotate-45 mx-auto -mt-0.5 sm:-mt-1"></div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Subtle border glow */}
				<div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
			</Card>
		</Link>
	);
};

export default CourseProgressCard;
