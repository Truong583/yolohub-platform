// Review types

// Review user interface
export interface ReviewUser {
	_id: string;
	username: string;
	email: string;
	avatar?: string;
}

// Main review interface
export interface IReview {
	_id: string;
	courseId: string;
	userId: string;
	star: number;
	content: string;
	status: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	user: ReviewUser;
}

// Review request types
export interface CreateReviewRequest {
	courseId: string;
	star: number;
	content: string;
}

export interface UpdateReviewRequest {
	id: string;
	courseId: string;
	star?: number;
	content?: string;
}

// Review filter parameters
export interface ReviewsFilterParams {
	page?: number;
	limit?: number;
	minStar?: number;
	status?: string;
	sortBy?: "newest" | "oldest" | "rating";
	sortOrder?: "asc" | "desc";
	[key: string]: unknown;
}

// Review response interfaces
export interface CourseReviewsResponse {
	reviews: IReview[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
	averageRating: number;
	ratingDistribution: {
		[key: string]: number;
	};
}

export interface ReviewsListResponse {
	reviews: IReview[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	};
}

// Keep ReviewResponse as alias for backward compatibility
export type ReviewResponse = IReview;
