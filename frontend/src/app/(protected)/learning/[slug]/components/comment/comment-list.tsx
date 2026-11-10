"use client";

import {Button} from "@/components/ui/button";
import {MessageCircle, Loader2} from "lucide-react";
import CommentItem from "./comment-item";

import {Editor as TipTapEditor} from "@tiptap/react";
import {IComment} from "@/types/comment";

interface CommentListProps {
	comments: IComment[];
	isLoading: boolean;
	error: Error | null;
	replyingTo: string | null;
	replyingToSpecific: string | null;
	replyContent: string;
	isPending: boolean;
	showReplies: Record<string, boolean>;
	loadingReplies: Record<string, boolean>;
	lessonId?: string; // Add lessonId for cache invalidation
	onReply: (commentId: string, userName: string) => void;
	onToggleReplies: (commentId: string) => void;
	onLoadReplies: (commentId: string) => void;
	onReplyContentChange: (content: string) => void;
	onReplyEditorReady: (editor: TipTapEditor) => void;
	onReplySubmit: (commentId: string) => void;
	onReplyCancel: () => void;
	onRefetch: () => void;
}

// Comment list component - Arrow function
const CommentList = ({
	comments,
	isLoading,
	error,
	replyingTo,
	replyingToSpecific,
	replyContent,
	isPending,
	showReplies,
	loadingReplies,
	lessonId,
	onReply,
	onToggleReplies,
	onLoadReplies,
	onReplyContentChange,
	onReplyEditorReady,
	onReplySubmit,
	onReplyCancel,
	onRefetch,
}: CommentListProps) => {
	// Error State
	if (error) {
		return (
			<div className="text-center text-red-500 py-8 sm:py-12 px-4">
				<MessageCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
				<p className="text-xs sm:text-sm">Failed to load comments</p>
				<Button
					variant="outline"
					size="sm"
					onClick={onRefetch}
					className="mt-2 h-8 sm:h-9 text-xs sm:text-sm"
				>
					Try again
				</Button>
			</div>
		);
	}

	// Loading State
	if (isLoading) {
		return (
			<div className="text-center text-gray-500 py-8 sm:py-12 px-4">
				<Loader2 className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 animate-spin opacity-50" />
				<p className="text-xs sm:text-sm">Loading comments...</p>
			</div>
		);
	}

	// Empty State
	if (comments.length === 0) {
		return (
			<div className="text-center text-gray-500 py-8 sm:py-12 px-4">
				<MessageCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
				<p className="text-xs sm:text-sm">No comments yet</p>
				<p className="text-[10px] sm:text-xs mt-1">Be the first to comment!</p>
			</div>
		);
	}

	// Comments List
	return (
		<div className="space-y-3 sm:space-y-4">
			{comments.map((comment: IComment) => (
				<CommentItem
					key={comment._id}
					comment={comment}
					isReplying={replyingTo === comment._id}
					replyContent={replyContent}
					isPending={isPending}
					showReplies={showReplies[comment._id] || false}
					loadingReplies={loadingReplies[comment._id] || false}
					lessonId={lessonId}
					onReply={onReply}
					onToggleReplies={() => onToggleReplies(comment._id)}
					onLoadReplies={() => onLoadReplies(comment._id)}
					onReplyContentChange={onReplyContentChange}
					onReplyEditorReady={onReplyEditorReady}
					onReplySubmit={() => onReplySubmit(comment._id)}
					onReplyCancel={onReplyCancel}
					replyingToSpecific={replyingToSpecific}
					showRepliesState={showReplies}
					loadingRepliesState={loadingReplies}
					onToggleRepliesWithId={onToggleReplies}
					onLoadRepliesWithId={onLoadReplies}
					level={1}
				/>
			))}
		</div>
	);
};

export default CommentList;
