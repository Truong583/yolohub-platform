"use client";

import {
	closestCenter,
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	UniqueIdentifier,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {useParams} from "next/navigation";
import {useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {MdAdd, MdDescription, MdDragIndicator} from "react-icons/md";
import {toast} from "sonner";

import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {ProtectedRoute} from "@/components/auth/protected-route";
import {RESOURCES, OPERATIONS} from "@/configs/permission";
import {PopulatedChapter} from "@/types/chapter";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

// Import chapter hooks
import {
	useCourseChapters,
	useDeleteChapter,
	useReorderChapters,
	chapterKeys,
} from "@/hooks/use-chapters";

// Import lesson hooks
import {
	useDeleteLesson,
	useToggleLessonPublish,
	useReorderLessons,
	DisplayLesson,
} from "@/hooks/use-lessons";

// Import lightweight skeleton statically (used for loading states)
import ChapterSkeleton from "./components/chapter-skeleton";

// Dynamic imports for heavy components (changing to default imports)
const ChapterFormDialog = dynamic(
	() => import("./components/chapter-form-dialog"),
	{
		loading: () => <Loader />,
		ssr: false,
	}
);

const LessonFormDialog = dynamic(
	() => import("./components/lesson-form-dialog"),
	{
		loading: () => <Loader />,
		ssr: false,
	}
);

const SortableChapter = dynamic(() => import("./components/sortable-chapter"), {
	loading: () => <ChapterSkeleton />,
	ssr: false,
});

const CourseStatistics = dynamic(
	() => import("./components/course-statistics"),
	{
		loading: () => (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
				{Array.from({length: 4}).map((_, i) => (
					<Card key={i}>
						<CardContent className="p-6">
							<div className="flex items-center space-x-2">
								<div className="h-4 w-4 bg-muted animate-pulse rounded" />
								<div className="h-4 w-20 bg-muted animate-pulse rounded" />
							</div>
							<div className="h-8 w-16 bg-muted animate-pulse rounded mt-2" />
						</CardContent>
					</Card>
				))}
			</div>
		),
		ssr: false,
	}
);

const CourseOutlinePage = () => {
	const params = useParams();
	const courseId = params.courseId as string;
	const queryClient = useQueryClient();

	// API hooks - Chapters
	const {data: chapters = [], isLoading} = useCourseChapters(courseId);

	const deleteChapterMutation = useDeleteChapter();
	const reorderChaptersMutation = useReorderChapters();

	// API hooks - Lessons
	const deleteLessonMutation = useDeleteLesson();
	const toggleLessonPublishMutation = useToggleLessonPublish();
	const reorderLessonsMutation = useReorderLessons();

	// Local state
	const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
		new Set()
	);
	const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
	const [optimisticChapters, setOptimisticChapters] = useState<
		PopulatedChapter[] | null
	>(null);
	const [optimisticLessons, setOptimisticLessons] = useState<{
		chapterId: string;
		lessons: DisplayLesson[];
	} | null>(null);

	// Dialog states
	const [chapterDialogOpen, setChapterDialogOpen] = useState(false);
	const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
	const [editingChapter, setEditingChapter] = useState<
		PopulatedChapter | undefined
	>();
	const [editingLessonId, setEditingLessonId] = useState<string | undefined>();
	const [selectedChapterId, setSelectedChapterId] = useState<string>("");

	// Use optimistic chapters when dragging, otherwise use server data
	let chaptersToRender = optimisticChapters || chapters;

	// Apply optimistic lesson updates if any
	if (optimisticLessons) {
		chaptersToRender = chaptersToRender.map((chapter) =>
			chapter._id === optimisticLessons.chapterId
				? {...chapter, lessons: optimisticLessons.lessons}
				: chapter
		);
	}

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const {active, over} = event;
		setActiveId(null);

		if (active.id !== over?.id) {
			const oldIndex = chapters.findIndex(
				(chapter) => chapter._id === active.id
			);
			const newIndex = chapters.findIndex(
				(chapter) => chapter._id === over?.id
			);

			// Optimistic Update: Update UI immediately
			const reorderedChapters = arrayMove(chapters, oldIndex, newIndex);
			setOptimisticChapters(reorderedChapters);

			const reorderData = {
				chapters: reorderedChapters.map((chapter, index) => ({
					id: chapter._id,
					order: index + 1,
				})),
			};

			// Send API request
			reorderChaptersMutation.mutate(reorderData, {
				onSuccess: () => {
					// Success: Update cache with new data, clear optimistic state
					queryClient.setQueryData(
						chapterKeys.courseChapters(courseId),
						reorderedChapters
					);
					toast.success("Chapter order updated");
					setOptimisticChapters(null);
				},
				onError: () => {
					// Error: Rollback UI to previous state
					toast.error("Failed to update chapter order");
					setOptimisticChapters(null);
				},
			});
		}
	};

	const handleLessonReorder = (
		chapterId: string,
		reorderedLessons: DisplayLesson[]
	) => {
		// Optimistic Update: Update UI immediately
		setOptimisticLessons({chapterId, lessons: reorderedLessons});

		const reorderData = reorderedLessons.map((lesson, index) => ({
			id: lesson._id,
			order: index + 1,
		}));

		reorderLessonsMutation.mutate(
			{reorderData: {lessons: reorderData}},
			{
				onSuccess: () => {
					// Success: Update cache with new data, clear optimistic state
					const currentChapters = queryClient.getQueryData(
						chapterKeys.courseChapters(courseId)
					) as PopulatedChapter[] | undefined;

					if (currentChapters) {
						const updatedChapters = currentChapters.map((ch) =>
							ch._id === chapterId ? {...ch, lessons: reorderedLessons} : ch
						);

						queryClient.setQueryData(
							chapterKeys.courseChapters(courseId),
							updatedChapters
						);
					}

					toast.success("Lesson order updated");
					setOptimisticLessons(null);
				},
				onError: () => {
					// Error: Rollback UI to previous state
					toast.error("Failed to update lesson order");
					setOptimisticLessons(null);
				},
			}
		);
	};

	const handleAccordionChange = (expandedChapterIds: string[]) => {
		const newExpanded = new Set(expandedChapterIds);
		setExpandedChapters(newExpanded);
	};

	const handleAddChapter = () => {
		setEditingChapter(undefined);
		setChapterDialogOpen(true);
	};

	const handleEditChapter = (chapter: PopulatedChapter) => {
		setEditingChapter(chapter);
		setChapterDialogOpen(true);
	};

	const handleDeleteChapter = (chapterId: string) => {
		deleteChapterMutation.mutate(chapterId, {
			onSuccess: () => {
				toast.success("Chapter deleted successfully");
			},
			onError: () => {
				toast.error("Failed to delete chapter");
			},
		});
	};

	const handleAddLesson = (chapterId: string) => {
		setSelectedChapterId(chapterId);
		setEditingLessonId(undefined);
		setLessonDialogOpen(true);
	};

	const handleEditLesson = (lesson: DisplayLesson) => {
		const chapter = chaptersToRender.find((c) =>
			c.lessons?.some((l) => l._id === lesson._id)
		);
		if (chapter) {
			setSelectedChapterId(chapter._id);
			setEditingLessonId(lesson._id);
			setLessonDialogOpen(true);
		}
	};

	const handleDeleteLesson = (lessonId: string) => {
		deleteLessonMutation.mutate(lessonId, {
			onSuccess: () => {
				toast.success("Lesson deleted successfully");
			},
			onError: () => {
				toast.error("Failed to delete lesson");
			},
		});
	};

	const handleToggleLessonPublish = (lessonId: string) => {
		toggleLessonPublishMutation.mutate(lessonId, {
			onSuccess: (updatedLesson) => {
				toast.success(
					`Lesson ${
						updatedLesson.isPublished ? "published" : "unpublished"
					} successfully`
				);
			},
			onError: () => {
				toast.error("Failed to update lesson status");
			},
		});
	};

	const handleLessonSuccess = () => {
		// Auto-expand the chapter to show the new lesson if it was a creation
		if (!editingLessonId && selectedChapterId) {
			const expandedArray = Array.from(expandedChapters);
			if (!expandedArray.includes(selectedChapterId)) {
				handleAccordionChange([...expandedArray, selectedChapterId]);
			}
		}
	};

	const handleChapterDialogChange = (open: boolean) => {
		setChapterDialogOpen(open);
		// Clear editing chapter when dialog closes to prevent state conflicts
		if (!open) {
			setEditingChapter(undefined);
		}
	};

	// Calculate statistics from chaptersToRender
	const totalChapters = chaptersToRender.length;

	// Calculate total lessons and published lessons from all chapters
	let totalLessons = 0;
	let publishedLessons = 0;
	let totalDuration = 0;

	chaptersToRender.forEach((chapter) => {
		if (chapter.lessons) {
			totalLessons += chapter.lessons.length;
			publishedLessons += chapter.lessons.filter(
				(lesson) => lesson.isPublished
			).length;
			totalDuration += chapter.lessons.reduce(
				(sum, lesson) => sum + (lesson.duration || 0),
				0
			);
		}
	});

	return (
		<ProtectedRoute resource={RESOURCES.COURSE} action={OPERATIONS.READ}>
			<div className="container mx-auto py-6 space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">Course Outline</h1>
						<p className="text-gray-600 mt-1">
							Organize your course content with chapters and lessons
						</p>
					</div>
					<Button onClick={handleAddChapter}>
						<MdAdd className="h-4 w-4 mr-2" />
						Add Chapter
					</Button>
				</div>

				{/* Course Statistics */}
				<CourseStatistics
					totalChapters={totalChapters}
					totalLessons={totalLessons}
					publishedLessons={publishedLessons}
					totalDuration={totalDuration}
					isLoading={isLoading}
				/>

				{/* Course Outline */}
				<div className="space-y-4">
					{isLoading ? (
						// Loading state
						Array.from({length: 3}).map((_, index) => (
							<ChapterSkeleton key={index} />
						))
					) : chaptersToRender.length === 0 ? (
						// Empty state
						<Card>
							<CardContent className="p-12 text-center">
								<div className="text-gray-400 mb-4">
									<MdDescription className="h-12 w-12 mx-auto" />
								</div>
								<h3 className="text-lg font-semibold text-gray-600 mb-2">
									No chapters yet
								</h3>
								<p className="text-gray-500 mb-6">
									Get started by creating your first chapter
								</p>
								<Button onClick={handleAddChapter}>
									<MdAdd className="h-4 w-4 mr-2" />
									Create First Chapter
								</Button>
							</CardContent>
						</Card>
					) : (
						// Chapters with drag and drop
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragStart={handleDragStart}
							onDragEnd={handleDragEnd}
						>
							<SortableContext
								items={chaptersToRender.map((chapter) => chapter._id)}
								strategy={verticalListSortingStrategy}
							>
								{chaptersToRender.map((chapter, index) => (
									<SortableChapter
										key={chapter._id}
										chapter={chapter}
										chapterIndex={index}
										isExpanded={expandedChapters.has(chapter._id)}
										onToggleExpanded={handleAccordionChange}
										onEditChapter={handleEditChapter}
										onDeleteChapter={handleDeleteChapter}
										onAddLesson={handleAddLesson}
										onEditLesson={handleEditLesson}
										onDeleteLesson={handleDeleteLesson}
										onToggleLessonPublish={handleToggleLessonPublish}
										onLessonReorder={handleLessonReorder}
									/>
								))}
							</SortableContext>

							{/* Drag Overlay */}
							<DragOverlay>
								{activeId ? (
									<div className="bg-white rounded-lg shadow-lg border border-blue-500 p-4">
										<div className="flex items-center gap-2">
											<MdDragIndicator className="h-5 w-5 text-blue-500" />
											<span className="font-medium">
												{chaptersToRender.find((c) => c._id === activeId)
													?.title || "Item"}
											</span>
										</div>
									</div>
								) : null}
							</DragOverlay>
						</DndContext>
					)}
				</div>

				{/* Dialogs */}
				<ChapterFormDialog
					open={chapterDialogOpen}
					onOpenChange={handleChapterDialogChange}
					chapter={editingChapter}
					courseId={courseId}
				/>

				<LessonFormDialog
					open={lessonDialogOpen}
					onOpenChange={setLessonDialogOpen}
					lessonId={editingLessonId}
					chapterId={selectedChapterId}
					courseId={courseId}
					onSuccess={handleLessonSuccess}
				/>
			</div>
		</ProtectedRoute>
	);
};

export default CourseOutlinePage;
