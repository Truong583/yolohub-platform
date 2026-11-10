import {BlogStatus} from "@/types/blog";
import * as yup from "yup";

export const blogSchema = yup
	.object({
		title: yup.string().required("Title is required").min(3).max(200),
		slug: yup
			.string()
			.required("Slug is required")
			.matches(
				/^[a-z0-9-]+$/,
				"Slug must contain only lowercase letters, numbers, and hyphens"
			),
		content: yup
			.string()
			.required("Content is required")
			.min(50, "Content must be at least 50 characters"),
		excerpt: yup.string().required("Excerpt is required").min(10).max(300),
		thumbnail: yup
			.string()
			.optional()
			.default("")
			.test(
				"is-url",
				"Must be a valid URL",
				(value) => !value || yup.string().url().isValidSync(value)
			),
		status: yup
			.mixed<BlogStatus>()
			.oneOf(Object.values(BlogStatus))
			.required("Status is required"),
		publishedAt: yup
			.date()
			.required("Published date is required")
			.test("is-valid-date", "Must be a valid date", function (value) {
				return value instanceof Date && !isNaN(value.getTime());
			}),
		categoryId: yup.string().required("Category is required"),
	})
	.required();

export type BlogSchema = yup.InferType<typeof blogSchema>;
