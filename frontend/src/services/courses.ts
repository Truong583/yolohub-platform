import {ApiService} from "@/lib/api-service";
import type {
	ICourse,
	IPublicCourse,
	CreateCourseRequest,
	UpdateCourseRequest,
	CoursesListResponse,
	CoursesListParams,
	PublicCoursesListResponse,
	IEnrolledCourse,
} from "@/types/course";

const ENDPOINTS = {
	COURSES: "/courses",
	PUBLIC_COURSES: "/courses/public",
	MY_COURSES: "/courses/my-courses",
	COURSE: (id: string) => `/courses/${id}`,
	PUBLIC_COURSE_BY_SLUG: (slug: string) => `/courses/slug/${slug}`,
	ENROLL_FREE: (id: string) => `/courses/${id}/enroll-free`,
} as const;

export class CoursesService {
	// Get courses with filtering
	static async getCourses(
		params?: CoursesListParams
	): Promise<CoursesListResponse> {
		try {
			return await ApiService.get<CoursesListResponse>(
				ENDPOINTS.COURSES,
				params as Record<string, unknown>
			);
		} catch {
			return {
				courses: [],
				pagination: {
					page: params?.page || 1,
					limit: params?.limit || 10,
					total: 0,
					totalPages: 0,
				},
			};
		}
	}

	// Get public courses
	static async getPublicCourses(
		params?: CoursesListParams
	): Promise<PublicCoursesListResponse> {
		try {
			return await ApiService.get<PublicCoursesListResponse>(
				ENDPOINTS.PUBLIC_COURSES,
				params as Record<string, unknown>
			);
		} catch (error) {
			console.error("Error fetching public courses:", error);
			return {
				courses: [],
				pagination: {
					page: params?.page || 1,
					limit: params?.limit || 10,
					total: 0,
					totalPages: 0,
					hasNextPage: false,
					hasPrevPage: false,
				},
			};
		}
	}

	// Get course by ID
	static async getCourse(id: string): Promise<ICourse> {
		return ApiService.get<ICourse>(ENDPOINTS.COURSE(id));
	}

	// Get public course by slug
	static async getPublicCourseBySlug(slug: string): Promise<IPublicCourse> {
		return ApiService.get<IPublicCourse>(ENDPOINTS.PUBLIC_COURSE_BY_SLUG(slug));
	}

	// Create course
	static async createCourse(courseData: CreateCourseRequest): Promise<ICourse> {
		return ApiService.post<ICourse, CreateCourseRequest>(
			ENDPOINTS.COURSES,
			courseData
		);
	}

	// Update course
	static async updateCourse(courseData: UpdateCourseRequest): Promise<ICourse> {
		const {id, ...updateData} = courseData;
		return ApiService.put<ICourse, Partial<CreateCourseRequest>>(
			ENDPOINTS.COURSE(id),
			updateData
		);
	}

	// Patch course
	static async patchCourse(
		id: string,
		courseData: Partial<CreateCourseRequest>
	): Promise<ICourse> {
		return ApiService.patch<ICourse, Partial<CreateCourseRequest>>(
			ENDPOINTS.COURSE(id),
			courseData
		);
	}

	// Delete course
	static async deleteCourse(id: string): Promise<void> {
		return ApiService.delete<void>(ENDPOINTS.COURSE(id));
	}

	// Bulk operations
	static async bulkDeleteCourses(courseIds: string[]): Promise<void> {
		return ApiService.delete<void, {courseIds: string[]}>(
			`${ENDPOINTS.COURSES}/bulk-delete`,
			{courseIds}
		);
	}

	// Update course status
	static async updateCourseStatus(
		id: string,
		status: string
	): Promise<ICourse> {
		return ApiService.patch<ICourse, {status: string}>(ENDPOINTS.COURSE(id), {
			status,
		});
	}

	// Update free status
	static async updateCourseFreeStatus(
		id: string,
		isFree: boolean
	): Promise<ICourse> {
		return ApiService.patch<ICourse, {isFree: boolean}>(ENDPOINTS.COURSE(id), {
			isFree,
		});
	}

	// Get related courses
	static async getRelatedCourses(courseId: string): Promise<IPublicCourse[]> {
		try {
			return await ApiService.get<IPublicCourse[]>(
				`/courses/${courseId}/related`
			);
		} catch {
			return [];
		}
	}

	// Enroll free course
	static async enrollFree(courseId: string): Promise<{message: string}> {
		return ApiService.post<{message: string}, Record<string, never>>(
			ENDPOINTS.ENROLL_FREE(courseId),
			{}
		);
	}

	// Get user's enrolled courses with progress
	static async getMyCourses(): Promise<IEnrolledCourse[]> {
		try {
			return await ApiService.get<IEnrolledCourse[]>(ENDPOINTS.MY_COURSES);
		} catch {
			return [];
		}
	}
}

export default CoursesService;
