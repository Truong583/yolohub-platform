"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Star, Filter, Edit, Trash2, MoreHorizontal, Check} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import WriteReviewDialog from "./write-review-dialog";
import {useUser} from "@/stores/auth-store";
import {
	useDeleteReview,
	useCourseReviewsWithLoadMore,
} from "@/hooks/use-reviews";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {DEFAULT_AVATAR} from "@/constants";

dayjs.extend(relativeTime);

interface Review {
	_id: string;
	userId: string;
	user: {
		_id: string;
		username: string;
		email: string;
	};
	star: number;
	createdAt: string;
	content: string;
}

interface CourseReviewsProps {
	courseTitle?: string;
	courseId: string;
	fallbackAverageRating?: number;
	fallbackTotalReviews?: number;
}

const CourseReviews = ({
	courseTitle,
	courseId,
	fallbackAverageRating = 0,
	fallbackTotalReviews = 0,
}: CourseReviewsProps) => {
	const [selectedRatingFilter, setSelectedRatingFilter] = useState<
		number | null
	>(null);
	const [editingReview, setEditingReview] = useState<Review | null>(null);
	const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

	const currentUser = useUser();

	const deleteReviewMutation = useDeleteReview();

	// Fetch reviews data with load more functionality
	const {
		reviews,
		averageRating,
		total,
		ratingDistribution,
		isLoading,
		isLoadingMore,
		hasNextPage,
		loadMore,
		reset,
	} = useCourseReviewsWithLoadMore(courseId, {
		limit: 5,
		minStar: selectedRatingFilter || undefined, // Use minStar for "star & up" filtering
	});

	// Calculate rating distribution from backend data
	const ratingDistributionArray = [5, 4, 3, 2, 1].map((stars) => {
		const count = parseInt(
			ratingDistribution[stars.toString()]?.toString() || "0"
		);
		const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
		return {stars, count, percentage};
	});

	// Display all loaded reviews (pagination handles the limit)
	const displayedReviews = reviews;

	const formatReviewCount = (count: number) => {
		if (count >= 1000) {
			return `${(count / 1000).toFixed(1)}k`;
		}
		return count.toString();
	};

	const isOwner = (review: Review) => {
		return currentUser?._id === review.userId;
	};

	const handleEditReview = (review: Review) => {
		setEditingReview(review);
		setOpenDropdownId(null); // Close dropdown
	};

	const handleDeleteReview = async (reviewId: string) => {
		setOpenDropdownId(null); // Close dropdown immediately
		if (window.confirm("Are you sure you want to delete this review?")) {
			await deleteReviewMutation.mutateAsync({reviewId, courseId});
		}
	};

	const handleFilterChange = (rating: number | null) => {
		setSelectedRatingFilter(rating);
		setOpenDropdownId(null); // Close any open dropdown
		reset(); // Reset pagination when filter changes
	};

	const getFilterLabel = () => {
		if (selectedRatingFilter === null) return "Filter Reviews";
		return `${selectedRatingFilter} Star${
			selectedRatingFilter !== 1 ? "s" : ""
		} & Up`;
	};

	const isFilterActive = selectedRatingFilter !== null;

	if (isLoading) {
		return (
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-4 sm:p-6">
				<div className="animate-pulse">
					<div className="h-5 sm:h-6 bg-gray-200 rounded w-1/2 sm:w-1/3 mb-3 sm:mb-4"></div>
					<div className="space-y-3 sm:space-y-4">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="flex space-x-3 sm:space-x-4">
								<div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
								<div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
									<div className="h-3 sm:h-4 bg-gray-200 rounded w-1/3 sm:w-1/4"></div>
									<div className="h-2.5 sm:h-3 bg-gray-200 rounded w-full"></div>
									<div className="h-2.5 sm:h-3 bg-gray-200 rounded w-4/5 sm:w-3/4"></div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
			{/* Header */}
			<div className="p-4 sm:p-6 border-b border-gray-200">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
					<h3 className="text-lg sm:text-xl font-semibold text-gray-900">
						Student Reviews
					</h3>
					<div className="flex items-center gap-2">
						{currentUser && (
							<WriteReviewDialog courseTitle={courseTitle} courseId={courseId}>
								<Button
									size="sm"
									className="flex-1 sm:flex-none text-xs sm:text-sm h-9"
								>
									Write a Review
								</Button>
							</WriteReviewDialog>
						)}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant={isFilterActive ? "default" : "outline"}
									size="sm"
									className="flex-1 sm:flex-none text-xs sm:text-sm h-9"
								>
									<Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
									<span className="hidden sm:inline">{getFilterLabel()}</span>
									<span className="sm:hidden">Filter</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuItem
									onClick={() => handleFilterChange(null)}
									className="flex items-center justify-between"
								>
									<span>All Reviews</span>
									{selectedRatingFilter === null && (
										<Check className="h-4 w-4" />
									)}
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								{[5, 4, 3, 2, 1].map((rating) => (
									<DropdownMenuItem
										key={rating}
										onClick={() => handleFilterChange(rating)}
										className="flex items-center justify-between"
									>
										<div className="flex items-center">
											<div className="flex items-center mr-2">
												{[...Array(5)].map((_, i) => (
													<Star
														key={i}
														className={`h-3 w-3 ${
															i < rating
																? "text-yellow-400 fill-current"
																: "text-gray-300"
														}`}
													/>
												))}
											</div>
											<span>
												{rating} Star{rating !== 1 ? "s" : ""} & Up
											</span>
										</div>
										{selectedRatingFilter === rating && (
											<Check className="h-4 w-4" />
										)}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>

			{/* Rating Overview */}
			<div className="p-4 sm:p-6 border-b border-gray-200">
				<div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
					{/* Overall Rating */}
					<div className="text-center">
						<div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
							{(averageRating || fallbackAverageRating).toFixed(2)}
						</div>
						<div className="flex items-center justify-center mb-2">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									className={`h-5 w-5 sm:h-6 sm:w-6 ${
										i < Math.floor(averageRating || fallbackAverageRating)
											? "text-yellow-400 fill-current"
											: "text-gray-300"
									}`}
								/>
							))}
						</div>
						<p className="text-xs sm:text-sm text-gray-600">
							Course Rating • {formatReviewCount(total || fallbackTotalReviews)}{" "}
							reviews
						</p>
					</div>

					{/* Rating Distribution */}
					<div className="space-y-1.5 sm:space-y-2">
						{ratingDistributionArray.map((item) => (
							<div
								key={item.stars}
								className="flex items-center space-x-2 sm:space-x-3"
							>
								<div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600">
									<div className="flex items-center">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className={`h-3 w-3 sm:h-4 sm:w-4 ${
													i < item.stars
														? "text-yellow-400 fill-current"
														: "text-gray-300"
												}`}
											/>
										))}
									</div>
									<span className="w-6 sm:w-8">{item.stars}</span>
								</div>
								<div className="flex-1 bg-gray-200 rounded-full h-1.5 sm:h-2">
									<div
										className="bg-yellow-400 h-1.5 sm:h-2 rounded-full transition-all duration-300"
										style={{width: `${item.percentage}%`}}
									></div>
								</div>
								<span className="text-xs sm:text-sm text-gray-600 w-10 sm:w-12 text-right">
									{item.percentage}%
								</span>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Reviews List */}
			{reviews.length === 0 ? (
				<div className="p-8 sm:p-12 text-center">
					<div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
						<Star className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
					</div>
					<h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
						No reviews yet
					</h4>
					<p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
						Be the first to share your experience with this course
					</p>
					{currentUser ? (
						<WriteReviewDialog courseTitle={courseTitle} courseId={courseId}>
							<Button className="text-sm sm:text-base h-10 sm:h-11">
								Write the First Review
							</Button>
						</WriteReviewDialog>
					) : (
						<p className="text-xs sm:text-sm text-gray-500">
							Sign in to write a review
						</p>
					)}
				</div>
			) : (
				<div className="divide-y divide-gray-200">
					{displayedReviews.map((review) => (
						<div key={review._id} className="p-4 sm:p-6">
							<div className="flex space-x-3 sm:space-x-4">
								{/* User Avatar */}
								<div className="relative w-10 h-10 flex-shrink-0">
									<Avatar className="w-full h-full shadow-sm transition-all duration-200">
										<AvatarImage
											src={review?.user?.avatar || DEFAULT_AVATAR}
											alt={review?.user?.username || "User"}
										/>
										<AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xs sm:text-sm font-bold">
											{review?.user?.username
												? review?.user?.username.slice(0, 2).toUpperCase()
												: "U"}
										</AvatarFallback>
									</Avatar>
								</div>

								{/* Review Content */}
								<div className="flex-1 min-w-0">
									<div className="flex items-start justify-between mb-2 gap-2">
										<div className="flex-1 min-w-0">
											<h5 className="text-sm sm:text-base font-medium text-gray-900 truncate">
												{review?.user?.username}
											</h5>
											<div className="flex items-center space-x-1 sm:space-x-2 mt-1">
												<div className="flex items-center">
													{[...Array(5)].map((_, i) => (
														<Star
															key={i}
															className={`h-3 w-3 sm:h-4 sm:w-4 ${
																i < review.star
																	? "text-yellow-400 fill-current"
																	: "text-gray-300"
															}`}
														/>
													))}
												</div>
												<span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
													{dayjs(review.createdAt).fromNow()}
												</span>
											</div>
										</div>
										{isOwner(review) && (
											<DropdownMenu
												open={openDropdownId === review._id}
												onOpenChange={(isOpen) =>
													setOpenDropdownId(isOpen ? review._id : null)
												}
											>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="sm"
														className="h-8 w-8 p-0"
													>
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem
														onClick={() => {
															setOpenDropdownId(null);
															handleEditReview(review);
														}}
													>
														<Edit className="h-4 w-4 mr-2" />
														Edit Review
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => {
															handleDeleteReview(review._id);
															setOpenDropdownId(null);
														}}
														className="text-red-600 hover:text-red-700"
													>
														<Trash2 className="h-4 w-4 mr-2" />
														Delete Review
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										)}
									</div>
									<p className="text-xs sm:text-sm text-gray-700 leading-relaxed break-words">
										{review.content}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Load More Button */}
			{hasNextPage && (
				<div className="p-4 sm:p-6 border-t border-gray-200 text-center">
					<Button
						variant="outline"
						onClick={loadMore}
						disabled={isLoadingMore}
						className="w-full sm:w-auto text-xs sm:text-sm h-10 sm:h-11"
					>
						{isLoadingMore ? (
							<>
								<div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-gray-600 mr-2"></div>
								Loading...
							</>
						) : (
							<>
								<span className="hidden sm:inline">
									Load More Reviews (
									{(total || fallbackTotalReviews) - reviews.length} remaining)
								</span>
								<span className="sm:hidden">
									Load More ({(total || fallbackTotalReviews) - reviews.length})
								</span>
							</>
						)}
					</Button>
				</div>
			)}

			{/* Edit Review Dialog */}
			{editingReview && (
				<WriteReviewDialog
					key={editingReview._id} // Force re-render when review changes
					courseTitle={courseTitle}
					courseId={courseId}
					editMode={{
						reviewId: editingReview._id,
						initialStar: editingReview.star,
						initialContent: editingReview.content,
					}}
					onClose={() => {
						setEditingReview(null);
						setOpenDropdownId(null);
					}}
				/>
			)}
		</div>
	);
};

export default CourseReviews;
