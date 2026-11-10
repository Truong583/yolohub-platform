// Course types based on the MongoDB schema

import type {IChapter} from "@/types/chapter";

export enum CourseLevel {
	BEGINNER = "beginner",
	INTERMEDIATE = "intermediate",
	ADVANCED = "advanced",
}

export enum CourseStatus {
	DRAFT = "draft",
	PUBLISHED = "published",
}

export enum LessonType {
	VIDEO = "video",
	TEXT = "text",
	QUIZ = "quiz",
	ASSIGNMENT = "assignment",
}

// Q&A interface for course info
export interface CourseQA {
	question: string;
	answer: string;
}

// Course info object interface
export interface CourseInfo {
	requirements: string[];
	benefits: string[];
	techniques: string[];
	documents: string[];
	qa: CourseQA[];
}

// Lesson interface
export interface ILesson {
	_id: string;
	title: string;
	description: string;
	content: string;
	type: LessonType;
	duration?: number; // in minutes
	order: number;
	isPublished: boolean;
	isFree: boolean;
	videoUrl?: string;
	attachments?: string[];
	chapterId: string;
	createdAt: Date;
	updatedAt: Date;
}

// Populated lesson interface (for API responses)
export interface PopulatedLesson {
	_id: string;
	title: string;
	description: string;
	content: string;
	type: LessonType;
	duration?: number;
	order: number;
	isPublished: boolean;
	isFree: boolean;
	videoUrl?: string;
	attachments?: string[];
}

// Populated author interface (subset of IUser)
export interface PopulatedAuthor {
	_id: string;
	firstName: string;
	lastName: string;
	username?: string;
	email?: string;
	avatar?: string;
}

// Populated category interface (subset of ICategory)
export interface PopulatedCategory {
	_id: string;
	name: string;
}

// Main course interface following MongoDB schema with populated fields
export interface ICourse {
	_id: string; // mongoose.Types.ObjectId as string
	title: string;
	slug: string;
	excerpt: string; // Short summary/excerpt of the course
	image: string; // Optional (empty string if not provided)
	description: string; // Optional (empty string if not provided)
	introUrl: string; // Optional (empty string if not provided)
	price: number;
	oldPrice: number;
	isFree: boolean;
	status: CourseStatus;
	authorId: string; // mongoose.Types.ObjectId as string (for reference)
	categoryId: string; // mongoose.Types.ObjectId as string (for reference)
	chapterIds: string[]; // mongoose.Types.ObjectId[] as string[] (for reference)
	view: number;
	sold: number;
	level: CourseLevel;
	info: CourseInfo;
	// Review statistics
	averageRating?: number;
	totalReviews?: number;
	// Course statistics
	totalDuration?: number; // in minutes
	enrolledStudents?: number;
	// Populated fields
	author: PopulatedAuthor;
	category: PopulatedCategory;
	chapters: IChapter[];
	createdAt: Date;
	updatedAt: Date;
}

// Public course interface (for public API responses - simplified structure)
// Inherits from ICourse but overrides some fields for public view
export interface IPublicCourse
	extends Omit<
		ICourse,
		| "author"
		| "category"
		| "chapters"
		| "info"
		| "authorId"
		| "categoryId"
		| "chapterIds"
	> {
	// Simplified populated fields for public view
	author: {
		_id: string;
		username: string;
		firstName?: string;
		lastName?: string;
		avatar?: string;
	};
	category: {
		_id: string;
		name: string;
		slug?: string;
	};
	// Basic chapter info without sensitive data
	chaptersCount?: number;
	lessonsCount?: number;
	totalLessons?: number;
	// Simplified course info for public view
	info?: {
		requirements?: string[];
		benefits?: string[];
		techniques?: string[];
		documents?: string[];
		qa?: CourseQA[];
	};
}

// API request types (use reference IDs, not populated objects)
export interface CreateCourseRequest {
	title: string;
	slug: string;
	excerpt?: string;
	image?: string;
	description?: string;
	introUrl?: string;
	price: number;
	oldPrice: number;
	isFree: boolean;
	status: CourseStatus;
	categoryId: string;
	level: CourseLevel;
	info: CourseInfo;
}

// Lesson form data
export interface LessonFormData {
	title: string;
	description: string;
	content: string;
	type: LessonType;
	duration?: number;
	isPublished: boolean;
	isFree: boolean;
	videoUrl?: string;
}

// Helper types for course level options
export type CourseLevelOption = {
	label: string;
	value: CourseLevel;
};

// Course display type helpers for filtering and display
export type CourseDisplayStatus = "published" | "draft";
export type CourseDisplayType = "free" | "paid";

// Helper function to determine if course is free based on price and isFree flag
export function isCourseActuallyFree(course: ICourse): boolean {
	return course.isFree || course.price === 0;
}

// Helper function to get course display status
export function getCourseDisplayStatus(course: ICourse): CourseDisplayStatus {
	return course.status;
}

// Helper function to get course display type
export function getCourseDisplayType(course: ICourse): CourseDisplayType {
	return isCourseActuallyFree(course) ? "free" : "paid";
}

// Course service types
export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
	id: string;
}

export interface CoursesListParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: string[];
	minPrice?: number;
	maxPrice?: number;
	level?: string[];
	categoryId?: string;
	minRating?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	type?: string[];
	[key: string]: unknown;
}

export interface CoursesListResponse {
	courses: ICourse[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNextPage?: boolean;
		hasPrevPage?: boolean;
	};
}

export interface PublicCoursesListResponse {
	courses: IPublicCourse[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	};
}

// Enrolled course with progress tracking
export interface IEnrolledCourse {
	_id: string;
	title: string;
	slug: string;
	image: string;
	description: string;
	level: CourseLevel;
	averageRating: number;
	totalReviews: number;
	totalLessons: number;
	completedLessons: number;
}
