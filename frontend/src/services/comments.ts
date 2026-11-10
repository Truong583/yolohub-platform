import {ApiService} from "@/lib/api-service";
import type {
	IComment,
	CreateCommentRequest,
	UpdateCommentRequest,
	UpdateCommentStatusRequest,
	CommentReactionRequest,
	ReactionType,
	DirectCommentsListResponse,
	CommentsFilterParams,
} from "@/types/comment";

const ENDPOINTS = {
	COMMENTS: "/comments",
	COMMENT: (id: string) => `/comments/${id}`,
	LESSON_COMMENTS: (lessonId: string) => `/comments/lesson/${lessonId}`,
	COMMENT_REPLIES: (parentId: string) => `/comments/${parentId}/replies`,
	COMMENT_REACTION: (id: string) => `/comments/${id}/reactions`,
	COMMENT_REMOVE_REACTION: (id: string) => `/comments/${id}/reactions`,
	ALL_COMMENTS: "/comments/admin/all",
	ADMIN_COMMENT_STATUS: (id: string) => `/comments/admin/${id}/status`,
} as const;

export class CommentsService {
	// Get all comments
	static async getAllComments(
		params?: CommentsFilterParams
	): Promise<DirectCommentsListResponse> {
		return ApiService.get<DirectCommentsListResponse>(
			ENDPOINTS.ALL_COMMENTS,
			params as Record<string, unknown>
		);
	}

	// Get all comments
	// Get lesson comments
	static async getComments(
		lessonId: string,
		params?: Omit<CommentsFilterParams, "lessonId">
	): Promise<DirectCommentsListResponse> {
		try {
			return await ApiService.get<DirectCommentsListResponse>(
				ENDPOINTS.LESSON_COMMENTS(lessonId),
				params as Record<string, unknown>
			);
		} catch {
			return {
				comments: [],
				pagination: {
					total: 0,
					page: 1,
					limit: 20,
					totalPages: 0,
					hasNextPage: false,
					hasPrevPage: false,
				},
			};
		}
	}

	// Get comment by ID
	static async getComment(id: string): Promise<IComment> {
		return ApiService.get<IComment>(ENDPOINTS.COMMENT(id));
	}

	// Create comment
	static async createComment(
		commentData: CreateCommentRequest
	): Promise<IComment> {
		return ApiService.post<IComment, CreateCommentRequest>(
			ENDPOINTS.COMMENTS,
			commentData
		);
	}

	// Update comment
	static async updateComment(
		id: string,
		commentData: UpdateCommentRequest
	): Promise<IComment> {
		return ApiService.put<IComment, UpdateCommentRequest>(
			ENDPOINTS.COMMENT(id),
			commentData
		);
	}

	// Delete comment
	static async deleteComment(id: string): Promise<void> {
		return ApiService.delete<void>(ENDPOINTS.COMMENT(id));
	}

	// Update comment status (admin only)
	static async updateCommentStatus(
		data: UpdateCommentStatusRequest
	): Promise<IComment> {
		return ApiService.patch<IComment, {status: string}>(
			ENDPOINTS.ADMIN_COMMENT_STATUS(data.id),
			{status: data.status}
		);
	}

	// Add reaction
	static async addReaction(
		id: string,
		reaction: ReactionType
	): Promise<IComment> {
		return ApiService.post<IComment, CommentReactionRequest>(
			ENDPOINTS.COMMENT_REACTION(id),
			{type: reaction}
		);
	}

	// Remove reaction
	static async removeReaction(id: string): Promise<IComment> {
		return ApiService.delete<IComment>(ENDPOINTS.COMMENT_REMOVE_REACTION(id));
	}

	// Get replies
	static async getReplies(
		parentId: string,
		params?: Omit<CommentsFilterParams, "parentId">
	): Promise<DirectCommentsListResponse> {
		try {
			return await ApiService.get<DirectCommentsListResponse>(
				ENDPOINTS.COMMENT_REPLIES(parentId),
				params as Record<string, unknown>
			);
		} catch {
			return {
				comments: [],
				pagination: {
					total: 0,
					page: 1,
					limit: 20,
					totalPages: 0,
					hasNextPage: false,
					hasPrevPage: false,
				},
			};
		}
	}

	// Check if comment can have replies
	static canAddReply(level: number): boolean {
		return level < 5;
	}

	// Calculate next level for reply
	static getNextLevel(parentLevel: number): number {
		return Math.min(parentLevel + 1, 5);
	}

	// Bulk delete comments
	static async bulkDeleteComments(commentIds: string[]): Promise<void> {
		return ApiService.delete<void, {commentIds: string[]}>(
			`${ENDPOINTS.COMMENTS}/bulk-delete`,
			{commentIds}
		);
	}

	// Report comment
	static async reportComment(
		id: string,
		reason: string
	): Promise<{success: boolean}> {
		return ApiService.post<{success: boolean}, {reason: string}>(
			`${ENDPOINTS.COMMENT(id)}/report`,
			{reason}
		);
	}
}

export default CommentsService;
