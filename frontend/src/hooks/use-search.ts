import {useDebounce} from "@/hooks/use-debounce";
import SearchService from "@/services/search";
import {useQuery} from "@tanstack/react-query";

// Query keys for search
export const searchKeys = {
	all: ["search"] as const,
	queries: () => [...searchKeys.all, "query"] as const,
	query: (query: string) => [...searchKeys.queries(), query] as const,
};

interface UseSearchOptions {
	debounceDelay?: number;
	minQueryLength?: number;
	enabled?: boolean;
}

// Hook for basic search with debouncing
export function useSearch(query: string, options: UseSearchOptions = {}) {
	const {debounceDelay = 300, minQueryLength = 2, enabled = true} = options;
	const debouncedQuery = useDebounce(query, debounceDelay);

	return useQuery({
		queryKey: searchKeys.query(debouncedQuery),
		queryFn: () => SearchService.search({q: debouncedQuery}),
		enabled: enabled && debouncedQuery.length >= minQueryLength,
	});
}
