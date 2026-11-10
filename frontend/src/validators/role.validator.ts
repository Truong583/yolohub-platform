import * as yup from "yup";
export const roleSchema = yup
	.object({
		name: yup
			.string()
			.required("Role name is required")
			.min(2, "Role name must be at least 2 characters")
			.max(50, "Role name must not exceed 50 characters")
			.matches(
				/^[a-zA-Z0-9\s\-_]+$/,
				"Role name can only contain letters, numbers, spaces, hyphens, and underscores"
			),
		description: yup
			.string()
			.required("Description is required")
			.min(10, "Description must be at least 10 characters")
			.max(200, "Description must not exceed 200 characters"),
		permissions: yup.array().of(yup.string().required()).default([]).optional(),
		inherits: yup.array().of(yup.string().required()).default([]),
	})
	.required();

export type RoleSchema = yup.InferType<typeof roleSchema>;
