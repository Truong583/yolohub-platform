"use client";

import {BookOpen} from "lucide-react";
import {cn} from "@/lib/utils";
import {Avatar} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {formatPrice} from "@/utils/format";
import {DEFAULT_AVATAR} from "@/constants";

interface ChatMessageProps {
	message: string;
	isUser: boolean;
	timestamp?: Date;
	isLoading?: boolean;
	user?: {
		avatar?: string;
		name?: string;
	};
	courses?: Array<{
		id: string;
		slug: string;
		title: string;
		price: number;
		oldPrice?: number;
		image: string;
		level: string;
	}>;
	suggestions?: string[];
	intent?: string;
	onSuggestionClick?: (suggestion: string) => void;
}

const ChatMessage = ({
	message,
	isUser,
	timestamp,
	isLoading = false,
	user,
	courses = [],
	suggestions = [],
	onSuggestionClick,
}: ChatMessageProps) => {
	return (
		<div
			className={cn(
				"flex gap-3 mb-6 group",
				isUser ? "flex-row-reverse" : "flex-row"
			)}
		>
			{/* Avatar */}
			<div className="relative shrink-0">
				<Avatar className="h-10 w-10">
					<div className="w-full h-full rounded-full overflow-hidden shadow-lg border-2 border-white/20">
						<Image
							src={
								isUser ? user?.avatar || DEFAULT_AVATAR : "/images/chatbot.png"
							}
							alt={isUser ? "User Avatar" : "Chatbot Avatar"}
							width={40}
							height={40}
							className="w-full h-full object-cover"
							priority
						/>
					</div>
				</Avatar>
			</div>

			{/* Message Content */}
			<div
				className={cn(
					"flex flex-col max-w-[300px] w-full",
					isUser ? "items-end" : "items-start"
				)}
			>
				{/* Message Bubble */}
				<div className="relative group/bubble">
					<div
						className={cn(
							"relative rounded-2xl px-4 py-3 text-sm shadow-lg transition-all duration-300",
							"border backdrop-blur-sm",
							isUser
								? "bg-brand-gradient-main text-white border-white/20 rounded-br-md"
								: "bg-white/90 text-gray-900 border-gray-200/50 rounded-bl-md"
						)}
					>
						{isLoading ? (
							<div className="flex items-center justify-center py-2">
								{/* Wave 3 Dots Animation */}
								<div className="flex gap-1">
									<div
										className="w-2 h-2 rounded-full bg-brand-indigo-primary animate-bounce will-change-transform"
										style={{
											animationDelay: "0s",
											animationDuration: "1s",
											animationIterationCount: "infinite",
										}}
									/>
									<div
										className="w-2 h-2 rounded-full bg-brand-indigo-primary animate-bounce will-change-transform"
										style={{
											animationDelay: "0.15s",
											animationDuration: "1s",
											animationIterationCount: "infinite",
										}}
									/>
									<div
										className="w-2 h-2 rounded-full bg-brand-indigo-primary animate-bounce will-change-transform"
										style={{
											animationDelay: "0.3s",
											animationDuration: "1s",
											animationIterationCount: "infinite",
										}}
									/>
								</div>
							</div>
						) : (
							<>
								<p className="whitespace-pre-wrap break-words leading-relaxed">
									{message}
								</p>

								{/* Courses Section */}
								{!isUser && courses && courses.length > 0 && (
									<div className="mt-3 w-full">
										<div className="text-sm font-medium text-gray-700 mb-2">
											📚 Khóa học được đề xuất:
										</div>
										<div className="space-y-1.5 max-h-[200px] overflow-y-auto w-full ">
											{courses.map((course) => (
												<Link
													key={course.id}
													href={`/courses/${course.slug}`}
													className="block w-full"
												>
													<div className="bg-white/60 border border-gray-200/50 rounded-lg p-2 hover:bg-white/80 transition-colors duration-200 w-full">
														<div className="flex gap-2 items-start">
															{/* Course Image - Khối 1 (Smaller) */}
															<div className="flex-shrink-0">
																<div className="relative w-14 h-10 rounded overflow-hidden bg-gray-100">
																	{course.image ? (
																		<Image
																			src={course.image}
																			alt={course.title}
																			fill
																			className="object-cover"
																			sizes="56px"
																		/>
																	) : (
																		<div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
																			<BookOpen className="h-3 w-3 text-white" />
																		</div>
																	)}
																</div>
															</div>

															{/* Title + Price - Khối 2 */}
															<div className="flex-1 min-w-0 flex flex-col gap-1.5">
																{/* Course Title */}
																<div>
																	<h4 className="text-xs font-medium text-gray-900 line-clamp-1 leading-tight">
																		{course.title}
																	</h4>
																</div>

																{/* Course Price Info (Simplified) */}
																<div className="flex items-center gap-2">
																	{course.oldPrice &&
																		course.oldPrice > course.price && (
																			<span className="text-xs text-gray-400 line-through">
																				{formatPrice(course.oldPrice)}
																			</span>
																		)}
																	<span className="text-sm font-semibold text-blue-600">
																		{course.price === 0
																			? "Miễn phí"
																			: formatPrice(course.price)}
																	</span>
																</div>
															</div>
														</div>
													</div>
												</Link>
											))}
										</div>
									</div>
								)}

								{/* Suggestions Section */}
								{!isUser && suggestions && suggestions.length > 0 && (
									<div className="mt-3 w-full max-w-full">
										<div className="text-sm font-medium text-gray-700 mb-2">
											💡 Bạn có thể hỏi:
										</div>
										<div className="grid grid-cols-1 gap-1.5 w-full max-w-full">
											{suggestions.map((suggestion, index) => (
												<Button
													key={index}
													variant="outline"
													size="sm"
													className="text-xs h-auto min-h-[32px] px-3 py-2 rounded-lg bg-white/60 border-gray-200/50 hover:bg-blue-50 hover:border-blue-200 transition-colors duration-200 w-full text-left overflow-hidden justify-start"
													onClick={() => onSuggestionClick?.(suggestion)}
													title={suggestion}
												>
													<span
														className="line-clamp-2 leading-tight overflow-hidden"
														style={{
															display: "-webkit-box",
															WebkitLineClamp: 2,
															WebkitBoxOrient: "vertical",
															overflow: "hidden",
															textOverflow: "ellipsis",
														}}
													>
														{suggestion}
													</span>
												</Button>
											))}
										</div>
									</div>
								)}

								{/* Message sent indicator for user messages */}
								{isUser && (
									<div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-white/80 flex items-center justify-center">
										<div className="h-1.5 w-1.5 rounded-full bg-brand-purple-primary" />
									</div>
								)}
							</>
						)}
					</div>
				</div>

				{/* Timestamp */}
				{timestamp && !isLoading && (
					<span
						className={cn(
							"text-xs text-gray-500 mt-2 px-2 opacity-70 font-medium"
						)}
					>
						{timestamp.toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</span>
				)}
			</div>
		</div>
	);
};

export default ChatMessage;
