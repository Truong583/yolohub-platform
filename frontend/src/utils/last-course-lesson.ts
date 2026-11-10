// Utility functions for managing last course lesson in localStorage

export interface LastCourseLesson {
	course: string;
	lesson: string;
}

const STORAGE_KEY = "lastCourseLesson";

/**
 * Get all last course lessons from localStorage
 */
export function getAllLastCourseLessons(): LastCourseLesson[] {
	try {
		const data = localStorage.getItem(STORAGE_KEY);
		if (!data) return [];

		const parsed = JSON.parse(data);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

/**
 * Get the last lesson for a specific course
 */
export function getLastLessonForCourse(courseSlug: string): string | null {
	try {
		const allCourseLessons = getAllLastCourseLessons();
		const courseEntry = allCourseLessons.find(
			(entry) => entry.course === courseSlug
		);
		return courseEntry?.lesson || null;
	} catch {
		return null;
	}
}

/**
 * Save or update the last lesson for a specific course
 */
export function saveLastLessonForCourse(
	courseSlug: string,
	lessonId: string
): void {
	try {
		const allCourseLessons = getAllLastCourseLessons();

		// Find existing entry for current course
		const existingIndex = allCourseLessons.findIndex(
			(entry) => entry.course === courseSlug
		);

		const newEntry: LastCourseLesson = {
			course: courseSlug,
			lesson: lessonId,
		};

		if (existingIndex >= 0) {
			// Update existing entry
			allCourseLessons[existingIndex] = newEntry;
		} else {
			// Add new entry
			allCourseLessons.push(newEntry);
		}

		// Save updated array back to localStorage
		localStorage.setItem(STORAGE_KEY, JSON.stringify(allCourseLessons));
	} catch (error) {
		console.error("Failed to save last lesson for course:", error);
	}
}
