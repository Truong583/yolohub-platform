import {ApiService} from "@/lib/api-service";
import {
	IBlog,
	CreateBlogRequest,
	UpdateBlogRequest,
	BlogsListResponse,
	BlogsFilterParams,
} from "@/types/blog";

const ENDPOINTS = {
	BLOGS: "/blogs",
	BLOGS_PUBLISH: "/blogs/publish",
	BLOGS_ALL: "/blogs/all",
	BLOG: (id: string) => `/blogs/${id}`,
	BLOG_BY_SLUG: (slug: string) => `/blogs/slug/${slug}`,
} as const;

export class BlogsService {
	// Get blogs with pagination
	static async getBlogs(
		params?: BlogsFilterParams
	): Promise<BlogsListResponse> {
		try {
			return await ApiService.get<BlogsListResponse>(
				ENDPOINTS.BLOGS,
				params as Record<string, unknown>
			);
		} catch {
			return {
				blogs: [],
				pagination: {
					page: params?.page || 1,
					limit: params?.limit || 10,
					total: 0,
					totalPages: 0,
				},
			};
		}
	}

	// Get published blogs with pagination
	static async getPublishedBlogs(
		params?: Omit<BlogsFilterParams, "status">
	): Promise<BlogsListResponse> {
		try {
			return await ApiService.get<BlogsListResponse>(
				ENDPOINTS.BLOGS_PUBLISH,
				params as Record<string, unknown>
			);
		} catch {
			return {
				blogs: [],
				pagination: {
					page: params?.page || 1,
					limit: params?.limit || 10,
					total: 0,
					totalPages: 0,
				},
			};
		}
	}

	// Get all blogs
	static async getAllBlogs(): Promise<IBlog[]> {
		try {
			const response = await ApiService.get<{blogs: IBlog[]}>(
				ENDPOINTS.BLOGS_ALL
			);
			return response.blogs || [];
		} catch {
			return [];
		}
	}

	// Get blog by ID
	static async getBlog(id: string): Promise<IBlog> {
		return ApiService.get<IBlog>(ENDPOINTS.BLOG(id));
	}

	// Get blog by slug
	static async getBlogBySlug(slug: string): Promise<IBlog> {
		const response = await ApiService.get<{blog: IBlog}>(
			ENDPOINTS.BLOG_BY_SLUG(slug)
		);
		return response.blog;
	}

	// Create blog
	static async createBlog(blogData: CreateBlogRequest): Promise<IBlog> {
		return ApiService.post<IBlog, CreateBlogRequest>(ENDPOINTS.BLOGS, blogData);
	}

	// Update blog
	static async updateBlog(blogData: UpdateBlogRequest): Promise<IBlog> {
		const {id, ...updateData} = blogData;
		return ApiService.put<IBlog, Omit<UpdateBlogRequest, "id">>(
			ENDPOINTS.BLOG(id),
			updateData
		);
	}

	// Patch blog
	static async patchBlog(
		id: string,
		blogData: Partial<CreateBlogRequest>
	): Promise<IBlog> {
		return ApiService.patch<IBlog, Partial<CreateBlogRequest>>(
			ENDPOINTS.BLOG(id),
			blogData
		);
	}

	// Delete blog
	static async deleteBlog(id: string): Promise<void> {
		return ApiService.delete<void>(ENDPOINTS.BLOG(id));
	}

	// Bulk operations
	static async bulkDeleteBlogs(blogIds: string[]): Promise<void> {
		return ApiService.delete<void, {blogIds: string[]}>(
			`${ENDPOINTS.BLOGS}/bulk-delete`,
			{blogIds}
		);
	}
}

export default BlogsService;
