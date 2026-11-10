"use client";

import React from "react";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Slider} from "@/components/ui/slider";
import {Badge} from "@/components/ui/badge";
import {Skeleton} from "@/components/ui/skeleton";
import {useAllCategories} from "@/hooks/use-categories";
import type {ICategory} from "@/types/category";
import {Star, TrendingUp, RotateCcw, Folder} from "lucide-react";

// Extended category interface with course count
interface ICategoryWithCount extends ICategory {
	courseCount?: number;
}

interface CoursesFiltersProps {
	selectedCategory: string;
	onCategoryChange: (category: string) => void;
	priceRange: number[];
	onPriceRangeChange: (range: number[]) => void;
	selectedLevels: string[];
	onLevelsChange: (levels: string[]) => void;
	selectedRating: number;
	onRatingChange: (rating: number) => void;
}

const levels = [
	{id: "beginner", name: "Beginner", count: 623},
	{id: "intermediate", name: "Intermediate", count: 412},
	{id: "advanced", name: "Advanced", count: 212},
];

const priceRanges = [
	{id: "free", label: "Free", range: [0, 0]},
	{id: "under-500k", label: "Under 500K", range: [0, 500000]},
	{id: "500k-1m", label: "500K-1M", range: [500000, 1000000]},
	{id: "1m-3m", label: "1M-3M", range: [1000000, 3000000]},
	{id: "3m-5m", label: "3M-5M", range: [3000000, 5000000]},
	{id: "5m-plus", label: "5M+", range: [5000000, 10000000]},
];

const CoursesFilters = ({
	selectedCategory,
	onCategoryChange,
	priceRange,
	onPriceRangeChange,
	selectedLevels,
	onLevelsChange,
	selectedRating,
	onRatingChange,
}: CoursesFiltersProps) => {
	// Fetch categories from API
	const {data: categoriesData, isLoading: categoriesLoading} =
		useAllCategories();

	// Transform categories data to match component structure
	const categories = React.useMemo(() => {
		if (!categoriesData) return [];

		// Cast categories data to include courseCount
		const categoriesWithCount = categoriesData as ICategoryWithCount[];

		// Calculate total courses across all categories
		const totalCourses = categoriesWithCount.reduce(
			(sum, cat) => sum + (cat.courseCount || 0),
			0
		);

		// Add "All Categories" option at the beginning
		const allCategoriesOption = {
			id: "all",
			name: "All Categories",
			icon: TrendingUp,
			count: totalCourses,
		};

		// Transform API categories to component format
		const transformedCategories = categoriesWithCount.map((category) => ({
			id: category._id,
			name: category.name,
			icon: Folder,
			count: category.courseCount || 0,
		}));

		return [allCategoriesOption, ...transformedCategories];
	}, [categoriesData]);

	const handleLevelToggle = (levelId: string) => {
		onLevelsChange(
			selectedLevels.includes(levelId)
				? selectedLevels.filter((id) => id !== levelId)
				: [...selectedLevels, levelId]
		);
	};

	const clearAllFilters = () => {
		onCategoryChange("all");
		onPriceRangeChange([0, 5000000]);
		onLevelsChange([]);
		onRatingChange(0);
	};

	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Filter Header */}
			<div className="flex items-center justify-between">
				<h3 className="text-base sm:text-lg font-semibold text-gray-900">
					Filters
				</h3>
				<Button
					variant="ghost"
					size="sm"
					onClick={clearAllFilters}
					className="text-blue-600 hover:text-blue-700 h-8 sm:h-9 text-xs sm:text-sm"
				>
					<RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
					Clear All
				</Button>
			</div>

			{/* Categories */}
			<div>
				<h4 className="text-sm sm:text-base font-medium text-gray-900 mb-2 sm:mb-3">
					Categories
				</h4>
				<div className="space-y-1.5 sm:space-y-2">
					{categoriesLoading
						? // Loading skeleton
						  Array.from({length: 5}).map((_, i) => (
								<div
									key={i}
									className="p-2 sm:p-3 rounded-lg border border-gray-200"
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2 sm:space-x-3">
											<Skeleton className="h-3 w-3 sm:h-4 sm:w-4 rounded" />
											<Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
										</div>
										<Skeleton className="h-4 sm:h-5 w-6 sm:w-8 rounded-full" />
									</div>
								</div>
						  ))
						: categories.map((category) => {
								const IconComponent = category.icon;
								return (
									<button
										key={category.id}
										onClick={() => onCategoryChange(category.id)}
										className={`w-full capitalize flex items-center justify-between p-2 sm:p-3 rounded-lg border transition-all duration-200 ${
											selectedCategory === category.id
												? "border-blue-500 bg-blue-50 text-blue-700"
												: "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
										}`}
									>
										<div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
											<IconComponent className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
											<span className="text-xs sm:text-sm font-medium truncate">
												{category.name}
											</span>
										</div>
										<Badge
											variant={
												selectedCategory === category.id
													? "default"
													: "secondary"
											}
											className="text-[10px] sm:text-xs flex-shrink-0"
										>
											{category.count}
										</Badge>
									</button>
								);
						  })}
				</div>
			</div>

			{/* Price Range */}
			<div>
				<h4 className="text-sm sm:text-base font-medium text-gray-900 mb-2 sm:mb-3">
					Price Range
				</h4>
				<div className="space-y-3 sm:space-y-4">
					<div className="px-2 sm:px-3">
						<Slider
							value={priceRange}
							onValueChange={onPriceRangeChange}
							max={5000000}
							min={0}
							step={50000}
							className="w-full"
						/>
						<div className="flex items-center justify-between mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-gray-600">
							<span>{priceRange[0].toLocaleString()} VND</span>
							<span>{priceRange[1].toLocaleString()} VND+</span>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-1.5 sm:gap-2">
						{priceRanges.map((pricePreset) => (
							<Button
								key={pricePreset.id}
								variant="outline"
								size="sm"
								onClick={() => onPriceRangeChange(pricePreset.range)}
								className="flex-1 text-[10px] sm:text-xs h-8 sm:h-9 px-2"
							>
								{pricePreset.label}
							</Button>
						))}
					</div>
				</div>
			</div>

			{/* Level */}
			<div>
				<h4 className="text-sm sm:text-base font-medium text-gray-900 mb-2 sm:mb-3">
					Level
				</h4>
				<div className="space-y-2 sm:space-y-3">
					{levels.map((level) => (
						<div key={level.id} className="flex items-center justify-between">
							<div className="flex items-center space-x-2 sm:space-x-3">
								<Checkbox
									id={level.id}
									checked={selectedLevels.includes(level.id)}
									onCheckedChange={() => handleLevelToggle(level.id)}
									className="h-4 w-4 sm:h-5 sm:w-5"
								/>
								<label
									htmlFor={level.id}
									className="text-xs sm:text-sm font-medium text-gray-700 cursor-pointer"
								>
									{level.name}
								</label>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Rating */}
			<div>
				<h4 className="text-sm sm:text-base font-medium text-gray-900 mb-2 sm:mb-3">
					Rating
				</h4>
				<div className="space-y-1.5 sm:space-y-2">
					{[4.5, 4.0, 3.5, 3.0].map((rating) => (
						<button
							key={rating}
							onClick={() => onRatingChange(rating)}
							className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all duration-200 ${
								selectedRating === rating
									? "border-blue-500 bg-blue-50 text-blue-700"
									: "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
							}`}
						>
							<div className="flex items-center space-x-1.5 sm:space-x-2">
								<div className="flex items-center">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${
												i < Math.floor(rating)
													? "text-yellow-400 fill-current"
													: "text-gray-300"
											}`}
										/>
									))}
								</div>
								<span className="text-xs sm:text-sm font-medium">
									{rating} & up
								</span>
							</div>
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default CoursesFilters;
