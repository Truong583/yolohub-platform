import {ApiService} from "@/lib/api-service";

// Chatbot API endpoints
const ENDPOINTS = {
	SEND_MESSAGE: "/chatbot/message",
} as const;

// Request/Response types for chatbot
export interface SendMessageRequest {
	message: string;
}

export interface ChatbotCourse {
	id: string;
	slug: string;
	title: string;
	price: number;
	oldPrice?: number;
	image: string;
	level: string;
}

// Remove this interface since SendMessageResponse now contains the data directly

// The API response is directly the chatbot response data
export interface SendMessageResponse {
	response: string;
	courses?: ChatbotCourse[];
	suggestions?: string[];
	intent: string;
	timestamp: string;
}

class ChatbotService {
	/**
	 * Send a message to the chatbot
	 */
	static async sendMessage(
		request: SendMessageRequest
	): Promise<SendMessageResponse> {
		const response = await ApiService.post<SendMessageResponse>(
			ENDPOINTS.SEND_MESSAGE,
			request
		);

		return response;
	}
}

export default ChatbotService;
