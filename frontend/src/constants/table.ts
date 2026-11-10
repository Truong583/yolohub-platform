// Table configuration constants
export const TABLE_CONSTANTS = {
	// Default sorting
	DEFAULT_SORT_BY: "createdAt",
	DEFAULT_SORT_ORDER: "desc" as const,

	// Search and filtering
	SEARCH_DEBOUNCE_MS: 500,

	// Selection
	ENABLE_ROW_SELECTION: true,
	ENABLE_COLUMN_VISIBILITY: true,
};

// Sort order type for better type safety
export type SortOrder = typeof TABLE_CONSTANTS.DEFAULT_SORT_ORDER | "asc";
