import ChaptersService from "@/services/chapters";
import {
	ChaptersFilterParams,
	CreateChapterRequest,
	ReorderChaptersRequest,
	UpdateChapterRequest,
} from "@/types/chapter";

import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";

// Query keys for chapters
export const chapterKeys = {
	all: ["chapters"] as const,
	lists: () => [...chapterKeys.all, "list"] as const,
	list: (filters: ChaptersFilterParams) =>
		[...chapterKeys.lists(), filters] as const,
	courseChapters: (courseId: string) =>
		[...chapterKeys.all, "course", courseId] as const,
	publicCourseChapters: (courseId: string) =>
		[...chapterKeys.all, "public", "course", courseId] as const,
	details: () => [...chapterKeys.all, "detail"] as const,
	detail: (id: string) => [...chapterKeys.details(), id] as const,
};

// Default empty params object for stable reference
const DEFAULT_PARAMS: ChaptersFilterParams = {};

// Hooks for chapters
export function useChapters(params?: ChaptersFilterParams) {
	const normalizedParams = params || DEFAULT_PARAMS;

	return useQuery({
		queryKey: chapterKeys.list(normalizedParams),
		queryFn: () => ChaptersService.getChapters(normalizedParams),
		placeholderData: keepPreviousData,
	});
}

// Hook to get chapters for a specific course
export function useCourseChapters(courseId: string) {
	return useQuery({
		queryKey: chapterKeys.courseChapters(courseId),
		queryFn: () => ChaptersService.getCourseChapters(courseId),
		enabled: !!courseId,
	});
}

// Hook to get public chapters for a course (for course viewing page)
export function usePublicCourseChapters(courseId: string) {
	return useQuery({
		queryKey: chapterKeys.publicCourseChapters(courseId),
		queryFn: () => ChaptersService.getPublicChaptersForCourse(courseId),
		enabled: !!courseId,
	});
}

// Hook to get a single chapter by ID
export function useChapter(id: string) {
	return useQuery({
		queryKey: chapterKeys.detail(id),
		queryFn: () => ChaptersService.getChapter(id),
		enabled: !!id,
	});
}

// Hook to create a new chapter
export function useCreateChapter() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (chapterData: CreateChapterRequest) =>
			ChaptersService.createChapter(chapterData),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: chapterKeys.all,
			});
		},
	});
}

// Hook to update an existing chapter
export function useUpdateChapter() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (chapterData: UpdateChapterRequest) =>
			ChaptersService.updateChapter(chapterData),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: chapterKeys.all});
		},
	});
}

// Hook to delete a chapter
export function useDeleteChapter() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => ChaptersService.deleteChapter(id),
		onSuccess: (_, deletedId) => {
			// Invalidate all chapter queries
			queryClient.invalidateQueries({queryKey: chapterKeys.all});
			queryClient.removeQueries({queryKey: chapterKeys.detail(deletedId)});
		},
	});
}

// Hook to reorder chapters
export function useReorderChapters() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (reorderData: ReorderChaptersRequest) =>
			ChaptersService.reorderChapters(reorderData),
		// Don't invalidate queries on success - let optimistic update handle it
		// The component will clear optimistic state after successful mutation
		onError: () => {
			// On error, invalidate to ensure we get fresh data from server
			queryClient.invalidateQueries({
				queryKey: chapterKeys.all,
			});
		},
	});
}

// Hook to toggle chapter publish status
export function useToggleChapterPublish() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => ChaptersService.toggleChapterPublish(id),
		onSuccess: () => {
			// Invalidate all chapter queries
			queryClient.invalidateQueries({queryKey: chapterKeys.all});
		},
	});
}
