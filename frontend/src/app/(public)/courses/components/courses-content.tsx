"use client";

import {Button} from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {usePublicCourses} from "@/hooks/use-courses";
import {Grid3X3, List, SlidersHorizontal} from "lucide-react";
import {useEffect, useState} from "react";
import dynamic from "next/dynamic";
import type {PublicCoursesListResponse} from "@/types/course";

// Dynamic imports for heavy components
const CoursesFilters = dynamic(() => import("./courses-filters"), {
	ssr: false, // Client-side interactive component with state
});

const CoursesGrid = dynamic(() => import("./courses-grid")); // Can be SSR

const CoursesList = dynamic(() => import("./courses-list")); // Can be SSR

// Import lightweight components statically
import CoursesPagination from "./courses-pagination";

interface CoursesContentProps {
	initialCoursesData: PublicCoursesListResponse;
}

const CoursesContent = ({initialCoursesData}: CoursesContentProps) => {
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [priceRange, setPriceRange] = useState([0, 5000000]);
	const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
	const [selectedRating, setSelectedRating] = useState(0);
	const [sortBy, setSortBy] = useState("newest");
	const [currentPage, setCurrentPage] = useState(1);
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [isUsingInitialData, setIsUsingInitialData] = useState(true);

	// Build API parameters from state
	const apiParams = {
		page: currentPage,
		limit: 10, // Standard grid limit
		...(selectedCategory !== "all" && {categoryId: selectedCategory}),
		...(selectedLevels.length > 0 && {level: selectedLevels}),
		minPrice: priceRange[0],
		maxPrice: priceRange[1],
		...(selectedRating > 0 && {minRating: selectedRating}),
		...(sortBy && {
			sortBy:
				sortBy === "price-low" || sortBy === "price-high" ? "price" : sortBy,
			sortOrder:
				sortBy === "price-high" || sortBy === "rating" || sortBy === "popular"
					? ("desc" as const)
					: ("asc" as const),
		}),
	};

	// Check if we should use initial data or fetch new data
	const shouldUseInitialData =
		isUsingInitialData &&
		currentPage === 1 &&
		selectedCategory === "all" &&
		priceRange[0] === 0 &&
		priceRange[1] === 5000000 &&
		selectedLevels.length === 0 &&
		selectedRating === 0 &&
		sortBy === "newest";

	// Fetch courses using the API (only when not using initial data)
	const {data: coursesResponse, isLoading} = usePublicCourses(apiParams, {
		enabled: !shouldUseInitialData,
	});

	// Determine which data to use
	const dataToUse = shouldUseInitialData ? initialCoursesData : coursesResponse;
	const courses = dataToUse?.courses || [];
	const pagination = dataToUse?.pagination;

	// Reset to page 1 when filters change and mark that we're no longer using initial data
	useEffect(() => {
		setCurrentPage(1);
		setIsUsingInitialData(false);
	}, [selectedCategory, priceRange, selectedLevels, selectedRating, sortBy]);

	// Mark that we're no longer using initial data when page changes (but not to page 1)
	useEffect(() => {
		if (currentPage !== 1) {
			setIsUsingInitialData(false);
		}
	}, [currentPage]);

	return (
		<div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
			<div className="flex gap-6 lg:gap-8">
				{/* Filters Sidebar - Desktop */}
				<div className="hidden lg:block w-64 flex-shrink-0">
					<div className="sticky top-32">
						<CoursesFilters
							selectedCategory={selectedCategory}
							onCategoryChange={setSelectedCategory}
							priceRange={priceRange}
							onPriceRangeChange={setPriceRange}
							selectedLevels={selectedLevels}
							onLevelsChange={setSelectedLevels}
							selectedRating={selectedRating}
							onRatingChange={setSelectedRating}
						/>
					</div>
				</div>

				{/* Main Content */}
				<div className="flex-1 min-w-0">
					{/* Results Count and Controls */}
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4 sm:mb-6">
						{/* Mobile Filter Button */}
						<Sheet>
							<SheetTrigger asChild>
								<Button
									variant="outline"
									className="lg:hidden w-full sm:w-auto"
								>
									<SlidersHorizontal className="h-4 w-4 mr-2" />
									Filters
								</Button>
							</SheetTrigger>
							<SheetContent
								side="left"
								className="w-[280px] sm:w-[340px] overflow-y-auto p-0"
							>
								<SheetHeader className="sr-only">
									<SheetTitle>Filters</SheetTitle>
								</SheetHeader>
								<div className="px-6 pt-6 pb-6">
									<CoursesFilters
										selectedCategory={selectedCategory}
										onCategoryChange={setSelectedCategory}
										priceRange={priceRange}
										onPriceRangeChange={setPriceRange}
										selectedLevels={selectedLevels}
										onLevelsChange={setSelectedLevels}
										selectedRating={selectedRating}
										onRatingChange={setSelectedRating}
									/>
								</div>
							</SheetContent>
						</Sheet>

						{/* Right Controls */}
						<div className="flex items-center gap-2 sm:gap-3 sm:ml-auto">
							{/* Sort Dropdown */}
							<Select value={sortBy} onValueChange={setSortBy}>
								<SelectTrigger className="w-full sm:w-[160px] md:w-[180px] h-10">
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="newest">Newest First</SelectItem>
									<SelectItem value="popular">Most Popular</SelectItem>
									<SelectItem value="rating">Highest Rated</SelectItem>
									<SelectItem value="price-low">Price: Low to High</SelectItem>
									<SelectItem value="price-high">Price: High to Low</SelectItem>
									<SelectItem value="alphabetical">A-Z</SelectItem>
								</SelectContent>
							</Select>

							{/* View Mode Toggle */}
							<div className="flex items-center border border-gray-200 rounded-lg p-1">
								<Button
									variant={viewMode === "grid" ? "default" : "ghost"}
									size="sm"
									onClick={() => setViewMode("grid")}
									className="h-8 w-8 p-0"
								>
									<Grid3X3 className="h-4 w-4" />
								</Button>
								<Button
									variant={viewMode === "list" ? "default" : "ghost"}
									size="sm"
									onClick={() => setViewMode("list")}
									className="h-8 w-8 p-0"
								>
									<List className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>

					{/* Courses Display */}
					{viewMode === "grid" ? (
						<CoursesGrid
							courses={courses}
							isLoading={isLoading && !shouldUseInitialData}
						/>
					) : (
						<CoursesList
							courses={courses}
							isLoading={isLoading && !shouldUseInitialData}
						/>
					)}

					{/* Pagination */}
					<CoursesPagination
						currentPage={currentPage}
						onPageChange={setCurrentPage}
						totalPages={pagination?.totalPages || 1}
					/>
				</div>
			</div>
		</div>
	);
};

export default CoursesContent;
