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
	formatLastUpdated,
	formatRating,
} from "@/utils/format";
import {FaRegEye} from "react-icons/fa6";
import {DEFAULT_THUMBNAIL} from "@/constants";
interface CourseCardProps {
	course: IPublicCourse;
}

export function CourseCard({course}: CourseCardProps) {
	return (
		<div className="group overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 bg-white rounded-xl flex flex-col h-full">
			{/* Thumbnail */}
			<div className="relative aspect-video overflow-hidden flex-shrink-0">
				<Image
					src={course.image || DEFAULT_THUMBNAIL}
					alt={course.title}
					fill
					loading="lazy"
					quality={75}
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					className="object-cover group-hover:scale-105 transition-transform duration-300"
				/>
				{/* Level Badge */}
				<div className="absolute top-3 left-3 z-10">
					<Badge variant="default" className="text-sm font-medium capitalize">
						{course.level}
					</Badge>
				</div>
				{/* Price Badge */}
				<div className="absolute top-3 right-3 z-10">
					{course?.isFree ? (
						<Badge className="bg-green-600 text-white border-green-700 backdrop-blur-sm text-xs font-bold px-2.5 py-1 border transition-all duration-200 hover:scale-105 hover:bg-green-700">
							FREE
						</Badge>
					) : (
						<div className="flex flex-col items-end space-y-1.5">
							{course.oldPrice > 0 && course.oldPrice > course.price && (
								<div className="relative bg-gradient-to-r from-red-500 via-red-600 to-orange-500 text-white px-3 py-1.5 font-bold text-xs flex items-center gap-1.5 hover:from-red-600 hover:via-red-700 hover:to-orange-600 hover:scale-110 transition-all duration-300 cursor-default shadow-lg hover:shadow-xl rounded-full">
									{/* Glow effect */}
									<div className="absolute inset-0 bg-gradient-to-r from-red-400 via-red-500 to-orange-400 rounded-full blur-sm -z-10"></div>
									<span className="text-yellow-200 text-sm">🔥</span>
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
			<div className="p-4 flex flex-col flex-grow">
				{/* Header: Category & Date */}
				<div className="flex items-center justify-between text-xs text-gray-500 mb-3">
					<span className="font-medium text-blue-600  capitalize bg-blue-50 px-2.5 py-1 rounded-full">
						{course.category?.name}
					</span>
					<span>{formatLastUpdated(course.updatedAt)}</span>
				</div>

				{/* Title */}
				<Link
					href={`/courses/${course.slug}`}
					className="mb-2"
					aria-label={`View course: ${course.title}`}
				>
					<h3 className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 group-hover:text-blue-600 leading-tight">
						{course.title}
					</h3>
				</Link>

				{/* Instructor */}
				<p className="text-sm text-gray-500 mb-3">
					by{" "}
					<span className="text-gray-700 font-medium">
						{course.author?.username}
					</span>
				</p>

				<p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4">
					{course?.excerpt}
				</p>

				{/* Course Stats - Compact */}
				<div className="flex items-center justify-between text-sm text-gray-500 mb-4">
					<div className="flex items-center space-x-1">
						<Clock size={16} />
						<span>{formatDuration(course.totalDuration || 0)}</span>
					</div>
					<div className="flex items-center space-x-1">
						<FaRegEye size={16} />
						<span>{course.view || 0}</span>
					</div>
					<div className="flex items-center space-x-1">
						<Users size={16} />
						<span>{formatStudentCount(course.enrolledStudents || 0)}</span>
					</div>
				</div>

				{/* Spacer */}
				<div className="flex-grow"></div>

				{/* Rating & Price Row */}
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center space-x-1">
						<div className="flex items-center">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									size={18}
									className={`${
										i < Math.floor(course.averageRating || 0)
											? "text-yellow-400 fill-current"
											: "text-gray-300"
									}`}
								/>
							))}
						</div>
						<span className="text-sm font-medium text-gray-900">
							{formatRating(course.averageRating || 0)}
						</span>
						<span className="text-sm text-gray-500">
							({formatStudentCount(course.totalReviews || 0)})
						</span>
					</div>

					{/* Price */}
					<div className="text-right">
						{course?.isFree ? (
							<span
								className="text-lg font-bold text-green-600"
								itemProp="price"
								content="0"
								aria-label="Free course"
							>
								Free
							</span>
						) : (
							<div className="flex flex-col items-end">
								{course.oldPrice && course.oldPrice > course.price && (
									<span className=" text-gray-500 line-through">
										{formatPrice(course.oldPrice)}
									</span>
								)}
								<span
									className="text-xl font-bold text-gray-900"
									itemProp="price"
									content={course.price.toString()}
								>
									{formatPrice(course.price)}
								</span>
							</div>
						)}
					</div>
				</div>

				{/* Action Button */}
				<Button className="w-full h-10" asChild>
					<Link
						href={`/courses/${course.slug}`}
						aria-label={`${course?.isFree ? "Start learning" : "Enroll in"} ${
							course.title
						}`}
					>
						<BookOpen className="h-4 w-4 mr-2" />
						{course?.isFree ? "Start Learning" : "Enroll Now"}
					</Link>
				</Button>
			</div>
		</div>
	);
}
