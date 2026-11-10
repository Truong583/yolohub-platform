import {
	useQuery,
	useMutation,
	useQueryClient,
	keepPreviousData,
} from "@tanstack/react-query";
import CoursesService from "@/services/courses";
import {
	CreateCourseRequest,
	UpdateCourseRequest,
	CoursesListParams,
} from "@/types/course";
import {toast} from "sonner";

// Query keys for courses
export const courseKeys = {
	all: ["courses"] as const,
	lists: () => [...courseKeys.all, "list"] as const,
	list: (filters: CoursesListParams) =>
		[...courseKeys.lists(), filters] as const,
	details: () => [...courseKeys.all, "detail"] as const,
	detail: (id: string) => [...courseKeys.details(), id] as const,
	publicBySlug: (slug: string) => [...courseKeys.all, "public", slug] as const,
	related: (courseId: string) =>
		[...courseKeys.all, "related", courseId] as const,
	myCourses: () => [...courseKeys.all, "my-courses"] as const,
};

// Hooks for courses
export function useCourses(params?: CoursesListParams) {
	return useQuery({
		queryKey: courseKeys.list(params || {}),
		queryFn: () => CoursesService.getCourses(params),
		placeholderData: keepPreviousData,
	});
}

export function useCourse(id: string) {
	return useQuery({
		queryKey: courseKeys.detail(id),
		queryFn: () => CoursesService.getCourse(id),
		enabled: !!id,
	});
}

export function usePublicCourseBySlug(slug: string) {
	return useQuery({
		queryKey: courseKeys.publicBySlug(slug),
		queryFn: () => CoursesService.getPublicCourseBySlug(slug),
		enabled: !!slug,
	});
}

export function usePublicCourses(
	params?: CoursesListParams,
	options?: {enabled?: boolean}
) {
	return useQuery({
		queryKey: courseKeys.list({...params}),
		queryFn: () => CoursesService.getPublicCourses({...params}),
		placeholderData: keepPreviousData,
		enabled: options?.enabled ?? true,
	});
}

export function useCreateCourse() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (courseData: CreateCourseRequest) =>
			CoursesService.createCourse(courseData),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: courseKeys.lists()});
		},
		onError: (error) => {
			toast.error(error?.message || "Failed to create course");
		},
	});
}

export function useUpdateCourse() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (courseData: UpdateCourseRequest) =>
			CoursesService.updateCourse(courseData),
		onSuccess: (updatedCourse) => {
			// Update the specific course in detail cache
			queryClient.setQueryData(
				courseKeys.detail(updatedCourse._id),
				updatedCourse
			);
			// Invalidate list queries for simplicity and reliability
			queryClient.invalidateQueries({queryKey: courseKeys.lists()});
		},
		onError: (error) => {
			toast.error(error?.message || "Failed to update course");
		},
	});
}

export function useDeleteCourse() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => CoursesService.deleteCourse(id),
		onSuccess: (_, deletedCourseId) => {
			toast.success("Course deleted successfully!");
			// Remove course from detail cache
			queryClient.removeQueries({
				queryKey: courseKeys.detail(deletedCourseId),
			});
			// Invalidate list queries
			queryClient.invalidateQueries({queryKey: courseKeys.lists()});
		},
		onError: (error) => {
			toast.error(error?.message || "Failed to delete course");
		},
	});
}

export function useBulkDeleteCourses() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (courseIds: string[]) =>
			CoursesService.bulkDeleteCourses(courseIds),
		onSuccess: (_, deletedCourseIds) => {
			console.log("Courses deleted successfully!");
			// Remove deleted courses from detail cache
			deletedCourseIds.forEach((id) => {
				queryClient.removeQueries({
					queryKey: courseKeys.detail(id),
				});
			});
			// Invalidate list queries
			queryClient.invalidateQueries({queryKey: courseKeys.lists()});
		},
	});
}

export function useRelatedCourses(courseId: string) {
	return useQuery({
		queryKey: courseKeys.related(courseId),
		queryFn: () => CoursesService.getRelatedCourses(courseId),
		enabled: !!courseId,
	});
}

export function useEnrollFree() {
	return useMutation({
		mutationFn: (courseId: string) => CoursesService.enrollFree(courseId),
	});
}

export function useMyCourses() {
	return useQuery({
		queryKey: courseKeys.myCourses(),
		queryFn: () => CoursesService.getMyCourses(),
	});
}
