"use client";

import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {IoIosEyeOff} from "react-icons/io";
import {
	MdAccessTime,
	MdDelete,
	MdDescription,
	MdDragIndicator,
	MdEdit,
	MdHelpOutline,
	MdMoreVert,
	MdOutlineSlowMotionVideo,
	MdVisibility,
	MdVisibilityOff,
} from "react-icons/md";

import {Button} from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Separator} from "@/components/ui/separator";
import {DisplayLesson} from "@/hooks/use-lessons";

import {ContentType} from "@/types/lesson";
import {secondsToDisplayTime} from "@/utils/format";

const getContentTypeConfig = (type: ContentType) => {
	switch (type) {
		case "video":
			return {
				icon: <MdOutlineSlowMotionVideo className="h-4 w-4" />,
				label: "Video",
			};
		case "article":
			return {
				icon: <MdDescription className="h-4 w-4" />,
				label: "Article",
			};
		case "quiz":
			return {
				icon: <MdHelpOutline className="h-4 w-4" />,
				label: "Quiz",
			};
		default:
			return {
				icon: <MdDescription className="h-4 w-4" />,
				label: "Content",
			};
	}
};

interface SortableLessonProps {
	lesson: DisplayLesson;
	lessonIndex: number;
	onEditLesson: (lesson: DisplayLesson) => void;
	onDeleteLesson: (lessonId: string) => void;
	onToggleLessonPublish: (lessonId: string) => void;
}

const SortableLesson = ({
	lesson,
	lessonIndex,
	onEditLesson,
	onDeleteLesson,
	onToggleLessonPublish,
}: SortableLessonProps) => {
	const {attributes, listeners, setNodeRef, transform, transition, isDragging} =
		useSortable({
			id: lesson._id,
			data: {
				type: "lesson",
				lesson,
			},
		});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const contentConfig = getContentTypeConfig(lesson.contentType);

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`bg-card border border-border rounded-lg  transition-colors ${
				isDragging ? "opacity-50" : ""
			}`}
		>
			<div className="p-4">
				{/* Main Row */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3 flex-1 min-w-0">
						{/* Drag Handle */}
						<div
							{...attributes}
							{...listeners}
							className="cursor-grab hover:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
						>
							<MdDragIndicator className="h-4 w-4" />
						</div>

						{/* Lesson Number & Title */}
						<div className="flex items-center gap-1 flex-1 min-w-0">
							<span className="text-sm font-medium ">{lessonIndex + 1}.</span>
							<h4 className="font-medium text-card-foreground truncate">
								{lesson.title}
							</h4>
						</div>
					</div>

					{/* Actions */}
					<div className="flex items-center gap-2 flex-shrink-0">
						<DropdownMenu modal={false}>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
									<MdMoreVert className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-40">
								<DropdownMenuItem
									onClick={(e) => {
										e.stopPropagation();
										onEditLesson(lesson);
									}}
								>
									<MdEdit className="h-4 w-4 mr-2" />
									Edit
								</DropdownMenuItem>

								<DropdownMenuItem
									onClick={(e) => {
										e.stopPropagation();
										onToggleLessonPublish(lesson._id);
									}}
								>
									{lesson.isPublished ? (
										<>
											<MdVisibilityOff className="h-4 w-4 mr-2" />
											Unpublish
										</>
									) : (
										<>
											<MdVisibility className="h-4 w-4 mr-2" />
											Publish
										</>
									)}
								</DropdownMenuItem>
								<Separator />
								<DropdownMenuItem
									onClick={(e) => {
										e.stopPropagation();
										onDeleteLesson(lesson._id);
									}}
									className="text-destructive focus:text-destructive"
								>
									<MdDelete className="h-4 w-4 mr-2" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				{/* Meta Information Row */}
				<div className="flex items-center gap-4 mt-1 ml-8 text-sm">
					{/* Content Type */}
					<div className="flex items-center gap-1">
						<div className="text-muted-foreground">{contentConfig.icon}</div>
						<span className="text-muted-foreground">{contentConfig.label}</span>
					</div>

					{/* Status */}
					<div className="flex items-center gap-1">
						<div
							className={`w-2 h-2 rounded-full ${
								lesson.isPublished ? "bg-green-500" : "bg-yellow-500"
							}`}
						/>
						<span className="text-muted-foreground">
							{lesson.isPublished ? "Published" : "Draft"}
						</span>
					</div>

					{/* Preview */}
					<div className="flex items-center gap-1">
						{lesson.preview ? (
							<MdVisibility className="h-4 w-4 text-muted-foreground" />
						) : (
							<IoIosEyeOff className="h-4 w-4 text-muted-foreground" />
						)}
						<span className="text-muted-foreground">
							{lesson.preview ? "Preview" : "No Preview"}
						</span>
					</div>

					{/* Duration */}
					<div className="flex items-center gap-1">
						<MdAccessTime className="h-4 w-4 text-muted-foreground" />
						<span className="text-muted-foreground">
							Duration: {secondsToDisplayTime(lesson?.duration || 0)}
						</span>
					</div>
				</div>

				{/* Description */}
				{lesson.resource?.description && (
					<p className="text-sm text-muted-foreground mt-2 ml-8 line-clamp-1">
						{lesson.resource.description}
					</p>
				)}
			</div>
		</div>
	);
};

export default SortableLesson;
