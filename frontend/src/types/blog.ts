// Blog status enum
export enum BlogStatus {
	DRAFT = "draft",
	PUBLISHED = "published",
}

// Author interface for populated author data
export interface IBlogAuthor {
	_id: string;
	email: string;
	name?: string;
	username?: string;
	avatar?: string;
}

// Category interface for populated category data
export interface IBlogCategory {
	_id: string;
	name: string;
	slug: string;
}

// Base blog interface representing the blog entity
export interface IBlog {
	_id: string;
	title: string;
	slug: string;
	content: string;
	excerpt: string;
	thumbnail: string;
	authorId?: string; // Keep for backward compatibility
	author: IBlogAuthor; // Populated author object
	status: BlogStatus;
	publishedAt: string | null;
	categoryIds?: string[]; // Keep for backward compatibility
	categoryId?: string; // Single category field for forms
	category: IBlogCategory; // Populated category object
	createdAt: string;
	updatedAt: string;
}

// Form data interface for creating/updating blogs
export interface BlogFormData {
	title: string;
	slug: string;
	content: string;
	excerpt: string;
	thumbnail: string;
	authorId: string;
	status: BlogStatus;
	publishedAt: string | null;
	categoryIds: string[];
}

// Statistics interface for blog metrics
export interface BlogStats {
	totalBlogs: number;
	publishedBlogs: number;
	draftBlogs: number;
	totalViews?: number; // Optional - total views across all blogs
}

// Blog with additional computed properties
export interface IBlogWithStats extends Omit<IBlog, "author" | "category"> {
	viewsCount?: number; // Number of views for this blog
	commentsCount?: number; // Number of comments on this blog
	author?: IBlogAuthor;
	category?: IBlogCategory;
	categories?: IBlogCategory[]; // For backward compatibility
}

// Pagination interface for blog lists
export interface BlogPagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNextPage?: boolean;
	hasPrevPage?: boolean;
}

// Blogs list response
export interface BlogsListResponse {
	blogs: IBlog[];
	pagination: BlogPagination;
}

// Filter and search parameters for blogs
export interface BlogsFilterParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: BlogStatus | BlogStatus[];
	authorId?: string;
	categoryIds?: string[];
	sortBy?: keyof IBlog;
	sortOrder?: "asc" | "desc";
}

// Blog creation request
export interface CreateBlogRequest {
	title: string;
	slug: string;
	content: string;
	excerpt: string;
	thumbnail?: string;
	status?: BlogStatus;
	publishedAt?: string | null;
	categoryId: string;
}

// Blog update request
export interface UpdateBlogRequest extends Partial<CreateBlogRequest> {
	id: string;
}
