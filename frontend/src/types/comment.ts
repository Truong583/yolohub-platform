export enum ReactionType {
	LIKE = "like",
	LOVE = "love",
	CARE = "care",
	FUN = "fun",
	WOW = "wow",
	SAD = "sad",
	ANGRY = "angry",
}

export enum CommentStatus {
	PENDING = "pending",
	APPROVED = "approved",
	REJECTED = "rejected",
}

export interface CommentReaction {
	userId: string;
	type: ReactionType;
	user: {
		_id: string;
		username: string;
		avatar?: string;
	};
}

export interface CommentUser {
	_id: string;
	username: string;
	email: string;
	avatar?: string;
}

export interface IComment {
	_id: string;
	content: string;
	lessonId: string;
	userId: string;
	parentId?: string | null; // For nested replies
	level: number; // Nesting level (1-5)
	mentions?: string[]; // User IDs mentioned in comment
	reactions: CommentReaction[];
	status: CommentStatus;
	user?: CommentUser; // User object from backend
	createdAt: string;
	updatedAt: string;
	replyCount: number; // Total number of replies from backend
	replies: IComment[]; // Initially empty, populated when fetched
}

export interface CreateCommentRequest {
	content: string;
	lessonId: string;
	parentId?: string;
	mentions?: string[];
}

export interface UpdateCommentRequest {
	content?: string;
	mentions?: string[];
	status?: "pending" | "approved" | "rejected";
}

export interface UpdateCommentStatusRequest {
	id: string;
	status: CommentStatus;
}

export interface CommentReactionRequest {
	type: ReactionType;
}

export interface CommentsListResponse {
	success: boolean;
	message?: string;
	statusCode: number;
	data: {
		comments: IComment[];
		pagination: {
			total: number;
			page: number;
			limit: number;
			totalPages: number;
			hasNextPage: boolean;
			hasPrevPage: boolean;
		};
	};
}

// Alternative interface for APIs without .data wrapper
export interface DirectCommentsListResponse {
	comments: IComment[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	};
}

// Helper functions to compute reaction data from reactions array
export function getUserReaction(
	comment: IComment,
	currentUserId?: string
): ReactionType | null {
	if (!currentUserId || !comment.reactions) return null;
	const userReaction = comment.reactions.find(
		(r) => r.userId === currentUserId
	);
	return userReaction?.type || null;
}

export function getReactionCounts(
	comment: IComment
): Record<ReactionType, number> {
	const reactions = comment.reactions || [];
	return Object.values(ReactionType).reduce((acc, type) => {
		acc[type] = reactions.filter((r) => r.type === type).length;
		return acc;
	}, {} as Record<ReactionType, number>);
}

export function getLikeCount(comment: IComment): number {
	const reactions = comment.reactions || [];
	return reactions.filter((r) => r.type === ReactionType.LIKE).length;
}

// Comments service filter parameters
export interface CommentsFilterParams {
	page?: number;
	limit?: number;
	status?: string[];
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	[key: string]: unknown;
}
