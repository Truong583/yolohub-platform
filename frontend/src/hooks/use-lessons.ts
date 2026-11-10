import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import LessonsService from "@/services/lessons";
import type {
	ILesson,
	DisplayLesson,
	CreateLessonRequest,
	UpdateLessonRequest,
	ReorderLessonsRequest,
	LessonsFilterParams,
} from "@/types/lesson";
import {chapterKeys} from "./use-chapters";

// Query keys for lessons
export const lessonsKeys = {
	all: ["lessons"] as const,
	lists: () => [...lessonsKeys.all, "list"] as const,
	list: (filters: LessonsFilterParams) =>
		[...lessonsKeys.lists(), filters] as const,
	chapterLessons: (chapterId: string) =>
		[...lessonsKeys.all, "chapter", chapterId] as const,
	details: () => [...lessonsKeys.all, "detail"] as const,
	detail: (id: string, params?: Record<string, unknown>) =>
		[...lessonsKeys.details(), id, params] as const,
	slug: (slug: string) => [...lessonsKeys.details(), "slug", slug] as const,
};

// Default empty params object for stable reference
const DEFAULT_PARAMS: LessonsFilterParams = {};

// Hooks for lessons
export function useLessons(params?: LessonsFilterParams) {
	const normalizedParams = params || DEFAULT_PARAMS;

	return useQuery({
		queryKey: lessonsKeys.list(normalizedParams),
		queryFn: () => LessonsService.getLessons(normalizedParams),
	});
}

// Hook to fetch lessons for a chapter
export function useChapterLessons(chapterId: string, enabled: boolean = true) {
	return useQuery({
		queryKey: lessonsKeys.chapterLessons(chapterId),
		queryFn: () => LessonsService.getChapterLessons(chapterId),
		enabled: enabled && !!chapterId,
		select: (lessons: ILesson[]): DisplayLesson[] =>
			lessons.map((lesson) => ({
				_id: lesson._id,
				title: lesson.title,
				contentType: lesson.contentType,
				resourceId: lesson.resourceId || "",
				isPublished: lesson.isPublished,
				preview: lesson.preview,
				order: lesson.order,
				duration: lesson.duration,
				resource: lesson.resource,
			})),
	});
}

// Hook to get a single lesson by ID
export function useLesson(id: string, params?: Record<string, unknown>) {
	return useQuery({
		queryKey: lessonsKeys.detail(id, params),
		queryFn: () => LessonsService.getLesson(id, params),
		enabled: !!id,
	});
}

// Hook to create a lesson
export function useCreateLesson() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (lessonData: CreateLessonRequest) =>
			LessonsService.createLesson(lessonData),
		onSuccess: (newLesson) => {
			queryClient.invalidateQueries({
				queryKey: chapterKeys.courseChapters(newLesson.courseId),
			});
		},
	});
}

// Hook to update a lesson
export function useUpdateLesson() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (lessonData: UpdateLessonRequest) =>
			LessonsService.updateLesson(lessonData),
		onSuccess: (updatedLesson) => {
			// Invalidate specific lesson detail queries (including ones with params)
			queryClient.invalidateQueries({
				queryKey: lessonsKeys.details(),
			});

			// CRITICAL: Invalidate course chapters query (this is what the main page uses)
			queryClient.invalidateQueries({
				queryKey: chapterKeys.courseChapters(updatedLesson.courseId),
			});
		},
	});
}

// Hook to delete a lesson
export function useDeleteLesson() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => LessonsService.deleteLesson(id),
		onSuccess: () => {
			// Invalidate all lessons queries since we don't know which chapter it belonged to
			queryClient.invalidateQueries({
				queryKey: lessonsKeys.all,
			});
			// CRITICAL: Invalidate all course chapters queries since we don't know which course it belonged to
			queryClient.invalidateQueries({
				queryKey: chapterKeys.all,
			});
		},
	});
}

// Hook to toggle lesson publish status
export function useToggleLessonPublish() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => LessonsService.toggleLessonPublish(id),
		onSuccess: (updatedLesson) => {
			// Invalidate specific lesson detail queries (including ones with params)
			queryClient.invalidateQueries({
				queryKey: lessonsKeys.details(),
				predicate: (query) => {
					const [, , lessonId] = query.queryKey;
					return lessonId === updatedLesson._id;
				},
			});
			// Invalidate and refetch chapter lessons
			queryClient.invalidateQueries({
				queryKey: lessonsKeys.chapterLessons(updatedLesson.chapterId),
			});
			// CRITICAL: Invalidate course chapters query (this is what the main page uses)
			queryClient.invalidateQueries({
				queryKey: chapterKeys.courseChapters(updatedLesson.courseId),
			});
		},
	});
}

// Hook to reorder lessons
export function useReorderLessons() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({reorderData}: {reorderData: ReorderLessonsRequest}) =>
			LessonsService.reorderLessons(reorderData),
		// Don't invalidate queries on success - let optimistic update handle it
		// The component will update the cache manually after successful mutation
		onError: () => {
			// On error, invalidate to ensure we get fresh data from server
			queryClient.invalidateQueries({
				queryKey: chapterKeys.all,
			});
		},
	});
}

// Re-export types from service for convenience
export type {
	ILesson,
	DisplayLesson,
	CreateLessonRequest,
	UpdateLessonRequest,
	ReorderLessonsRequest,
	LessonsFilterParams,
};
