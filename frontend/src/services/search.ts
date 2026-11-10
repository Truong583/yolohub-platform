import { ApiService } from "@/lib/api-service";
import type { SearchResponse, SearchData, SearchParams } from "@/types/search";

const ENDPOINTS = {
  SEARCH: "/search",
} as const;

export class SearchService {
  /**
   * Search for courses and blogs
   */
  static async search(params: SearchParams): Promise<SearchData> {
    if (!params.q || params.q.trim().length < 2) {
      return { courses: [], blogs: [] };
    }

    try {
      return await ApiService.get<SearchResponse>(
        ENDPOINTS.SEARCH,
        params as unknown as Record<string, unknown>
      );
    } catch {
      return { courses: [], blogs: [] };
    }
  }
}

export default SearchService;
