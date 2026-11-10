import axios, {AxiosInstance, AxiosResponse, AxiosError} from "axios";

// Custom parameter serializer for arrays
const customParamsSerializer = (params: Record<string, unknown>) => {
	const searchParams = new URLSearchParams();

	Object.entries(params).forEach(([key, value]) => {
		if (value === null || value === undefined) {
			return; // Skip null/undefined values
		}

		if (Array.isArray(value)) {
			// For arrays, add multiple parameters with the same name (no brackets)
			value.forEach((item) => {
				if (item !== null && item !== undefined) {
					searchParams.append(key, String(item));
				}
			});
		} else {
			// For non-arrays, add normally
			searchParams.append(key, String(value));
		}
	});

	return searchParams.toString();
};

// API configuration
const API_CONFIG = {
	baseURL: process.env.NEXT_PUBLIC_API_URL || "https://yolo-server-v2.vercel.app/api/v1",
	timeout: 10000, // 10 seconds
	headers: {
		"Content-Type": "application/json",
	},
	paramsSerializer: customParamsSerializer,
};

// Create the main Axios instance
export const apiClient: AxiosInstance = axios.create(API_CONFIG);

// Request interceptor
apiClient.interceptors.request.use(
	(config) => {
		// Add auth token if available
		const token = getAuthToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		console.error("Request interceptor error:", error);
		return Promise.reject(error);
	}
);

// Response interceptor
apiClient.interceptors.response.use(
	(response: AxiosResponse) => response,
	(error: AxiosError) => {
		// Handle common error scenarios
		if (error.response?.status === 401) {
			handleUnauthorized();
		}

		return Promise.reject(error);
	}
);

// Helper functions
function getAuthToken(): string | null {
	// Get token from simple localStorage (not Zustand persist storage)
	if (typeof window !== "undefined") {
		return localStorage.getItem("access_token");
	}
	return null;
}

function handleUnauthorized(): void {
	// Clear auth tokens
	if (typeof window !== "undefined") {
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		// Redirect to login page
		// window.location.href = "/auth/sign-in";
	}
}

// Export configured instance
export default apiClient;
