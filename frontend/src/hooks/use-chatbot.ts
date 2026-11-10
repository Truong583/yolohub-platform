"use client";

import {useState, useCallback} from "react";
import {useMutation} from "@tanstack/react-query";
import {Message} from "@/types/chatbot";
import ChatbotService, {SendMessageRequest} from "@/services/chatbot";

interface UseChatbotReturn {
	isOpen: boolean;
	messages: Message[];
	isLoading: boolean;
	openChat: () => void;
	closeChat: () => void;
	toggleChat: () => void;
	sendMessage: (text: string) => void;
}

// Query keys for chatbot
export const chatbotKeys = {
	all: ["chatbot"] as const,
	messages: () => [...chatbotKeys.all, "messages"] as const,
} as const;

function generateMessageId(): string {
	return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function useChatbot(): UseChatbotReturn {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);

	// TanStack Query mutation for sending messages
	const chatbotMutation = useMutation({
		mutationFn: (request: SendMessageRequest) =>
			ChatbotService.sendMessage(request),
		onSuccess: (response) => {
			console.log("response", response);
			// Add AI response message with full data
			const aiMessage: Message = {
				id: generateMessageId(),
				text: response.response,
				isUser: false,
				timestamp: new Date(),
				courses: response.courses,
				suggestions: response.suggestions,
				intent: response.intent,
			};

			setMessages((prev) => [...prev, aiMessage]);
		},
		onError: (error) => {
			console.error("Failed to send message:", error);

			// Add error message
			const errorMessage: Message = {
				id: generateMessageId(),
				text: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.",
				isUser: false,
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, errorMessage]);
		},
	});

	const openChat = useCallback(() => {
		setIsOpen(true);
	}, []);

	const closeChat = useCallback(() => {
		setIsOpen(false);
	}, []);

	const toggleChat = useCallback(() => {
		if (isOpen) {
			closeChat();
		} else {
			openChat();
		}
	}, [isOpen, openChat, closeChat]);

	const sendMessage = useCallback(
		async (text: string) => {
			// Add user message immediately
			const userMessage: Message = {
				id: generateMessageId(),
				text,
				isUser: true,
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, userMessage]);

			// Send to API using TanStack Query mutation
			chatbotMutation.mutate({message: text});
		},
		[chatbotMutation]
	);

	return {
		isOpen,
		messages,
		isLoading: chatbotMutation.isPending, // Use TanStack Query loading state
		openChat,
		closeChat,
		toggleChat,
		sendMessage,
	};
}
