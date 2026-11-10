// Chapter types

// Chapter interface
export interface IChapter {
	_id: string;
	title: string;
	description: string;
	order: number;
	isPublished: boolean;
	duration?: number;
	lessonIds: string[];
	lessons?: Array<{
		_id: string;
		title: string;
		contentType: "video" | "quiz" | "article";
		isPublished: boolean;
		preview: boolean;
		order: number;
		duration?: number;
		resource?: {
			description?: string;
			url?: string;
			totalAttemptsAllowed?: number;
			passingScorePercentage?: number;
		};
	}>;
}

// Chapter form data
export interface ChapterFormData {
	title: string;
	description: string;
	isPublished: boolean;
}

// Chapter request types
export interface CreateChapterRequest extends ChapterFormData {
	courseId: string;
}

export interface UpdateChapterRequest extends ChapterFormData {
	id: string;
}

export interface ReorderChaptersRequest {
	chapters: Array<{id: string; order: number}>;
}

export interface ChaptersFilterParams {
	courseId?: string;
	isPublished?: boolean;
	search?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	page?: number;
	limit?: number;
	[key: string]: unknown;
}

// Chapter list response (for consistency with other services)
export interface ChaptersListResponse {
	chapters: IChapter[];
	pagination?: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNextPage?: boolean;
		hasPrevPage?: boolean;
	};
}

// Public chapter interface (used by getPublicChaptersForCourse)
export interface IPublicChapter {
	_id: string;
	title: string;
	description: string;
	order: number;
	isPublished: boolean;
	duration?: number;
	lessonIds: string[];
	courseId: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	lessons?: Array<{
		_id: string;
		id: string;
		title: string;
		contentType: "video" | "quiz" | "article";
		preview: boolean;
		duration?: number;
	}>;
}

// Keep PopulatedChapter as alias for backward compatibility
export type PopulatedChapter = IChapter;
