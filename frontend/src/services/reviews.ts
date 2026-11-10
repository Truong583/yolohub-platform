import {ApiService} from "@/lib/api-service";
import type {
	IReview,
	CreateReviewRequest,
	UpdateReviewRequest,
	ReviewsFilterParams,
	CourseReviewsResponse,
} from "@/types/review";

const ENDPOINTS = {
	REVIEWS: "/reviews",
	COURSE_REVIEWS: (courseId: string) => `/reviews/course/${courseId}`,
	SUBMIT_REVIEW: "/reviews",
} as const;

export class ReviewsService {
	// Submit review
	static async submitReview(data: CreateReviewRequest): Promise<IReview> {
		return ApiService.post<IReview, CreateReviewRequest>(
			ENDPOINTS.SUBMIT_REVIEW,
			data
		);
	}

	// Get course reviews
	static async getCourseReviews(
		courseId: string,
		params?: Pick<ReviewsFilterParams, "page" | "limit" | "minStar">
	): Promise<CourseReviewsResponse> {
		return ApiService.get<CourseReviewsResponse>(
			ENDPOINTS.COURSE_REVIEWS(courseId),
			params as Record<string, unknown>
		);
	}

	// Update review
	static async updateReview(reviewData: UpdateReviewRequest): Promise<IReview> {
		const {id, ...updateData} = reviewData;
		return ApiService.put<IReview, Partial<CreateReviewRequest>>(
			`${ENDPOINTS.REVIEWS}/${id}`,
			updateData
		);
	}

	// Delete review
	static async deleteReview(reviewId: string): Promise<void> {
		return ApiService.delete<void>(`${ENDPOINTS.REVIEWS}/${reviewId}`);
	}

	// Toggle review like
	static async toggleReviewLike(
		reviewId: string
	): Promise<{liked: boolean; likesCount: number}> {
		return ApiService.post<{liked: boolean; likesCount: number}>(
			`${ENDPOINTS.REVIEWS}/${reviewId}/like`
		);
	}
}

export default ReviewsService;
