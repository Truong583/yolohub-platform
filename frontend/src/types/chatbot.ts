export interface ChatbotCourse {
	id: string;
	slug: string;
	title: string;
	price: number;
	oldPrice?: number;
	image: string;
	level: string;
}

export interface Message {
	id: string;
	text: string;
	isUser: boolean;
	timestamp: Date;
	courses?: ChatbotCourse[];
	suggestions?: string[];
	intent?: string;
}

export interface ChatbotState {
	isOpen: boolean;
	messages: Message[];
	isLoading: boolean;
	unreadCount: number;
}

export interface ChatbotActions {
	openChat: () => void;
	closeChat: () => void;
	toggleChat: () => void;
	sendMessage: (text: string) => void;
	markAsRead: () => void;
}
