import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import ReviewsService from "@/services/reviews";
import {
	CreateReviewRequest,
	IReview,
	UpdateReviewRequest,
} from "@/types/review";
import {toast} from "sonner";
import {useState, useEffect, useCallback} from "react";

// Query keys
export const reviewsKeys = {
	all: ["reviews"] as const,
	courseReviews: (courseId: string) =>
		[...reviewsKeys.all, "course", courseId] as const,
	courseReviewsWithFilter: (
		courseId: string,
		filters?: Record<string, string | number>
	) => [...reviewsKeys.courseReviews(courseId), filters] as const,
};

/**
 * Hook to get reviews for a specific course
 */
export function useCourseReviews(
	courseId: string,
	params?: {
		page?: number;
		limit?: number;
		minStar?: number;
	}
) {
	return useQuery({
		queryKey: reviewsKeys.courseReviewsWithFilter(courseId, params),
		queryFn: () => ReviewsService.getCourseReviews(courseId, params),
		enabled: !!courseId,
	});
}

/**
 * Hook to get reviews with load more functionality
 */
export function useCourseReviewsWithLoadMore(
	courseId: string,
	initialParams?: {
		limit?: number;
		minStar?: number;
	}
) {
	const [page, setPage] = useState(1);
	const [allReviews, setAllReviews] = useState<IReview[]>([]);
	const [hasNextPage, setHasNextPage] = useState(false);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	const limit = initialParams?.limit || 10;

	const {
		data: reviewsData,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: reviewsKeys.courseReviewsWithFilter(courseId, {
			page,
			limit,
			...(initialParams?.minStar && {minStar: initialParams.minStar}),
		}),
		queryFn: () =>
			ReviewsService.getCourseReviews(courseId, {
				page,
				limit,
				...(initialParams?.minStar && {minStar: initialParams.minStar}),
			}),
		enabled: !!courseId,
	});

	// Update reviews when data changes
	useEffect(() => {
		if (reviewsData) {
			if (page === 1) {
				// First load - replace all reviews
				setAllReviews(reviewsData.reviews);
			} else {
				// Load more - append new reviews
				setAllReviews((prev) => [...prev, ...reviewsData.reviews]);
			}
			setHasNextPage(reviewsData.hasNextPage);
			setIsLoadingMore(false);
		}
	}, [reviewsData, page]);

	const loadMore = useCallback(() => {
		if (hasNextPage && !isLoadingMore && !isLoading) {
			setIsLoadingMore(true);
			setPage((prev) => prev + 1);
		}
	}, [hasNextPage, isLoadingMore, isLoading]);

	const reset = useCallback(() => {
		setPage(1);
		setAllReviews([]);
		setHasNextPage(false);
		setIsLoadingMore(false);
	}, []);

	return {
		reviews: allReviews,
		averageRating: reviewsData?.averageRating || 0,
		total: reviewsData?.total || 0,
		ratingDistribution: reviewsData?.ratingDistribution || {},
		isLoading: isLoading && page === 1,
		isLoadingMore,
		hasNextPage,
		loadMore,
		reset,
		refetch,
		error,
	};
}

/**
 * Hook to create a new review
 */
export function useCreateReview() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateReviewRequest) =>
			ReviewsService.submitReview(data),
		onSuccess: (_, variables) => {
			// Invalidate and refetch course reviews
			queryClient.invalidateQueries({
				queryKey: reviewsKeys.courseReviews(variables.courseId),
			});

			toast.success("Review submitted successfully!");
		},
		onError: () => {
			toast.error("Failed to submit review");
		},
	});
}

/**
 * Hook to update an existing review
 */
export function useUpdateReview() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateReviewRequest) =>
			ReviewsService.updateReview(data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: reviewsKeys.courseReviews(variables.courseId),
			});

			toast.success("Review updated successfully!");
		},
		onError: () => {
			toast.error("Failed to update review");
		},
	});
}

/**
 * Hook to delete a review
 */
export function useDeleteReview() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({reviewId}: {reviewId: string; courseId: string}) =>
			ReviewsService.deleteReview(reviewId),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: reviewsKeys.courseReviews(variables.courseId),
			});

			toast.success("Review deleted successfully!");
		},
		onError: () => {
			toast.error("Failed to delete review");
		},
	});
}

/**
 * Hook to toggle review like
 */
export function useToggleReviewLike() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({reviewId}: {reviewId: string; courseId: string}) =>
			ReviewsService.toggleReviewLike(reviewId),
		onSuccess: (_, variables) => {
			// Optimistically update the UI by invalidating queries
			queryClient.invalidateQueries({
				queryKey: reviewsKeys.courseReviews(variables.courseId),
			});
		},
		onError: () => {
			toast.error("Failed to update like");
		},
	});
}
