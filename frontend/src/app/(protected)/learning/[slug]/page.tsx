"use client";

import {Alert, AlertDescription} from "@/components/ui/alert";
import {AlertCircle} from "lucide-react";
import dynamic from "next/dynamic";
import {notFound, useSearchParams} from "next/navigation";
import React from "react";

import {usePublicCourseChapters} from "@/hooks/use-chapters";
import {useLesson} from "@/hooks/use-lessons";
import {useUserCourseTracks} from "@/hooks/use-track";

// Static imports for critical components
import Loader from "@/components/loader";
import LessonCommentButton from "./components/comment/lesson-comment-button";
import LessonHeader from "./components/lesson-header";
import LessonNavigation from "./components/lesson-navigation";

const LessonSidebar = dynamic(() => import("./components/lesson-sidebar"));

// Dynamic imports with SSR configuration
const LessonVideoPlayer = dynamic(
	() => import("./components/lesson-video-player"),
	{
		ssr: false,
	}
);

const LessonArticleContent = dynamic(
	() => import("./components/lesson-article-content")
);

const LessonCommentDrawer = dynamic(
	() => import("./components/comment/lesson-comment-drawer"),
	{
		ssr: false,
	}
);

const LessonQuiz = dynamic(() => import("./components/quiz/lesson-quiz"), {
	ssr: false,
});

// Types
interface ChapterWithLessons {
	_id: string;
	title: string;
	lessons?: LessonInChapter[];
}

interface LessonInChapter {
	_id: string;
	title: string;
	contentType: "video" | "quiz" | "article";
	duration?: number;
	preview?: boolean;
	isPublished?: boolean;
}

const LessonPage = () => {
	const searchParams = useSearchParams();

	const lessonId = searchParams.get("id") || "";

	// Fetch lesson data
	const {data: lesson, isLoading} = useLesson(lessonId || "");

	// Fetch course chapters
	const {data: chapters = []} = usePublicCourseChapters(lesson?.courseId || "");

	// Fetch user's tracking data
	const {data: trackingData} = useUserCourseTracks(lesson?.courseId || "");

	// Calculate total lessons
	const totalLessons = React.useMemo(() => {
		return (
			(chapters as ChapterWithLessons[])?.reduce(
				(total, chapter) => total + (chapter?.lessons?.length || 0),
				0
			) || 0
		);
	}, [chapters]);

	// Find current lesson position
	const allLessons = React.useMemo(() => {
		return (
			(chapters as ChapterWithLessons[])?.flatMap(
				(chapter) =>
					chapter?.lessons?.map((lesson) => ({
						...lesson,
						chapterId: chapter?._id,
					})) || []
			) || []
		);
	}, [chapters]);

	const currentLessonIndex =
		allLessons?.findIndex((l) => l?._id === lessonId) ?? -1;
	const previousLesson =
		currentLessonIndex > 0 ? allLessons?.[currentLessonIndex - 1] : undefined;
	const nextLesson =
		currentLessonIndex < (allLessons?.length ?? 0) - 1
			? allLessons?.[currentLessonIndex + 1]
			: undefined;

	// Prepare sidebar data
	const sidebarChapters = React.useMemo(() => {
		return (
			(chapters as ChapterWithLessons[])?.map((chapter) => ({
				_id: chapter?._id,
				title: chapter?.title,
				lessons:
					chapter?.lessons?.map((lesson) => ({
						_id: lesson?._id,
						title: lesson?.title,
						contentType: lesson?.contentType,
						duration: lesson?.duration,
						isCompleted:
							trackingData?.completedLessons?.includes(lesson?._id) || false,
						isLocked: lesson?.isPublished,
						preview: lesson?.preview,
					})) || [],
			})) || []
		);
	}, [chapters, trackingData]);

	// Sidebar state
	const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	// Comment drawer state - simplified to single state
	const [showComments, setShowComments] = React.useState(false);

	const handleOpenComments = () => {
		setShowComments(true);
	};

	// Find current chapter title
	const currentChapterTitle = React.useMemo(() => {
		for (const chapter of (chapters as ChapterWithLessons[]) || []) {
			if (chapter?.lessons?.some((lesson) => lesson?._id === lessonId)) {
				return chapter?.title;
			}
		}
		return "Chapter";
	}, [chapters, lessonId]);

	// Render lesson content
	const renderLessonContent = () => {
		switch (lesson?.contentType) {
			case "video":
				return (
					<LessonVideoPlayer
						title={lesson?.title}
						isSidebarOpen={isSidebarOpen}
						videoUrl={lesson?.resource?.url || ""}
						description={lesson?.resource?.description || ""}
					/>
				);

			case "article":
				return (
					<LessonArticleContent
						title={lesson?.title}
						content={lesson?.resource?.description || ""}
					/>
				);

			case "quiz":
				return <LessonQuiz lesson={lesson} />;

			default:
				return (
					<Alert>
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>
							Unknown lesson content type: {lesson?.contentType}
						</AlertDescription>
					</Alert>
				);
		}
	};

	if (isLoading) {
		return <Loader />;
	}

	if (!lesson) {
		notFound();
	}

	return (
		<div className="h-screen overflow-hidden">
			{/* Backdrop overlay for mobile sidebar */}
			{isSidebarOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden"
					onClick={toggleSidebar}
				/>
			)}

			<LessonHeader
				courseTitle={lesson?.course?.title || "Course"}
				courseSlug={lesson?.course?.slug || ""}
				completedLessons={trackingData?.completedCount || 0}
				totalLessons={totalLessons}
			/>

			<div
				className={`pt-16 pb-16 h-screen transition-all duration-300 ${
					isSidebarOpen ? "lg:pr-[23%]" : "pr-0"
				}`}
			>
				<div className="w-full h-full overflow-y-auto">
					{renderLessonContent()}
				</div>
			</div>

			<LessonNavigation
				courseSlug={lesson?.course?.slug || ""}
				previousLesson={previousLesson ? {_id: previousLesson?._id} : undefined}
				nextLesson={nextLesson ? {_id: nextLesson?._id} : undefined}
				currentChapterTitle={currentChapterTitle}
				isSidebarOpen={isSidebarOpen}
				onToggleSidebar={toggleSidebar}
			/>

			<LessonSidebar
				courseTitle={lesson?.course?.title || "Course"}
				courseSlug={lesson?.course?.slug || ""}
				courseId={lesson?.courseId || ""}
				chapters={sidebarChapters}
				currentLessonId={lessonId}
				trackingData={trackingData}
				isSidebarOpen={isSidebarOpen}
				onToggleSidebar={toggleSidebar}
			/>

			<LessonCommentButton
				className={`bottom-20 sm:bottom-20 ${
					isSidebarOpen ? "lg:right-[25%] right-4" : "right-4 sm:right-10"
				}`}
				onClick={handleOpenComments}
			/>

			{/* Only render drawer if user has clicked the button */}
			{showComments && (
				<LessonCommentDrawer
					lessonId={lessonId}
					isOpen={showComments}
					onOpenChange={setShowComments}
				/>
			)}
		</div>
	);
};

export default LessonPage;
