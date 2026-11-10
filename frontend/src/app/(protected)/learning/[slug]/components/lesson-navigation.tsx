"use client";

import React from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {
	ChevronLeft,
	ChevronRight,
	PanelRightClose,
	PanelRightOpen,
} from "lucide-react";

interface NavigationLesson {
	_id: string;
}

interface LessonNavigationProps {
	courseSlug: string;
	previousLesson?: NavigationLesson;
	nextLesson?: NavigationLesson;
	currentChapterTitle?: string;
	isSidebarOpen: boolean;
	onToggleSidebar: () => void;
}

// Lesson navigation component - Arrow function
const LessonNavigation = ({
	courseSlug,
	previousLesson,
	nextLesson,
	currentChapterTitle = "Chapter",
	isSidebarOpen,
	onToggleSidebar,
}: LessonNavigationProps) => {
	return (
		<div
			className={`fixed bottom-0 left-0 z-40 bg-white border-t border-gray-200 h-14 sm:h-16 flex items-center px-3 sm:px-4 md:px-6 transition-all duration-300 ${
				isSidebarOpen ? "lg:right-[23%] right-0" : "right-0"
			}`}
		>
			<div className="flex items-center justify-between w-full gap-2 sm:gap-3">
				{/* Left Section - Chapter Title (Hidden on mobile) */}
				<div className="hidden md:flex flex-shrink-0 min-w-0 max-w-[150px] lg:max-w-[200px]">
					<p className="text-sm text-gray-600 font-medium truncate">
						{currentChapterTitle}
					</p>
				</div>

				{/* Center Section - Navigation Buttons */}
				<div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-1 justify-center">
					{/* Previous Button */}
					{previousLesson ? (
						<Link href={`/learning/${courseSlug}?id=${previousLesson._id}`}>
							<Button
								variant="outline"
								className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:scale-105 active:scale-95 transition-all duration-300 transform-gpu will-change-transform hover:shadow-md hover:shadow-gray-500/25 h-9 sm:h-10"
							>
								<ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
								<span className="font-medium text-xs sm:text-sm hidden sm:inline">
									PREVIOUS
								</span>
								<span className="font-medium text-xs sm:hidden">PREV</span>
							</Button>
						</Link>
					) : (
						<Button
							variant="outline"
							disabled
							className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border-gray-200 text-gray-400 cursor-not-allowed transition-all duration-300 opacity-50 h-9 sm:h-10"
						>
							<ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
							<span className="font-medium text-xs sm:text-sm hidden sm:inline">
								PREVIOUS
							</span>
							<span className="font-medium text-xs sm:hidden">PREV</span>
						</Button>
					)}

					{/* Next Button */}
					{nextLesson ? (
						<Link href={`/learning/${courseSlug}?id=${nextLesson._id}`}>
							<Button className="flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 text-white transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-sky-500/25 hover:from-sky-600 hover:via-blue-700 hover:to-blue-800 hover:scale-105 active:scale-95 transform-gpu will-change-transform h-9 sm:h-10">
								<span className="font-medium text-xs sm:text-sm">NEXT</span>
								<ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
							</Button>
						</Link>
					) : (
						<Button
							disabled
							className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white cursor-default shadow-md hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform-gpu will-change-transform animate-pulse h-9 sm:h-10"
						>
							<span className="font-medium text-xs sm:text-sm">COMPLETED</span>
						</Button>
					)}
				</div>

				{/* Right Section - Sidebar Toggle */}
				<div className="flex-shrink-0">
					<Button
						variant="ghost"
						size="sm"
						onClick={onToggleSidebar}
						className="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors h-8 w-8 sm:h-9 sm:w-9"
						title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
					>
						{isSidebarOpen ? (
							<PanelRightClose className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
						) : (
							<PanelRightOpen className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
						)}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default LessonNavigation;
