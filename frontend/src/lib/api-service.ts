import {apiClient} from "@/lib/api-client";
import {AxiosResponse, AxiosError} from "axios";

// Generic API response type
export interface ApiResponse<T = unknown> {
	data: T;
	message?: string;
	success: boolean;
	meta?: {
		page?: number;
		limit?: number;
		total?: number;
		totalPages?: number;
	};
}

// API error response type
export interface ApiErrorResponse {
	message: string;
	errors?: Record<string, string[]>;
	code?: string;
	success: false;
}

// Generic API error type
export interface ApiError {
	message: string;
	errors?: Record<string, string[]>;
	code?: string;
}

// Generic API service class
export class ApiService {
	// GET request
	static async get<T>(
		url: string,
		params?: Record<string, unknown>
	): Promise<T> {
		try {
			const response: AxiosResponse<ApiResponse<T>> = await apiClient.get(url, {
				params,
			});

			return response.data.data;
		} catch (error) {
			throw this.handleError(error);
		}
	}

	// POST request
	static async post<T, D = unknown>(url: string, data?: D): Promise<T> {
		try {
			const response: AxiosResponse<ApiResponse<T>> = await apiClient.post(
				url,
				data
			);

			return response.data.data;
		} catch (error) {
			throw this.handleError(error);
		}
	}

	// PUT request
	static async put<T, D = unknown>(url: string, data?: D): Promise<T> {
		try {
			const response: AxiosResponse<ApiResponse<T>> = await apiClient.put(
				url,
				data
			);

			return response.data.data;
		} catch (error) {
			throw this.handleError(error);
		}
	}

	// PATCH request
	static async patch<T, D = unknown>(url: string, data?: D): Promise<T> {
		try {
			const response: AxiosResponse<ApiResponse<T>> = await apiClient.patch(
				url,
				data
			);

			return response.data.data;
		} catch (error) {
			throw this.handleError(error);
		}
	}

	// DELETE request
	static async delete<T, D = unknown>(url: string, data?: D): Promise<T> {
		try {
			const response: AxiosResponse<ApiResponse<T>> = await apiClient.delete(
				url,
				data ? {data} : undefined
			);
			return response.data.data;
		} catch (error) {
			throw this.handleError(error);
		}
	}

	// Download blob (for file downloads)
	static async downloadBlob(url: string): Promise<Blob> {
		try {
			const response: AxiosResponse<Blob> = await apiClient.get(url, {
				responseType: "blob",
			});

			return response.data;
		} catch (error) {
			throw this.handleError(error);
		}
	}

	// Error handler
	private static handleError(error: unknown): ApiError {
		const axiosError = error as AxiosError<ApiErrorResponse>;

		if (axiosError.response) {
			// Server responded with error status
			const apiError: ApiError = {
				message: axiosError.response.data?.message || "An error occurred",
				errors: axiosError.response.data?.errors,
				code: axiosError.response.data?.code,
			};
			return apiError;
		} else if (axiosError.request) {
			// Request was made but no response received
			return {
				message: "Network error - please check your connection",
				code: "NETWORK_ERROR",
			};
		} else {
			// Something else happened
			return {
				message: axiosError.message || "An unexpected error occurred",
				code: "UNKNOWN_ERROR",
			};
		}
	}
}

// Export for direct use
export default ApiService;
