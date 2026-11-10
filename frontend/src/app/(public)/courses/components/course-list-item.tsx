"use client";

import Image from "next/image";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Star, Users, Clock, BookOpen} from "lucide-react";
import {IPublicCourse} from "@/types/course";
import {
	formatPrice,
	formatStudentCount,
	formatDuration,
	formatRating,
} from "@/utils/format";
import {getRoutes} from "@/configs/routes";
import {DEFAULT_THUMBNAIL} from "@/constants";

interface CourseListItemProps {
	course: IPublicCourse;
}

const CourseListItem = ({course}: CourseListItemProps) => {
	return (
		<div className="group border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 bg-white rounded-lg overflow-hidden">
			<div className="flex flex-row gap-3 sm:gap-4 p-3 sm:p-4">
				{/* Thumbnail */}
				<div className="relative w-24 h-24 sm:w-48 sm:h-auto sm:aspect-video md:w-56 lg:w-64 overflow-hidden rounded-lg flex-shrink-0">
					<Image
						src={course.image || DEFAULT_THUMBNAIL}
						alt={course.title}
						fill
						className="object-cover group-hover:scale-105 transition-transform duration-300"
					/>
					{/* Level Badge - Hidden on mobile */}
					<div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 hidden sm:block">
						<Badge
							variant={
								course.level === "beginner"
									? "default"
									: course.level === "intermediate"
									? "secondary"
									: "destructive"
							}
							className="text-[10px] sm:text-xs font-medium capitalize px-1.5 sm:px-2 py-0.5 sm:py-1"
						>
							{course.level}
						</Badge>
					</div>
					{/* Price Badge - Hidden on mobile */}

					<div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 hidden sm:block">
						{course?.isFree ? (
							<Badge className="bg-green-600 text-white border-green-700 backdrop-blur-sm text-[10px] sm:text-xs font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 border transition-all duration-200 hover:scale-105 hover:bg-green-700">
								FREE
							</Badge>
						) : (
							<div className="flex flex-col items-end space-y-1">
								{course.oldPrice > 0 && course.oldPrice > course.price && (
									<div className="relative bg-gradient-to-r from-red-500 via-red-600 to-orange-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 font-bold text-[10px] sm:text-xs flex items-center gap-1 sm:gap-1.5 hover:from-red-600 hover:via-red-700 hover:to-orange-600 hover:scale-110 transition-all duration-300 cursor-default shadow-lg hover:shadow-xl rounded-full">
										{/* Glow effect */}
										<div className="absolute inset-0 bg-gradient-to-r from-red-400 via-red-500 to-orange-400 rounded-full blur-sm -z-10"></div>
										<span className="text-yellow-200 text-xs sm:text-sm">
											🔥
										</span>
										{Math.round(
											((course.oldPrice - course.price) / course.oldPrice) * 100
										)}
										% OFF
									</div>
								)}
							</div>
						)}
					</div>
				</div>

				{/* Content */}
				<div className="flex-grow flex flex-col justify-between min-w-0">
					{/* Header */}
					<div>
						{/* Category & Level & Discount (Mobile) */}
						<div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
							<div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
								<span className="text-[10px] sm:text-xs font-medium text-blue-600 capitalize bg-blue-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0">
									{course.category?.name}
								</span>
								{/* Level Badge - Mobile only */}
								<Badge
									variant={
										course.level === "beginner"
											? "default"
											: course.level === "intermediate"
											? "secondary"
											: "destructive"
									}
									className="sm:hidden text-[10px] font-medium capitalize px-1.5 py-0.5"
								>
									{course.level}
								</Badge>
								{/* Free Badge - Mobile only */}
								{course?.isFree && (
									<Badge className="sm:hidden bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5">
										FREE
									</Badge>
								)}
							</div>
							{/* Discount Badge - Mobile */}
							{!course?.isFree &&
								course.oldPrice > 0 &&
								course.oldPrice > course.price && (
									<div className="sm:hidden bg-gradient-to-r from-red-500 to-orange-500 text-white px-1.5 py-0.5 font-bold text-[10px] rounded-full flex-shrink-0">
										{Math.round(
											((course.oldPrice - course.price) / course.oldPrice) * 100
										)}
										% OFF
									</div>
								)}
						</div>

						{/* Title */}
						<Link
							href={getRoutes.courseDetail(course.slug)}
							aria-label={`View course: ${course.title}`}
						>
							<h3 className="font-semibold text-sm sm:text-lg md:text-xl text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 group-hover:text-blue-600 leading-tight mb-1 sm:mb-2">
								{course.title}
							</h3>
						</Link>

						{/* Instructor - Hidden on mobile */}
						<p className="hidden sm:block text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
							by{" "}
							<span className="text-gray-700 font-medium">
								{course.author?.username}
							</span>
						</p>

						{/* Description/Excerpt - Hidden on mobile */}
						<p className="hidden sm:block text-xs sm:text-sm text-gray-600 line-clamp-2 md:line-clamp-3 leading-relaxed mb-3 sm:mb-4">
							{course?.excerpt}
						</p>

						{/* Stats */}
						<div className="flex items-center flex-wrap gap-x-2 sm:gap-x-4 md:gap-x-6 gap-y-1 text-[10px] sm:text-sm text-gray-500 mb-2 sm:mb-4">
							<div className="flex items-center space-x-0.5 sm:space-x-1">
								<Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
								<span>{formatDuration(course.totalDuration || 0)}</span>
							</div>
							<div className="flex items-center space-x-0.5 sm:space-x-1">
								<Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
								<span>{formatStudentCount(course.enrolledStudents || 0)}</span>
							</div>
							{/* Rating - Mobile only */}
							<div className="flex items-center space-x-0.5 sm:hidden">
								<Star className="h-3 w-3 text-yellow-400 fill-current" />
								<span className="font-medium text-gray-900">
									{formatRating(course.averageRating || 0)}
								</span>
							</div>
						</div>
					</div>

					{/* Footer */}
					<div className="flex items-center justify-between gap-2">
						{/* Rating - Desktop only */}
						<div className="hidden sm:flex items-center space-x-1">
							<div className="flex items-center">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={`h-3 w-3 sm:h-4 sm:w-4 ${
											i < Math.floor(course.averageRating || 0)
												? "text-yellow-400 fill-current"
												: "text-gray-300"
										}`}
									/>
								))}
							</div>
							<span className="text-xs sm:text-sm font-medium text-gray-900">
								{formatRating(course.averageRating || 0)}
							</span>
							<span className="text-xs sm:text-sm text-gray-500">
								({formatStudentCount(course.totalReviews || 0)})
							</span>
						</div>

						{/* Price & Button */}
						<div className="flex items-center gap-2 sm:gap-3 md:gap-4 ml-auto">
							{/* Price */}
							<div className="text-right">
								{course?.isFree ? (
									<span
										className="text-base sm:text-xl font-bold text-green-600"
										itemProp="price"
										content="0"
										aria-label="Free course"
									>
										Free
									</span>
								) : (
									<div className="flex flex-col items-end">
										{course.oldPrice && course.oldPrice > course.price && (
											<span className="hidden sm:inline text-xs sm:text-sm text-gray-500 line-through">
												{formatPrice(course.oldPrice)}
											</span>
										)}
										<span
											className="text-sm sm:text-lg md:text-xl font-bold text-gray-900"
											itemProp="price"
											content={course.price.toString()}
										>
											{formatPrice(course.price)}
										</span>
									</div>
								)}
							</div>

							{/* Button */}
							<Button
								className="px-2 sm:px-4 md:px-6 text-[10px] sm:text-sm h-8 sm:h-10 flex-shrink-0"
								asChild
							>
								<Link
									href={getRoutes.courseDetail(course.slug)}
									aria-label={`${
										course?.isFree ? "Start learning" : "Enroll in"
									} ${course.title}`}
								>
									<BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
									<span className="hidden sm:inline">
										{course?.isFree ? "Start Learning" : "Enroll Now"}
									</span>
									<span className="sm:hidden">
										{course?.isFree ? "Start" : "Enroll"}
									</span>
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CourseListItem;
