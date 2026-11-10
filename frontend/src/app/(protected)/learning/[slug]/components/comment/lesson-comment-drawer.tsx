"use client";

import {useState, useEffect, useRef, useCallback} from "react";
import {Button} from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerClose,
} from "@/components/ui/drawer";
import {X, Loader2} from "lucide-react";
import {Editor as TipTapEditor} from "@tiptap/react";
import {
	useInfiniteComments,
	useCreateComment,
	useLoadReplies,
} from "@/hooks/use-comments";
import {IComment} from "@/types/comment";
import {CommentsService} from "@/services/comments";
import {toast} from "sonner";
import {useUser} from "@/stores/auth-store";
import CommentEditor from "./comment-editor";
import CommentList from "./comment-list";

interface LessonCommentDrawerProps {
	lessonId: string;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

// Lesson comment drawer component - Arrow function
const LessonCommentDrawer = ({
	lessonId,
	isOpen,
	onOpenChange,
}: LessonCommentDrawerProps) => {
	// Get current user from auth store
	const currentUser = useUser();

	// React Query hooks - only fetch data when drawer is open
	const {
		data: commentsData,
		isLoading,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = useInfiniteComments(lessonId);

	const createCommentMutation = useCreateComment();
	const {loadReplies, loadingReplies} = useLoadReplies(lessonId);

	// Local state
	const [isComposing, setIsComposing] = useState(false);
	const [replyingTo, setReplyingTo] = useState<string | null>(null);
	const [replyingToSpecific, setReplyingToSpecific] = useState<string | null>(
		null
	);
	const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});

	const [mainEditorContent, setMainEditorContent] = useState("");
	const [replyEditorContent, setReplyEditorContent] = useState("");
	const [mainEditor, setMainEditor] = useState<TipTapEditor | null>(null);
	const [replyEditor, setReplyEditor] = useState<TipTapEditor | null>(null);

	// Ref for the scrollable container
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// Get comments from API data - flatten infinite query pages
	const comments = commentsData?.pages.flatMap((page) => page.comments) || [];
	const totalComments = commentsData?.pages[0]?.pagination?.total || 0;

	// Scroll detection for infinite loading
	const handleScroll = useCallback(() => {
		const container = scrollContainerRef.current;
		if (!container || !hasNextPage || isFetchingNextPage) return;

		const {scrollTop, scrollHeight, clientHeight} = container;
		const scrolledPercentage = (scrollTop + clientHeight) / scrollHeight;

		// Trigger when scrolled 90% to the bottom
		if (scrolledPercentage > 0.9) {
			fetchNextPage();
		}
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	// Attach scroll listener
	useEffect(() => {
		const container = scrollContainerRef.current;
		if (!container) return;

		container.addEventListener("scroll", handleScroll);
		return () => container.removeEventListener("scroll", handleScroll);
	}, [handleScroll]);

	// Don't render if no current user (not authenticated)
	if (!currentUser) {
		return null;
	}

	const handleSendMessage = async () => {
		const hasContent =
			mainEditorContent.replace(/<[^>]*>/g, "").trim().length > 0;

		if (hasContent) {
			try {
				await createCommentMutation.mutateAsync({
					content: mainEditorContent,
					lessonId,
				});

				setMainEditorContent("");
				setIsComposing(false);

				// Clear editor content
				if (mainEditor) {
					mainEditor.commands.clearContent();
				}
			} catch (error) {
				console.error("Failed to create comment:", error);
			}
		}
	};

	const handleSendReply = async (parentCommentId: string) => {
		// Use replyingToSpecific if available, otherwise fall back to replyingTo
		const actualParentId = replyingToSpecific || replyingTo || parentCommentId;

		const hasContent =
			replyEditorContent.replace(/<[^>]*>/g, "").trim().length > 0;

		if (hasContent) {
			try {
				const mentionRegex = /<span[^>]*data-id="([^"]*)"[^>]*>/g;
				const mentions: string[] = [];
				let match;
				while ((match = mentionRegex.exec(replyEditorContent)) !== null) {
					mentions.push(match[1]);
				}

				await createCommentMutation.mutateAsync({
					content: replyEditorContent,
					lessonId,
					parentId: actualParentId,
					mentions: mentions.length > 0 ? mentions : undefined,
				});

				// No need for local state management anymore
				// React Query cache will be updated automatically by useCreateComment

				setShowReplies((prev: Record<string, boolean>) => ({
					...prev,
					[actualParentId]: true,
				}));

				setReplyEditorContent("");
				setReplyingTo(null);
				setReplyingToSpecific(null);

				// Clear editor content
				if (replyEditor) {
					replyEditor.commands.clearContent();
				}
			} catch (error) {
				console.error("Failed to create reply:", error);
			}
		}
	};

	const handleCancel = () => {
		if (mainEditor && mainEditor.view && mainEditor.view.dom) {
			try {
				mainEditor.commands.clearContent();
			} catch (error) {
				console.warn("Editor not ready for clearing:", error);
			}
		}
		setMainEditorContent("");
		setIsComposing(false);
	};

	const handleCancelReply = () => {
		if (replyEditor && replyEditor.view && replyEditor.view.dom) {
			try {
				replyEditor.commands.clearContent();
			} catch (error) {
				console.warn("Reply editor not ready for clearing:", error);
			}
		}
		setReplyEditorContent("");
		setReplyingTo(null);
		setReplyingToSpecific(null);
	};

	const handleReply = (commentId: string, userName: string) => {
		// Recursive function to find comment by ID or username
		const findComment = (
			comments: IComment[],
			searchId: string,
			searchUserName?: string
		): {comment: IComment; parentId?: string} | null => {
			for (const comment of comments) {
				if (
					comment._id === searchId ||
					comment.user?.username === searchUserName
				) {
					return {comment};
				}
				if (comment.replies?.length > 0) {
					const found = findComment(comment.replies, searchId, searchUserName);
					if (found) {
						return {...found, parentId: comment._id};
					}
				}
			}
			return null;
		};

		// Find the target comment
		const found = findComment(comments, commentId);
		if (!found) {
			return;
		}

		// For replies, the parentId should be the comment we're replying to
		// NOT its parent (which would be going up one more level)
		const parentCommentId = commentId; // Always use the comment we're replying to as parent
		const specificCommentId = commentId;
		const parentLevel = found.comment.level || 1;

		// Check if we can add replies at this level (max 5 levels)
		if (!CommentsService.canAddReply(parentLevel)) {
			toast.error("Cannot reply at this level. Maximum 5 levels allowed.");
			return;
		}

		setReplyingTo(parentCommentId);
		setReplyingToSpecific(specificCommentId);

		// Find userId for mention
		const foundUser = findComment(comments, commentId, userName);
		const userId = foundUser?.comment.userId || commentId;

		const mentionHTML = `<span data-type="mention" data-id="${userId}" data-label="${userName}">@${userName}</span>&nbsp;`;

		setReplyEditorContent(mentionHTML);

		setTimeout(() => {
			if (replyEditor && replyEditor.view && replyEditor.view.dom) {
				try {
					replyEditor.commands.setContent(mentionHTML);
					replyEditor.commands.focus("end");
				} catch (error) {
					console.warn("Editor not ready yet:", error);
				}
			}
		}, 100);
	};

	const handleLoadReplies = async (commentId: string) => {
		const success = await loadReplies(commentId, comments);
		if (success) {
			setShowReplies((prev: Record<string, boolean>) => ({
				...prev,
				[commentId]: true,
			}));
		}
	};

	const toggleReplies = (commentId: string) => {
		setShowReplies((prev: Record<string, boolean>) => ({
			...prev,
			[commentId]: !prev[commentId],
		}));
	};

	return (
		<Drawer
			open={isOpen}
			onOpenChange={onOpenChange}
			direction="right"
			dismissible={true}
			shouldScaleBackground={false}
		>
			<DrawerContent className="h-full !w-full sm:!w-[600px] md:!w-[700px] lg:!w-[800px] !max-w-[800px]">
				<div className="w-full h-full">
					<DrawerHeader className="border-b border-gray-200 pb-3 sm:pb-4 px-4 sm:px-6">
						<div className="flex items-center justify-between gap-2">
							<div className="flex-1 min-w-0">
								<DrawerTitle className="text-base sm:text-lg font-semibold text-gray-900 truncate">
									{isLoading ? (
										<div className="flex items-center gap-2">
											<Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
											<span className="text-sm sm:text-base">Loading...</span>
										</div>
									) : (
										`${totalComments} comments`
									)}
								</DrawerTitle>
								<DrawerDescription className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 hidden sm:block">
									If you see spam comments, please report them to admin
								</DrawerDescription>
							</div>
							<DrawerClose asChild>
								<Button
									variant="ghost"
									size="sm"
									className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
								>
									<X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
								</Button>
							</DrawerClose>
						</div>
					</DrawerHeader>

					<div className="flex flex-col h-full">
						<div
							ref={scrollContainerRef}
							className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-20 sm:pb-24 space-y-3 sm:space-y-4"
						>
							<div className="mb-3 sm:mb-4">
								<CommentEditor
									isComposing={isComposing}
									content={mainEditorContent}
									isPending={createCommentMutation.isPending}
									onComposingChange={setIsComposing}
									onContentChange={setMainEditorContent}
									onEditorReady={setMainEditor}
									onSubmit={handleSendMessage}
									onCancel={handleCancel}
								/>
							</div>

							<CommentList
								comments={comments}
								isLoading={isLoading}
								error={error}
								replyingTo={replyingTo}
								replyingToSpecific={replyingToSpecific}
								replyContent={replyEditorContent}
								isPending={createCommentMutation.isPending}
								showReplies={showReplies}
								loadingReplies={loadingReplies}
								lessonId={lessonId}
								onReply={handleReply}
								onToggleReplies={toggleReplies}
								onLoadReplies={handleLoadReplies}
								onReplyContentChange={setReplyEditorContent}
								onReplyEditorReady={setReplyEditor}
								onReplySubmit={handleSendReply}
								onReplyCancel={handleCancelReply}
								onRefetch={refetch}
							/>

							{/* Infinite scroll loading indicator */}
							{isFetchingNextPage && (
								<div className="flex justify-center py-3 sm:py-4">
									<div className="flex items-center gap-1.5 sm:gap-2 text-gray-500">
										<Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
										<span className="text-xs sm:text-sm">Loading more...</span>
									</div>
								</div>
							)}

							{/* No more comments indicator */}
							{!hasNextPage && comments.length > 0 && (
								<div className="flex justify-center py-3 sm:py-4">
									<span className="text-xs sm:text-sm text-gray-400">
										All comments loaded
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
};

export default LessonCommentDrawer;
