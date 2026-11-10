"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import CommentActions from "./comment-actions";
import ReplyEditor from "./reply-editor";

import {Editor as TipTapEditor} from "@tiptap/react";
import {Loader2} from "lucide-react";
import {useUpdateComment} from "@/hooks/use-comments";
import Toolbar from "@/components/tiptap/toolbar";
import Editor from "@/components/tiptap/editor";
import {IComment} from "@/types/comment";
import {DEFAULT_AVATAR} from "@/constants";

interface CommentItemProps {
	comment: IComment;
	isReplying: boolean;
	replyContent: string;
	isPending: boolean;
	showReplies: boolean;
	loadingReplies: boolean;
	lessonId?: string; // Add lessonId for cache invalidation
	onReply: (commentId: string, userName: string) => void;
	onToggleReplies: () => void;
	onLoadReplies: () => void;
	onReplyContentChange: (content: string) => void;
	onReplyEditorReady: (editor: TipTapEditor) => void;
	onReplySubmit: () => void;
	onReplyCancel: () => void;
	replyingToSpecific?: string | null;
	// Props for recursive rendering
	showRepliesState?: Record<string, boolean>;
	loadingRepliesState?: Record<string, boolean>;
	onToggleRepliesWithId?: (commentId: string) => void;
	onLoadRepliesWithId?: (commentId: string) => void;
	// Nesting level for styling
	level?: number;
}

// Comment item component - Arrow function
const CommentItem = ({
	comment,
	isReplying,
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
	replyingToSpecific,
	showRepliesState,
	loadingRepliesState,
	onToggleRepliesWithId,
	onLoadRepliesWithId,
	level = 1,
}: CommentItemProps) => {
	// Edit state management
	const [isEditing, setIsEditing] = useState(false);
	const [editContent, setEditContent] = useState(comment.content);
	const [editEditor, setEditEditor] = useState<TipTapEditor | null>(null);

	// Custom hook for updating comment
	const updateCommentMutation = useUpdateComment(lessonId);
	const isUpdating = updateCommentMutation.isPending;

	// Calculate avatar size based on nesting level
	const avatarSize =
		level === 1 ? "h-7 w-7 sm:h-8 sm:w-8" : "h-6 w-6 sm:h-7 sm:w-7";
	const avatarTextSize =
		level === 1 ? "text-xs sm:text-sm" : "text-[10px] sm:text-xs";

	// Edit handlers
	const handleEditStart = () => {
		setIsEditing(true);
		setEditContent(comment.content);
	};

	const handleEditSave = async () => {
		const hasContent = editContent.replace(/<[^>]*>/g, "").trim().length > 0;

		if (!hasContent) {
			alert("Comment content cannot be empty");
			return;
		}

		await updateCommentMutation.updateComment({
			id: comment._id,
			data: {content: editContent},
		});
		setIsEditing(false);
	};

	const handleEditCancel = () => {
		setIsEditing(false);
		setEditContent(comment.content);
		if (editEditor) {
			editEditor.commands.setContent(comment.content);
		}
	};
	return (
		<div className="space-y-2 sm:space-y-3">
			<div className="flex items-start space-x-2 sm:space-x-3">
				<Avatar className={avatarSize}>
					<AvatarImage
						src={comment.user?.avatar || DEFAULT_AVATAR}
						alt={comment.user?.username || "User"}
					/>
					<AvatarFallback
						className={`bg-blue-500 text-white ${avatarTextSize}`}
					>
						{comment.user?.username?.charAt(0) || "U"}
					</AvatarFallback>
				</Avatar>
				<div className="flex-1 min-w-0">
					<div className="flex items-center space-x-1.5 sm:space-x-2">
						<span className="font-medium text-blue-600 text-xs sm:text-sm truncate">
							{comment.user?.username || "Unknown User"}
						</span>
						<span className="text-gray-500 text-[10px] sm:text-xs whitespace-nowrap">
							{new Date(comment.createdAt).toLocaleDateString()}
						</span>
					</div>
					{isEditing ? (
						<div className="mt-1">
							<div className="rounded-lg overflow-hidden bg-white border border-gray-200">
								<div className="bg-gray-50">
									<Toolbar />
								</div>
								<Editor
									content={editContent}
									onChange={setEditContent}
									onReady={setEditEditor}
								/>
								<div className="flex justify-end gap-1.5 sm:gap-2 p-2 sm:p-3">
									<Button
										variant="outline"
										size="sm"
										onClick={handleEditCancel}
										disabled={isUpdating}
										className="text-gray-600 border-gray-300 hover:bg-gray-100 h-8 sm:h-9 text-xs sm:text-sm"
									>
										Cancel
									</Button>
									<Button
										onClick={handleEditSave}
										disabled={isUpdating}
										size="sm"
										className="bg-blue-600 hover:bg-blue-700 text-white h-8 sm:h-9 text-xs sm:text-sm"
									>
										{isUpdating ? (
											<>
												<Loader2 className="h-3 w-3 mr-1.5 sm:mr-2 animate-spin" />
												<span className="hidden sm:inline">Updating...</span>
												<span className="sm:hidden">...</span>
											</>
										) : (
											"Save"
										)}
									</Button>
								</div>
							</div>
						</div>
					) : (
						<div
							className="text-gray-900 text-xs sm:text-sm mt-1 leading-relaxed break-words"
							dangerouslySetInnerHTML={{__html: comment.content}}
						/>
					)}

					<CommentActions
						comment={comment}
						userName={comment.user?.username || "Unknown User"}
						lessonId={lessonId}
						onReply={onReply}
						onEdit={handleEditStart}
						level={level}
					/>

					{isReplying && replyingToSpecific === comment._id && (
						<ReplyEditor
							content={replyContent}
							isPending={isPending}
							onContentChange={onReplyContentChange}
							onEditorReady={onReplyEditorReady}
							onSubmit={onReplySubmit}
							onCancel={onReplyCancel}
						/>
					)}

					{/* Show/Hide Replies Toggle */}
					{comment.replyCount > 0 && !showReplies && (
						<div className="mt-1.5 sm:mt-2">
							<Button
								variant="link"
								size="sm"
								onClick={() => {
									onToggleReplies();
									// If replies haven't been loaded yet, load them
									if (comment.replies.length === 0) {
										onLoadReplies();
									}
								}}
								disabled={loadingReplies}
								className="h-auto p-0 text-xs sm:text-sm text-gray-600 cursor-pointer hover:text-blue-600 font-medium underline-offset-4 hover:underline"
							>
								{loadingReplies ? (
									<>
										<Loader2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 animate-spin mr-1" />
										<span className="text-xs sm:text-sm">Loading...</span>
									</>
								) : (
									`View ${comment.replyCount} ${
										comment.replyCount === 1 ? "reply" : "replies"
									}`
								)}
							</Button>
						</div>
					)}

					{/* Replies List */}
					{showReplies && comment.replies.length > 0 && (
						<div className="mt-2 sm:mt-3 space-y-3 sm:space-y-4 relative ml-3 sm:ml-4">
							{/* Vertical line from parent avatar center to last child avatar center */}
							<div
								className="absolute -left-[32px] sm:-left-[40px] top-[-4rem] w-[1px] bg-gray-200"
								style={{
									height: `${4 + (comment.replies.length - 1) * 5.5 + 3.2}rem`,
								}}
							></div>

							<div className="pl-4 sm:pl-6 space-y-2 sm:space-y-3">
								<div className="mb-2 sm:mb-3">
									<Button
										variant="link"
										size="sm"
										onClick={onToggleReplies}
										className="h-auto p-0 text-xs sm:text-sm text-gray-600 cursor-pointer hover:text-blue-600 font-medium underline-offset-4 hover:underline"
									>
										Hide {comment.replyCount}{" "}
										{comment.replyCount === 1 ? "reply" : "replies"}
									</Button>
								</div>

								{/* Show replies using recursion */}
								{comment.replies.map((reply: IComment) => (
									<div key={reply._id} className="relative">
										{/* Curved connecting line from vertical line to each immediate child */}
										<div className="absolute -left-12 sm:-left-16 top-2 w-12 sm:w-16 h-4 border-l border-b border-gray-200 border-t-0 border-r-0 rounded-bl-2xl"></div>

										<CommentItem
											comment={reply}
											isReplying={replyingToSpecific === reply._id}
											replyContent={replyContent}
											isPending={isPending}
											showReplies={showRepliesState?.[reply._id] || false}
											loadingReplies={loadingRepliesState?.[reply._id] || false}
											lessonId={lessonId}
											onReply={onReply}
											onToggleReplies={() => onToggleRepliesWithId?.(reply._id)}
											onLoadReplies={() => onLoadRepliesWithId?.(reply._id)}
											onReplyContentChange={onReplyContentChange}
											onReplyEditorReady={onReplyEditorReady}
											onReplySubmit={onReplySubmit}
											onReplyCancel={onReplyCancel}
											replyingToSpecific={replyingToSpecific}
											showRepliesState={showRepliesState}
											loadingRepliesState={loadingRepliesState}
											onToggleRepliesWithId={onToggleRepliesWithId}
											onLoadRepliesWithId={onLoadRepliesWithId}
											level={level + 1}
										/>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CommentItem;
