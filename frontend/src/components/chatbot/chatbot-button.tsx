"use client";

import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Sparkles, X} from "lucide-react";
import {TbMessageCircleFilled} from "react-icons/tb";
interface ChatbotButtonProps {
	isOpen: boolean;
	onClick: () => void;
}

const ChatbotButton = ({isOpen, onClick}: ChatbotButtonProps) => {
	return (
		<div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 animate-fade-in-up">
			{/* Enhanced Glass Background with Multiple Layers */}
			<div className="absolute inset-0 rounded-full">
				{/* Base gradient background */}
				<div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-full opacity-90 transition-all duration-500" />
				{/* Glass overlay */}
				<div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-full transition-all duration-500" />
				{/* Animated gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full transition-all duration-500" />
			</div>

			{/* Floating Animation Ring */}
			<div
				className={cn(
					"absolute inset-0 rounded-full transition-all duration-500",
					"bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-blue-600/30 animate-pulse",
					isOpen ? "scale-125 opacity-40" : "scale-110 opacity-20"
				)}
			/>

			{/* Pulsing outer ring - radiating effect */}
			<div className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping opacity-75" />

			{/* Main Button */}
			<Button
				onClick={onClick}
				size="icon"
				className={cn(
					"relative h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-2xl transition-all duration-300 overflow-hidden",
					"bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 text-white",
					"border-2 border-white/30 backdrop-blur-xl",
					"hover:scale-110 hover:shadow-xl hover:shadow-purple-500/25",
					"hover:from-blue-700 hover:via-blue-800 hover:to-purple-700",
					"transform-gpu will-change-transform group",
					"animate-bounce-gentle",
					"focus:outline-none ",
					isOpen
						? "rotate-180 scale-95 shadow-inner"
						: "hover:rotate-12 active:scale-95"
				)}
				aria-label={isOpen ? "Close chat assistant" : "Open chat assistant"}
				aria-expanded={isOpen}
				aria-controls={isOpen ? "chatbot-dialog" : undefined}
			>
				{/* Animated shine effect like header */}
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-full"></div>

				{/* Glass morphism overlay */}
				<div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>

				{/* Icon Container */}
				<div className="relative z-10 flex items-center justify-center">
					{isOpen ? (
						<X
							size={18}
							className={cn(
								"sm:w-5 sm:h-5 transition-all duration-300",
								"drop-shadow-sm"
							)}
						/>
					) : (
						<div className="relative flex  items-center justify-center">
							<TbMessageCircleFilled
								size={20}
								className="sm:w-[22px] sm:h-[22px] shrink-0 transition-all duration-300 drop-shadow-sm animate-float"
							/>

							{/* Enhanced Sparkle Animation */}
							<Sparkles
								className={cn(
									"absolute h-3 w-3 sm:h-4 sm:w-4 text-white/80 transition-all duration-500",
									"animate-pulse opacity-0 group-hover:opacity-100",
									"-top-1 -right-1 group-hover:scale-110"
								)}
							/>
						</div>
					)}
				</div>
			</Button>
		</div>
	);
};

export default ChatbotButton;
