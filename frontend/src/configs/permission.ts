/**
 * Simplified RBAC Permission Constants
 * Uses standard CRUD operations for easier UI management
 */

// Resource-based CRUD permissions
export const PERMISSIONS = {
	// User Management
	USER_CREATE: "user:create",
	USER_READ: "user:read",
	USER_UPDATE: "user:update",
	USER_DELETE: "user:delete",

	// Course Management
	COURSE_CREATE: "course:create",
	COURSE_READ: "course:read",
	COURSE_UPDATE: "course:update",
	COURSE_DELETE: "course:delete",

	// Chapter Management
	CHAPTER_CREATE: "chapter:create",
	CHAPTER_READ: "chapter:read",
	CHAPTER_UPDATE: "chapter:update",
	CHAPTER_DELETE: "chapter:delete",

	// Lesson Management
	LESSON_CREATE: "lesson:create",
	LESSON_READ: "lesson:read",
	LESSON_UPDATE: "lesson:update",
	LESSON_DELETE: "lesson:delete",

	// Category Management
	CATEGORY_CREATE: "category:create",
	CATEGORY_READ: "category:read",
	CATEGORY_UPDATE: "category:update",
	CATEGORY_DELETE: "category:delete",

	// Blog Management
	BLOG_CREATE: "blog:create",
	BLOG_READ: "blog:read",
	BLOG_UPDATE: "blog:update",
	BLOG_DELETE: "blog:delete",

	// Coupon Management
	COUPON_CREATE: "coupon:create",
	COUPON_READ: "coupon:read",
	COUPON_UPDATE: "coupon:update",
	COUPON_DELETE: "coupon:delete",

	// Review Management
	REVIEW_CREATE: "review:create",
	REVIEW_READ: "review:read",
	REVIEW_UPDATE: "review:update",
	REVIEW_DELETE: "review:delete",

	// Comment Management
	COMMENT_CREATE: "comment:create",
	COMMENT_READ: "comment:read",
	COMMENT_UPDATE: "comment:update",
	COMMENT_DELETE: "comment:delete",

	// Role Management
	ROLE_CREATE: "role:create",
	ROLE_READ: "role:read",
	ROLE_UPDATE: "role:update",
	ROLE_DELETE: "role:delete",

	// Quiz Question Management
	QUIZ_QUESTION_CREATE: "quiz_question:create",
	QUIZ_QUESTION_READ: "quiz_question:read",
	QUIZ_QUESTION_UPDATE: "quiz_question:update",
	QUIZ_QUESTION_DELETE: "quiz_question:delete",

	// Order Management
	ORDER_CREATE: "order:create",
	ORDER_READ: "order:read",
	ORDER_UPDATE: "order:update",
	ORDER_DELETE: "order:delete",
} as const;

// Resource definitions for UI generation
export const RESOURCES = {
	USER: "user",
	COURSE: "course",
	CHAPTER: "chapter",
	LESSON: "lesson",
	COUPON: "coupon",
	CATEGORY: "category",
	BLOG: "blog",
	REVIEW: "review",
	COMMENT: "comment",
	ROLE: "role",
	QUIZ_QUESTION: "quiz_question",
	ORDER: "order",
} as const;

// CRUD operations
export const OPERATIONS = {
	CREATE: "create",
	READ: "read",
	UPDATE: "update",
	DELETE: "delete",
} as const;

// Helper function to generate permission strings
export const generatePermission = (
	resource: string,
	operation: string
): string => {
	return `${resource}:${operation}`;
};

// Helper function to get all permissions for a resource
export const getResourcePermissions = (
	resource: keyof typeof RESOURCES
): string[] => {
	const resourceName = RESOURCES[resource];
	return Object.values(OPERATIONS).map((op) =>
		generatePermission(resourceName, op)
	);
};

// All permissions as an array
export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

export const PERMISSION_GROUPS = {
	user: {
		label: "User Management",
		permissions: getResourcePermissions("USER"),
	},
	course: {
		label: "Course Management",
		permissions: getResourcePermissions("COURSE"),
	},
	chapter: {
		label: "Chapter Management",
		permissions: getResourcePermissions("CHAPTER"),
	},
	lesson: {
		label: "Lesson Management",
		permissions: getResourcePermissions("LESSON"),
	},
	category: {
		label: "Category Management",
		permissions: getResourcePermissions("CATEGORY"),
	},
	blog: {
		label: "Blog Management",
		permissions: getResourcePermissions("BLOG"),
	},
	coupon: {
		label: "Coupon Management",
		permissions: getResourcePermissions("COUPON"),
	},
	review: {
		label: "Review Management",
		permissions: getResourcePermissions("REVIEW"),
	},
	comment: {
		label: "Comment Management",
		permissions: getResourcePermissions("COMMENT"),
	},
	role: {
		label: "Role Management",
		permissions: getResourcePermissions("ROLE"),
	},
	quiz_question: {
		label: "Quiz Question Management",
		permissions: getResourcePermissions("QUIZ_QUESTION"),
	},
	order: {
		label: "Order Management",
		permissions: getResourcePermissions("ORDER"),
	},
} as const;

// Common system role names (for reference)
export const SYSTEM_ROLE_NAMES = {
	SUPER_ADMIN: "Super Admin",
	ADMIN: "Admin",
	STUDENT: "Student",
	GUEST: "Guest",
} as const;

export type SystemRoleName =
	(typeof SYSTEM_ROLE_NAMES)[keyof typeof SYSTEM_ROLE_NAMES];

// Type definitions
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
export type PermissionGroup = keyof typeof PERMISSION_GROUPS;
