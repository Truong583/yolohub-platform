import {CategoryStatus} from "@/types/category";
import * as yup from "yup";

const categorySchema = yup
	.object({
		name: yup
			.string()
			.required("Category name is required")
			.min(2, "Category name must be at least 2 characters")
			.max(50, "Category name must not exceed 50 characters")
			.matches(
				/^[a-zA-Z0-9\s\-_]+$/,
				"Category name can only contain letters, numbers, spaces, hyphens, and underscores"
			),
		slug: yup
			.string()
			.required("Slug is required")
			.min(2, "Slug must be at least 2 characters")
			.max(50, "Slug must not exceed 50 characters")
			.matches(
				/^[a-z0-9\-]+$/,
				"Slug can only contain lowercase letters, numbers, and hyphens"
			),
		status: yup
			.mixed<CategoryStatus>()
			.oneOf(Object.values(CategoryStatus))
			.required("Status is required"),
	})
	.required();

export type CategorySchema = yup.InferType<typeof categorySchema>;
export {categorySchema};
