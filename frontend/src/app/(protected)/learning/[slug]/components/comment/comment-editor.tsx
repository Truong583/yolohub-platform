"use client";

import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Loader2} from "lucide-react";
import Toolbar from "@/components/tiptap/toolbar";
import Editor from "@/components/tiptap/editor";
import {Editor as TipTapEditor} from "@tiptap/react";
import {useUser} from "@/stores/auth-store";
import {DEFAULT_AVATAR} from "@/constants";

interface CommentEditorProps {
	isComposing: boolean;
	content: string;
	isPending: boolean;
	onComposingChange: (composing: boolean) => void;
	onContentChange: (content: string) => void;
	onEditorReady: (editor: TipTapEditor) => void;
	onSubmit: () => void;
	onCancel: () => void;
}

// Comment editor component - Arrow function
const CommentEditor = ({
	isComposing,
	content,
	isPending,
	onComposingChange,
	onContentChange,
	onEditorReady,
	onSubmit,
	onCancel,
}: CommentEditorProps) => {
	const currentUser = useUser();
	const hasContent = content.replace(/<[^>]*>/g, "").trim().length > 0;

	if (!isComposing) {
		return (
			<div
				className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
				onClick={() => onComposingChange(true)}
			>
				<Avatar className="h-7 w-7 sm:h-8 sm:w-8">
					<AvatarImage
						src={currentUser?.avatar || DEFAULT_AVATAR}
						alt={currentUser?.username || "User"}
					/>
					<AvatarFallback className="bg-gray-300 text-gray-600 text-xs sm:text-sm">
						{currentUser?.username?.charAt(0) || "U"}
					</AvatarFallback>
				</Avatar>
				<div className="flex-1 bg-gray-100 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-500 text-xs sm:text-sm">
					Write your comment
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-start space-x-2 sm:space-x-3">
			<Avatar className="h-7 w-7 sm:h-8 sm:w-8">
				<AvatarImage
					src={currentUser?.avatar || DEFAULT_AVATAR}
					alt={currentUser?.username || "User"}
				/>
				<AvatarFallback className="bg-gray-300 text-gray-600 text-xs sm:text-sm">
					{currentUser?.username?.charAt(0) || "U"}
				</AvatarFallback>
			</Avatar>

			<div className="flex-1 rounded-lg overflow-hidden bg-white border border-gray-200">
				<div className="bg-gray-50">
					<Toolbar />
				</div>

				<Editor
					content={content}
					onChange={onContentChange}
					onReady={onEditorReady}
				/>

				<div className="flex justify-end gap-1.5 sm:gap-2 p-2 sm:p-3">
					<Button
						variant="outline"
						size="sm"
						onClick={onCancel}
						className="text-gray-600 border-gray-300 hover:bg-gray-100 h-8 sm:h-9 text-xs sm:text-sm"
					>
						CANCEL
					</Button>
					<Button
						onClick={onSubmit}
						disabled={!hasContent || isPending}
						size="sm"
						className="bg-blue-600 hover:bg-blue-700 text-white h-8 sm:h-9 text-xs sm:text-sm"
					>
						{isPending ? (
							<>
								<Loader2 className="h-3 w-3 mr-1.5 sm:mr-2 animate-spin" />
								<span className="hidden sm:inline">SENDING...</span>
								<span className="sm:hidden">...</span>
							</>
						) : (
							"COMMENT"
						)}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default CommentEditor;
