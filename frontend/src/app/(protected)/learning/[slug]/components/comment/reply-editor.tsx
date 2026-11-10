"use client";

import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Loader2} from "lucide-react";
import Toolbar from "@/components/tiptap/toolbar";
import Editor from "@/components/tiptap/editor";
import {Editor as TipTapEditor} from "@tiptap/react";
import {useUser} from "@/stores/auth-store";

interface ReplyEditorProps {
	content: string;
	isPending: boolean;
	onContentChange: (content: string) => void;
	onEditorReady: (editor: TipTapEditor) => void;
	onSubmit: () => void;
	onCancel: () => void;
	avatarSize?: "sm" | "md";
}

// Reply editor component - Arrow function
const ReplyEditor = ({
	content,
	isPending,
	onContentChange,
	onEditorReady,
	onSubmit,
	onCancel,
	avatarSize = "md",
}: ReplyEditorProps) => {
	const currentUser = useUser();
	const hasContent = content.replace(/<[^>]*>/g, "").trim().length > 0;
	const avatarClasses = avatarSize === "sm" ? "h-7 w-7" : "h-8 w-8";
	const avatarTextSize = avatarSize === "sm" ? "text-xs" : "text-sm";

	return (
		<div className="mt-2 sm:mt-3">
			<div className="flex items-start space-x-2 sm:space-x-3">
				<Avatar className={avatarClasses}>
					<AvatarImage src="" />
					<AvatarFallback
						className={`bg-gray-300 text-gray-600 ${avatarTextSize}`}
					>
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
								"REPLY"
							)}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReplyEditor;
