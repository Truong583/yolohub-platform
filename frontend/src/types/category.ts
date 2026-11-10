// Category status enum

export enum CategoryStatus {
	ACTIVE = "active",
	INACTIVE = "inactive",
}

// Base category interface representing the category entity
export interface ICategory {
	_id: string;
	name: string;
	slug: string;
	status: CategoryStatus;
	createdAt: string;
	updatedAt: string;
}

// Form data interface for creating/updating categories
export interface CategoryFormData {
	name: string;
	slug: string;
	status: CategoryStatus;
}

// Statistics interface for category metrics
export interface CategoryStats {
	totalCategories: number;
	activeCategories: number;
	inactiveCategories: number;
	totalCourses?: number; // Optional - total courses across all categories
}

// Category with additional computed properties
export interface ICategoryWithStats extends ICategory {
	coursesCount?: number; // Number of courses in this category
	studentsCount?: number; // Number of students enrolled in courses of this category
}

// Pagination interface for category lists
export interface CategoryPagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNextPage?: boolean;
	hasPrevPage?: boolean;
}

// Categories list response
export interface CategoriesListResponse {
	categories: ICategory[];
	pagination: CategoryPagination;
}

// Filter and search parameters for categories
export interface CategoriesFilterParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: string[];
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

// Category creation request
export interface CreateCategoryRequest {
	name: string;
	slug: string;
	status?: CategoryStatus;
}

// Category update request
export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
	id: string;
}
