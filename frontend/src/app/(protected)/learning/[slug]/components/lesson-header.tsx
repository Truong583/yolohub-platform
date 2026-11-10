"use client";

import React from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {CircularProgress} from "@/components/ui/circular-progress";
import {ArrowLeft} from "lucide-react";

interface LessonHeaderProps {
	courseTitle: string;
	courseSlug: string;
	completedLessons: number;
	totalLessons: number;
}

// Lesson header component - Arrow function
const LessonHeader = ({
	courseTitle,
	courseSlug,
	completedLessons,
	totalLessons,
}: LessonHeaderProps) => {
	const progressPercentage =
		totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

	return (
		<div className="fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white border-b border-slate-700">
			<div className="flex items-center justify-between px-3 sm:px-4 md:px-6 h-14 sm:h-16">
				{/* Left Section */}
				<div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 min-w-0 flex-1">
					<Link href={`/courses/${courseSlug}`}>
						<Button
							variant="ghost"
							size="sm"
							className="text-white hover:bg-slate-800 hover:text-white p-1.5 sm:p-2 transition-all duration-200 group h-8 w-8 sm:h-9 sm:w-9"
						>
							<ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:text-white transition-colors duration-200" />
						</Button>
					</Link>

					<h1 className="font-semibold text-xs sm:text-sm md:text-base truncate">
						{courseTitle}
					</h1>
				</div>

				{/* Right Section */}
				<div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6 text-xs sm:text-sm flex-shrink-0">
					{/* Circular Progress */}
					<div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3">
						<CircularProgress
							value={progressPercentage}
							size="sm"
							color="blue"
							thickness={3}
							className="text-white w-8 h-8 sm:w-10 sm:h-10"
						/>
						<div className="text-center hidden sm:block">
							<div className="text-xs sm:text-sm font-semibold whitespace-nowrap">
								{completedLessons}/{totalLessons} lessons
							</div>
						</div>
					</div>

					<Button
						variant="ghost"
						size="sm"
						className="hidden md:flex text-white hover:bg-slate-800 hover:text-white items-center space-x-2 transition-all duration-200 group h-9"
					>
						<span className="group-hover:scale-110 transition-transform duration-200">
							🔗
						</span>
						<span className="group-hover:text-white transition-colors duration-200">
							Guide
						</span>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default LessonHeader;
