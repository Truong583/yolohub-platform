// Pagination configuration constants
export const PAGINATION_CONSTANTS = {
	// Default page size
	DEFAULT_PAGE_SIZE: 10,

	// Available page size options
	PAGE_SIZE_OPTIONS: [5, 10, 20, 50],

	// Default starting page
	DEFAULT_PAGE: 1,

	// Pagination limits
	MIN_PAGE_SIZE: 5,
	MAX_PAGE_SIZE: 100,
};

// Type for page size options
export type PageSizeOption =
	(typeof PAGINATION_CONSTANTS.PAGE_SIZE_OPTIONS)[number];
