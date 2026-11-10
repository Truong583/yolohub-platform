import {ApiService} from "@/lib/api-service";
import type {
	IChapter,
	IPublicChapter,
	ChapterFormData,
	CreateChapterRequest,
	UpdateChapterRequest,
	ReorderChaptersRequest,
	ChaptersFilterParams,
} from "@/types/chapter";

const ENDPOINTS = {
	CHAPTERS: "/chapters",
	CHAPTER: (id: string) => `/chapters/${id}`,
	COURSE_CHAPTERS: (courseId: string) => `/courses/${courseId}/chapters`,
	CHAPTER_REORDER: "/chapters/reorder",
} as const;

export class ChaptersService {
	// Get chapters with filtering
	static async getChapters(params?: ChaptersFilterParams): Promise<IChapter[]> {
		try {
			return await ApiService.get<IChapter[]>(ENDPOINTS.CHAPTERS, params);
		} catch {
			return [];
		}
	}

	// Get course chapters
	static async getCourseChapters(courseId: string): Promise<IChapter[]> {
		return this.getChapters({courseId});
	}

	// Get chapter by ID
	static async getChapter(id: string): Promise<IChapter> {
		return ApiService.get<IChapter>(ENDPOINTS.CHAPTER(id));
	}

	// Create chapter
	static async createChapter(
		chapterData: CreateChapterRequest
	): Promise<IChapter> {
		return ApiService.post<IChapter, CreateChapterRequest>(
			ENDPOINTS.CHAPTERS,
			chapterData
		);
	}

	// Update chapter
	static async updateChapter(
		chapterData: UpdateChapterRequest
	): Promise<IChapter> {
		const {id, ...updateData} = chapterData;
		return ApiService.put<IChapter, ChapterFormData>(
			ENDPOINTS.CHAPTER(id),
			updateData
		);
	}

	// Delete chapter
	static async deleteChapter(id: string): Promise<void> {
		return ApiService.delete<void>(ENDPOINTS.CHAPTER(id));
	}

	// Reorder chapters
	static async reorderChapters(
		reorderData: ReorderChaptersRequest
	): Promise<IChapter[]> {
		return ApiService.put<IChapter[], ReorderChaptersRequest>(
			ENDPOINTS.CHAPTER_REORDER,
			reorderData
		);
	}

	// Toggle publish status
	static async toggleChapterPublish(id: string): Promise<IChapter> {
		return ApiService.put<IChapter>(ENDPOINTS.CHAPTER(id) + "/toggle-publish");
	}

	// Get public chapters for course
	static async getPublicChaptersForCourse(
		courseId: string
	): Promise<IPublicChapter[]> {
		try {
			const response = await ApiService.get<{
				chapters: IPublicChapter[];
			}>(`/chapters/course/${courseId}`);
			return response.chapters || [];
		} catch {
			return [];
		}
	}
}

export default ChaptersService;
