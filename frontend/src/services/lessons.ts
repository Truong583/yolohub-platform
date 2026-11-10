import {ApiService} from "@/lib/api-service";
import type {
	ILesson,
	LessonFormData,
	CreateLessonRequest,
	UpdateLessonRequest,
	ReorderLessonsRequest,
	LessonsFilterParams,
} from "@/types/lesson";

const ENDPOINTS = {
	LESSONS: "/lessons",
	LESSON: (id: string) => `/lessons/${id}`,
	LESSON_BY_SLUG: (slug: string) => `/lessons/slug/${slug}`,
	LESSON_TOGGLE_PUBLISH: (id: string) => `/lessons/${id}/toggle-publish`,
	LESSON_REORDER: "/lessons/reorder",
} as const;

export class LessonsService {
	// Get lessons with filtering
	static async getLessons(params?: LessonsFilterParams): Promise<ILesson[]> {
		try {
			const response = await ApiService.get<ILesson[]>(
				ENDPOINTS.LESSONS,
				params as Record<string, unknown>
			);
			return response || [];
		} catch {
			return [];
		}
	}

	// Get chapter lessons
	static async getChapterLessons(chapterId: string): Promise<ILesson[]> {
		return this.getLessons({chapterId});
	}

	// Get lesson by ID
	static async getLesson(
		id: string,
		params?: Record<string, unknown>
	): Promise<ILesson> {
		const response = await ApiService.get<ILesson>(
			ENDPOINTS.LESSON(id),
			params
		);
		return response;
	}

	// Create lesson
	static async createLesson(lessonData: CreateLessonRequest): Promise<ILesson> {
		const response = await ApiService.post<ILesson, CreateLessonRequest>(
			ENDPOINTS.LESSONS,
			lessonData
		);
		return response;
	}

	// Update lesson
	static async updateLesson(lessonData: UpdateLessonRequest): Promise<ILesson> {
		const {id, ...updateData} = lessonData;
		const response = await ApiService.put<ILesson, Partial<LessonFormData>>(
			ENDPOINTS.LESSON(id),
			updateData
		);
		return response;
	}

	// Delete lesson
	static async deleteLesson(id: string): Promise<void> {
		return ApiService.delete<void>(ENDPOINTS.LESSON(id));
	}

	// Toggle publish status
	static async toggleLessonPublish(id: string): Promise<ILesson> {
		const response = await ApiService.patch<{lesson: ILesson}>(
			ENDPOINTS.LESSON_TOGGLE_PUBLISH(id)
		);
		return response.lesson;
	}

	// Reorder lessons
	static async reorderLessons(
		reorderData: ReorderLessonsRequest
	): Promise<void> {
		return ApiService.put<void, ReorderLessonsRequest>(
			ENDPOINTS.LESSON_REORDER,
			reorderData
		);
	}
}

export default LessonsService;
