export const ROUTE_CONFIG = {
	HOME: "/",
	COURSES: "/courses",
	BLOGS: "/blogs",
	ABOUT: "/about",
	CONTACT: "/contact",
	DEMO: "/demo",
	CART: "/cart",
	SEARCH: "/search",
	QR_PAYMENT: "/qr-payment",
	STRIPE_PAYMENT: "/stripe-payment",
	AUTH: {
		SIGN_IN: "/auth/sign-in",
		SIGN_UP: "/auth/sign-up",
		FORGOT_PASSWORD: "/auth/forgot-password",
		RESET_PASSWORD: "/auth/reset-password",
		VERIFY_EMAIL: "/auth/verify-email",
	},
	LEARNING: "/learning",
	PROFILE: {
		MY_PROFILE: "/my-profile",
		MY_ORDERS: "/my-orders",
		MY_POSTS: "/my-posts",
		SAVED_POSTS: "/saved-posts",
		SETTINGS: "/settings",
	},
	FORBIDDEN: "/forbidden",
	UNAUTHORIZED: "/unauthorized",
	ADMIN: {
		DASHBOARD: "/admin/dashboard",
		USERS: "/admin/users",
		COURSES: "/admin/courses",
		CATEGORIES: "/admin/categories",
		BLOGS: "/admin/blogs",
		COMMENTS: "/admin/comments",
		COUPONS: "/admin/coupons",
		ORDERS: "/admin/orders",
		ROLES: "/admin/roles",
	},
};

// Helper functions for dynamic routes
export const getRoutes = {
	courseDetail: (slug: string) => `${ROUTE_CONFIG.COURSES}/${slug}`,
	blogDetail: (slug: string) => `${ROUTE_CONFIG.BLOGS}/${slug}`,
	searchWithQuery: (query: string) =>
		`${ROUTE_CONFIG.SEARCH}?q=${encodeURIComponent(query)}`,
	learning: (courseSlug: string, lessonId?: string) =>
		lessonId
			? `${ROUTE_CONFIG.LEARNING}/${courseSlug}?id=${lessonId}`
			: `${ROUTE_CONFIG.LEARNING}/${courseSlug}`,
};
