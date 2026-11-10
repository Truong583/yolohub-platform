"use client";

import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight, MoreHorizontal} from "lucide-react";

interface CoursesPaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const CoursesPagination = ({
	currentPage,
	totalPages,
	onPageChange,
}: CoursesPaginationProps) => {
	const getVisiblePages = () => {
		const delta = 2;
		const range = [];
		const rangeWithDots = [];

		for (
			let i = Math.max(2, currentPage - delta);
			i <= Math.min(totalPages - 1, currentPage + delta);
			i++
		) {
			range.push(i);
		}

		if (currentPage - delta > 2) {
			rangeWithDots.push(1, "...");
		} else {
			rangeWithDots.push(1);
		}

		rangeWithDots.push(...range);

		if (currentPage + delta < totalPages - 1) {
			rangeWithDots.push("...", totalPages);
		} else {
			if (totalPages > 1) {
				rangeWithDots.push(totalPages);
			}
		}

		return rangeWithDots;
	};

	if (totalPages <= 1) return null;

	const visiblePages = getVisiblePages();

	return (
		<div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-12">
			{/* Previous Button */}
			<Button
				variant="outline"
				size="sm"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="flex items-center space-x-1 h-9 sm:h-10 px-2 sm:px-3"
			>
				<ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
				<span className="hidden sm:inline text-sm">Previous</span>
				<span className="sm:hidden text-xs">Prev</span>
			</Button>

			{/* Page Numbers */}
			<div className="flex items-center gap-1">
				{visiblePages.map((page, index) => {
					if (page === "...") {
						return (
							<div
								key={`dots-${index}`}
								className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10"
							>
								<MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
							</div>
						);
					}

					return (
						<Button
							key={page}
							variant={currentPage === page ? "default" : "outline"}
							size="sm"
							onClick={() => onPageChange(page as number)}
							className="w-8 h-8 sm:w-10 sm:h-10 p-0 text-xs sm:text-sm"
						>
							{page}
						</Button>
					);
				})}
			</div>

			{/* Next Button */}
			<Button
				variant="outline"
				size="sm"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="flex items-center space-x-1 h-9 sm:h-10 px-2 sm:px-3"
			>
				<span className="hidden sm:inline text-sm">Next</span>
				<span className="sm:hidden text-xs">Next</span>
				<ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
			</Button>
		</div>
	);
};

export default CoursesPagination;
