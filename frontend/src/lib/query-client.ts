import {QueryClient} from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: 10 * 60 * 1000,
			retry: false,
		},
	},
});
