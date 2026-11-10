"use client";

import React from "react";
import {Card, CardContent} from "@/components/ui/card";
import {MdSchool, MdPlayCircleOutline, MdCheckCircle} from "react-icons/md";

interface ProfileStatsCardsProps {
	totalCourses: number;
	studyingCourses: number;
	completedCourses: number;
}

// Profile stats cards component - Arrow function
const ProfileStatsCards = ({
	totalCourses,
	studyingCourses,
	completedCourses,
}: ProfileStatsCardsProps) => {
	const stats = [
		{
			title: "Your Courses",
			value: totalCourses,
			icon: MdSchool,
		},
		{
			title: "In Progress",
			value: studyingCourses,
			icon: MdPlayCircleOutline,
		},
		{
			title: "Completed",
			value: completedCourses,
			icon: MdCheckCircle,
		},
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 lg:mb-10">
			{stats.map((stat, index) => {
				const Icon = stat.icon;

				// Define colors for each card based on the image
				const iconColors = [
					"bg-red-500", // Các khóa học của bạn - red
					"bg-orange-500", // Đang học - orange
					"bg-green-500", // Đã hoàn thành - red
				];

				return (
					<Card
						key={index}
						className="border border-gray-200 dark:border-gray-700"
					>
						<CardContent className="p-4 sm:p-5 md:p-6">
							<div className="text-center space-y-2 sm:space-y-3 md:space-y-4">
								{/* Icon */}
								<div
									className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 ${iconColors[index]} rounded-full flex items-center justify-center mx-auto`}
								>
									<Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
								</div>

								{/* Value */}
								<div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
									{stat.value}
								</div>

								{/* Title */}
								<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
									{stat.title}
								</div>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
};

export default ProfileStatsCards;
