import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight} from "lucide-react";

interface PaginationInfo {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

interface PaginationProps {
	pagination: PaginationInfo | undefined;
	currentPage: number;
	onPageChange: (page: number) => void;
}

// Pagination component - Arrow function
const Pagination = ({
	pagination,
	currentPage,
	onPageChange,
}: PaginationProps) => {
	if (!pagination || pagination.totalPages <= 1) {
		return null;
	}

	return (
		<div className="mt-6 sm:mt-8 flex items-center justify-center px-4">
			<div className="flex items-center gap-1 sm:gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={!pagination.hasPrevPage}
					className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
				>
					<ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
					<span className="hidden sm:inline ml-1">Previous</span>
					<span className="sm:hidden ml-0.5">Prev</span>
				</Button>

				<div className="flex items-center gap-0.5 sm:gap-1">
					{Array.from({length: Math.min(5, pagination.totalPages)}, (_, i) => {
						const page = i + 1;
						return (
							<Button
								key={page}
								variant={currentPage === page ? "default" : "outline"}
								size="sm"
								onClick={() => onPageChange(page)}
								className="w-8 h-8 sm:w-10 sm:h-10 p-0 text-xs sm:text-sm"
							>
								{page}
							</Button>
						);
					})}
				</div>

				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={!pagination.hasNextPage}
					className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
				>
					<span className="hidden sm:inline mr-1">Next</span>
					<span className="sm:hidden mr-0.5">Next</span>
					<ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
				</Button>
			</div>
		</div>
	);
};

export default Pagination;
