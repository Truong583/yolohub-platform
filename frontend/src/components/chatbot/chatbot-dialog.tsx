"use client";

import dynamic from "next/dynamic";
import {useEffect, useRef} from "react";
import {X, LogIn} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Message} from "@/types/chatbot";
import Link from "next/link";
import Image from "next/image";

// Dynamic imports - default arrow function components
const ChatMessage = dynamic(() => import("./chat-message"), {
	ssr: false,
});

const ChatInput = dynamic(() => import("./chat-input"), {
	ssr: false,
});

interface ChatbotDialogProps {
	onClose: () => void;
	messages: Message[];
	onSendMessage: (message: string) => void;
	isLoading?: boolean;
	isAuthenticated?: boolean;
}

const ChatbotDialog = ({
	onClose,
	messages,
	onSendMessage,
	isLoading = false,
	isAuthenticated = true,
}: ChatbotDialogProps) => {
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
	}, [messages]);

	return (
		<div
			id="chatbot-dialog"
			role="dialog"
			aria-labelledby="chatbot-title"
			aria-describedby="chatbot-description"
			className={cn(
				"fixed bottom-20 right-4 sm:bottom-28 sm:right-6 z-[100] shadow-2xl border",
				"w-[calc(100vw-2rem)] sm:w-[400px] md:w-[450px] h-[calc(100vh-6rem)] sm:h-[580px] md:h-[640px]",
				"max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-3rem)] max-h-[calc(100vh-5rem)] sm:max-h-[calc(100vh-8rem)]",
				"p-0 gap-0 rounded-2xl overflow-hidden",
				"flex flex-col",
				"animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-8 duration-300"
			)}
		>
			{/* Enhanced Glass Background with Multiple Layers like header */}
			<div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 backdrop-blur-xl rounded-2xl"></div>
			<div className="absolute inset-0 bg-white/90 backdrop-blur-xl rounded-2xl"></div>
			<div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-purple-500/5 rounded-2xl"></div>

			{/* Subtle border with gradient like header */}
			<div className="absolute inset-0 rounded-2xl border border-gray-200/50 shadow-2xl shadow-purple-500/10"></div>
			<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

			{/* Content container */}
			<div className="relative z-10 flex flex-col h-full">
				{/* Header */}
				<div className="relative flex flex-row items-center justify-between p-4 sm:p-6 pb-3 sm:pb-4 border-b border-gray-200/50">
					{/* Enhanced header background like main header */}
					<div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-blue-700/5 to-purple-600/5"></div>
					<div className="absolute inset-0 bg-white/50"></div>

					<div className="relative flex items-center gap-3 sm:gap-4">
						<div className="relative">
							{/* Simple chatbot icon */}
							<div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
								<Image
									src="/images/chatbot.png"
									alt="AI Assistant"
									width={40}
									height={40}
									className="w-full h-full object-contain"
								/>
							</div>
						</div>
						<div>
							<h2
								id="chatbot-title"
								className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
							>
								AI Assistant
							</h2>
							<p
								id="chatbot-description"
								className="text-xs sm:text-sm text-gray-500 font-medium tracking-wide"
							>
								Here to help you learn <span aria-hidden="true">✨</span>
							</p>
						</div>
					</div>

					<Button
						onClick={onClose}
						variant="ghost"
						size="icon"
						className={cn(
							"relative h-8 w-8 sm:h-9 sm:w-9 rounded-full transition-all duration-300 group",
							"text-gray-500 hover:text-blue-600",
							"hover:bg-gradient-to-br hover:from-blue-50 hover:via-blue-100/50 hover:to-purple-50",
							"hover:shadow-lg hover:shadow-blue-200/20 border border-transparent hover:border-blue-100",
							"hover:scale-110 active:scale-95"
						)}
						aria-label="Close chat"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/8 group-hover:to-purple-500/8 rounded-full transition-all duration-300"></div>
						<X className="h-3 w-3 sm:h-4 sm:w-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
					</Button>
				</div>

				{/* Messages Area */}
				<div
					className="flex-1 px-3 sm:px-4 pt-3 sm:pt-4 bg-white/90 backdrop-blur-sm border-r border-gray-200/30 overflow-y-auto overflow-x-hidden"
					role="log"
					aria-label="Chat messages"
					aria-live="polite"
				>
					{!isAuthenticated ? (
						<div className="flex flex-col items-center justify-center h-full text-center animate-fade-in-slow p-2 sm:p-4">
							<div className="relative mb-4 sm:mb-6">
								{/* Floating Orbs Animation */}
								<div className="absolute -top-2 -left-2 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-brand-purple-primary/30 animate-float" />
								<div className="absolute -top-1 -right-3 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-brand-indigo-primary/40 animate-float-delay-1" />
								<div className="absolute -bottom-2 -right-1 h-1 w-1 sm:h-2 sm:w-2 rounded-full bg-brand-purple-light/50 animate-float-delay-2" />

								<div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden mb-4">
									<div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
									<LogIn className="h-8 w-8 sm:h-10 sm:w-10 text-white relative z-10 animate-float" />
								</div>
							</div>
							<h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-900 dark:text-white">
								Đăng nhập để chat với AI 🔐
							</h3>
							<p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6 max-w-[280px] sm:max-w-[300px] leading-relaxed px-2">
								Bạn cần đăng nhập để sử dụng tính năng AI Assistant. Đăng nhập
								ngay để nhận được hỗ trợ về khóa học và câu hỏi học tập.
							</p>
							<Link
								href="/auth/sign-in"
								className="w-full max-w-[180px] sm:max-w-[200px]"
							>
								<Button
									className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm sm:text-base"
									size="lg"
								>
									<LogIn className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
									Đăng nhập ngay
								</Button>
							</Link>
						</div>
					) : messages.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full text-center animate-fade-in-slow p-2 sm:p-4">
							<div className="relative mb-4 sm:mb-6">
								{/* Simple chatbot icon */}
								<div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-4">
									<Image
										src="/images/chatbot.png"
										alt="AI Assistant"
										width={80}
										height={80}
										className="w-full h-full object-contain"
									/>
								</div>
							</div>
							<h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-900 dark:text-white">
								Welcome to AI Assistant! 👋
							</h3>
							<p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6 max-w-[280px] sm:max-w-[300px] leading-relaxed px-2">
								I&apos;m here to help you with your learning journey. Ask me
								anything about courses, lessons, or general questions.
							</p>
							<div className="flex items-center gap-2 text-xs sm:text-sm text-brand-purple-primary dark:text-brand-purple-light font-medium">
								<div className="h-2 w-2 rounded-full bg-brand-purple-primary animate-pulse" />
								Start by typing a message below
							</div>
						</div>
					) : (
						<div className="space-y-2 sm:space-y-3 min-h-0 w-full max-w-full break-words">
							{messages.map((message) => (
								<div
									key={message.id}
									className="w-full max-w-full break-words overflow-hidden"
								>
									<ChatMessage
										message={message.text}
										isUser={message.isUser}
										timestamp={message.timestamp}
										courses={message.courses}
										suggestions={message.suggestions}
										intent={message.intent}
										onSuggestionClick={(suggestion) =>
											onSendMessage(suggestion)
										}
									/>
								</div>
							))}
							{isLoading && (
								<div className="w-full max-w-full">
									<ChatMessage message="" isUser={false} isLoading={true} />
								</div>
							)}
							<div ref={messagesEndRef} />
						</div>
					)}
				</div>

				{/* Input Area - Only show for authenticated users */}
				{isAuthenticated && (
					<div className="flex-shrink-0 relative z-20">
						<ChatInput
							onSendMessage={onSendMessage}
							disabled={isLoading}
							placeholder="Ask me anything about your learning..."
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default ChatbotDialog;
