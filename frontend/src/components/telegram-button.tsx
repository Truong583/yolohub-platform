"use client";

import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TelegramButtonProps {
  onClick?: () => void;
  telegramUrl?: string;
}

const TelegramButton = ({ onClick, telegramUrl }: TelegramButtonProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (telegramUrl) {
      window.open(telegramUrl, "_blank", "noopener,noreferrer");
    } else {
      // Default telegram link - Yolo7 Phan
      window.open("https://t.me/yolo7phan", "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="fixed bottom-24 right-4 sm:bottom-28 sm:right-6 z-50 animate-fade-in-up">
      {/* Enhanced Glass Background with Multiple Layers */}
      <div className="absolute inset-0 rounded-full">
        {/* Base gradient background - Telegram colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 rounded-full opacity-90 transition-all duration-500" />
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-full transition-all duration-500" />
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full transition-all duration-500" />
      </div>

      {/* Floating Animation Ring */}
      <div
        className={cn(
          "absolute inset-0 rounded-full transition-all duration-500",
          "bg-gradient-to-br from-sky-400/30 via-blue-500/30 to-blue-600/30 animate-pulse scale-110 opacity-20"
        )}
      />

      {/* Pulsing outer ring */}
      <div className="absolute inset-0 rounded-full bg-sky-500/20 animate-ping opacity-75" />

      {/* Notification badge */}
      <div className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
        <div className="h-1 w-1 sm:h-2 sm:w-2 bg-white rounded-full animate-pulse"></div>
      </div>

      {/* Main Button */}
      <Button
        onClick={handleClick}
        size="icon"
        className={cn(
          "relative h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-2xl transition-all duration-300 overflow-hidden",
          "bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 text-white",
          "border-2 border-white/30 backdrop-blur-xl",
          "hover:scale-110 hover:shadow-xl hover:shadow-sky-500/25",
          "hover:from-sky-600 hover:via-blue-700 hover:to-blue-800",
          "transform-gpu will-change-transform group",
          "hover:rotate-12 active:scale-95 animate-bounce-gentle"
        )}
        aria-label="Open Telegram"
      >
        {/* Animated shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-full"></div>

        {/* Glass morphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>

        {/* Icon Container */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <Send
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
        </div>
      </Button>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 sm:px-3 py-1 bg-gray-900/90 text-white text-xs sm:text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap hidden sm:block">
        Contact @yolo7phan
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900/90"></div>
      </div>
    </div>
  );
};

export default TelegramButton;
