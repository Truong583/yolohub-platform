"use client";

import {useState, useRef, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {ThumbsUp, MoreHorizontal, Edit3, Trash2} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {cn} from "@/lib/utils";
import {
	ReactionType,
	IComment,
	getUserReaction,
	getReactionCounts,
} from "@/types/comment";
import {useCommentReactions, useDeleteComment} from "@/hooks/use-comments";
import {useUser} from "@/stores/auth-store";

interface CommentActionsProps {
	comment: IComment;
	userName: string;
	lessonId?: string; // For cache invalidation
	onReply: (commentId: string, userName: string) => void;
	onEdit?: (commentId: string) => void;
	level?: number; // Comment nesting level
}

// Comment actions component - Arrow function
const CommentActions = ({
	comment,
	userName,
	lessonId,
	onReply,
	onEdit,
	level = 1,
}: CommentActionsProps) => {
	const currentUser = useUser();
	const currentUserId = currentUser?._id;
	const userReaction = getUserReaction(comment, currentUserId);
	const [showReactions, setShowReactions] = useState(false);
	const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Use custom hooks for comment operations
	const {toggleReaction, isLoading} = useCommentReactions({lessonId});
	const deleteCommentMutation = useDeleteComment(lessonId);

	// Check if current user owns this comment
	const isCommentOwner = currentUserId === comment.userId;

	// Handlers for edit and delete
	const handleEditClick = () => {
		if (onEdit) {
			onEdit(comment._id);
		}
	};

	const handleDeleteClick = async () => {
		if (!window.confirm("Are you sure you want to delete this comment?")) {
			return;
		}

		await deleteCommentMutation.deleteComment(comment._id);
	};

	const handleMouseEnter = () => {
		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current);
		}
		setShowReactions(true);
	};

	const handleMouseLeave = () => {
		hoverTimeoutRef.current = setTimeout(() => {
			setShowReactions(false);
		}, 150); // Small delay to prevent flickering
	};

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (hoverTimeoutRef.current) {
				clearTimeout(hoverTimeoutRef.current);
			}
		};
	}, []);

	const handleReactionSelect = (reaction: ReactionType) => {
		toggleReaction(comment._id, reaction, currentUserId);
		setShowReactions(false); // Close popup after selection
	};

	const handleLikeClick = () => {
		// Quick like toggle
		toggleReaction(comment._id, ReactionType.LIKE, currentUserId);
	};

	const getReactionDisplay = () => {
		if (!userReaction) {
			return {
				icon: <ThumbsUp className="h-4 w-4 mr-1" />,
				text: "Like",
				color: "text-gray-500",
			};
		}

		switch (userReaction) {
			case ReactionType.LIKE:
				return {
					icon: <ThumbsUp className="h-4 w-4 mr-1" />,
					text: "Like",
					color: "text-blue-600",
				};
			case ReactionType.LOVE:
				return {
					icon: <span className="text-sm mr-1">❤️</span>,
					text: "Love",
					color: "text-red-500",
				};
			case ReactionType.CARE:
				return {
					icon: <span className="mr-1">🤗</span>,
					text: "Care",
					color: "text-yellow-600",
				};
			case ReactionType.FUN:
				return {
					icon: <span className="mr-1">😂</span>,
					text: "Haha",
					color: "text-yellow-600",
				};
			case ReactionType.WOW:
				return {
					icon: <span className="mr-1">😮</span>,
					text: "Wow",
					color: "text-yellow-600",
				};
			case ReactionType.SAD:
				return {
					icon: <span className="mr-1">😢</span>,
					text: "Sad",
					color: "text-yellow-600",
				};
			case ReactionType.ANGRY:
				return {
					icon: <span className="mr-1">😡</span>,
					text: "Angry",
					color: "text-red-600",
				};
			default:
				return {
					icon: <ThumbsUp className="h-3 w-3 mr-1" />,
					text: "Like",
					color: "text-gray-500",
				};
		}
	};

	const reactionDisplay = getReactionDisplay();

	// Reaction items for tooltip
	const reactions = [
		{type: ReactionType.LIKE, emoji: "👍", label: "Like"},
		{type: ReactionType.LOVE, emoji: "❤️", label: "Love"},
		{type: ReactionType.CARE, emoji: "🤗", label: "Care"},
		{type: ReactionType.FUN, emoji: "😂", label: "Haha"},
		{type: ReactionType.WOW, emoji: "😮", label: "Wow"},
		{type: ReactionType.SAD, emoji: "😢", label: "Sad"},
		{type: ReactionType.ANGRY, emoji: "😡", label: "Angry"},
	];

	// Get reaction counts and active reactions
	const reactionCounts = getReactionCounts(comment);

	const activeReactions = reactions.filter(
		(reaction) => reactionCounts[reaction.type] > 0
	);

	const totalReactions = Object.values(reactionCounts).reduce(
		(sum, count) => sum + count,
		0
	);

	return (
		<div className="mt-1.5 sm:mt-2">
			<div className="flex items-center justify-between gap-2">
				{/* Left side: Action Buttons */}
				<div className="flex items-center space-x-2 sm:space-x-4">
					<div
						className="relative"
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
					>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleLikeClick}
							disabled={isLoading}
							className={cn(
								"h-auto p-0.5 sm:p-1 text-[10px] sm:text-xs transition-all duration-300 hover:scale-105",
								"hover:bg-gray-100/50 active:scale-95",
								"disabled:opacity-50 disabled:cursor-not-allowed",
								reactionDisplay.color
							)}
						>
							{reactionDisplay.icon}
							<span className="hidden sm:inline">{reactionDisplay.text}</span>
						</Button>

						{/* Custom Reaction Picker - Hidden on mobile */}
						<div
							className={cn(
								"absolute bottom-full left-0 mb-2 sm:mb-3 hidden sm:block",
								"bg-white border border-gray-200 shadow-lg rounded-full px-3 sm:px-4 py-1.5 sm:py-2",
								"transition-all duration-200 ease-out z-50",
								showReactions
									? "opacity-100 visible translate-y-0"
									: "opacity-0 invisible translate-y-2 pointer-events-none"
							)}
						>
							<div className="flex items-center space-x-0.5 sm:space-x-1">
								{reactions.map((reaction, index) => (
									<button
										key={reaction.type}
										onClick={() => handleReactionSelect(reaction.type)}
										disabled={isLoading}
										className={cn(
											"group relative cursor-pointer p-1 sm:p-2 rounded-full",
											"transition-all duration-300 ease-out",
											"hover:bg-gray-100/80 active:bg-gray-200",
											"transform-gpu will-change-transform",
											"hover:scale-125 hover:-translate-y-2 hover:rotate-6",
											"hover:shadow-lg hover:shadow-black/15",
											"active:scale-95 active:transition-none",
											"disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 disabled:hover:rotate-0",
											userReaction === reaction.type &&
												"bg-blue-100 scale-110 shadow-md ring-1 ring-blue-200",
											"animate-in fade-in-0 zoom-in-95"
										)}
										style={{
											animationDelay: `${index * 50}ms`,
											animationFillMode: "both",
											transform: "translate3d(0, 0, 0)", // Force hardware acceleration
											backfaceVisibility: "hidden",
										}}
										title={reaction.label}
									>
										<span
											className={cn(
												"text-xl sm:text-2xl block transition-all duration-300 ease-out",
												"group-hover:scale-110 group-hover:rotate-3",
												"group-active:scale-95"
											)}
											style={{
												filter:
													userReaction === reaction.type
														? "brightness(1.3) saturate(1.2)"
														: "none",
											}}
										>
											{reaction.emoji}
										</span>

										{/* Hover label */}
										<div
											className={cn(
												"absolute -top-8 left-1/2 transform -translate-x-1/2",
												"bg-gray-900 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded",
												"opacity-0 group-hover:opacity-100 transition-opacity duration-200",
												"pointer-events-none whitespace-nowrap z-50"
											)}
										>
											{reaction.label}
										</div>
									</button>
								))}
							</div>
						</div>
					</div>

					{level < 5 && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onReply(comment._id, userName)}
							className="h-auto p-0.5 sm:p-1 text-[10px] sm:text-xs text-gray-500 hover:text-blue-600 transition-all duration-300 hover:scale-105 active:scale-95"
						>
							Reply
						</Button>
					)}
				</div>

				{/* Right side: Reaction Summary */}
				<div className="flex items-center space-x-1.5 sm:space-x-2">
					{totalReactions > 0 && (
						<div className="flex items-center bg-gray-50 rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 cursor-pointer hover:bg-gray-100 transition-colors">
							<div className="flex items-center space-x-0.5 sm:space-x-1">
								{activeReactions.slice(0, 3).map((reaction) => (
									<span key={reaction.type} className="text-xs sm:text-sm">
										{reaction.emoji}
									</span>
								))}
							</div>
							{totalReactions > 0 && (
								<span className="text-[10px] sm:text-sm text-gray-600 ml-1 sm:ml-2 font-medium">
									{totalReactions}
								</span>
							)}
						</div>
					)}

					{isCommentOwner && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="h-auto p-0.5 sm:p-1 text-gray-500 hover:text-gray-700 transition-all duration-300 hover:scale-105"
									disabled={deleteCommentMutation.isPending}
								>
									<MoreHorizontal className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-[120px] sm:w-[140px]"
							>
								<DropdownMenuItem
									onClick={handleEditClick}
									className="cursor-pointer text-xs sm:text-sm"
								>
									<Edit3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
									Edit
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={handleDeleteClick}
									disabled={deleteCommentMutation.isPending}
									variant="destructive"
									className="cursor-pointer text-xs sm:text-sm"
								>
									<Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
									<span className="hidden sm:inline">
										{deleteCommentMutation.isPending ? "Deleting..." : "Delete"}
									</span>
									<span className="sm:hidden">
										{deleteCommentMutation.isPending ? "..." : "Del"}
									</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</div>
		</div>
	);
};

export default CommentActions;
