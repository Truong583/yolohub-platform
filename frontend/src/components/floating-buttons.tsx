"use client";

import dynamic from "next/dynamic";

// Dynamic imports with ssr: false to prevent hydration mismatch
const Chatbot = dynamic(() => import("@/components/chatbot/chatbot"), {
  ssr: false,
});

const TelegramButton = dynamic(() => import("@/components/telegram-button"), {
  ssr: false,
});

interface FloatingButtonsProps {
  telegramUrl?: string;
}

const FloatingButtons = ({ telegramUrl }: FloatingButtonsProps) => {
  return (
    <>
      <Chatbot />
      <TelegramButton telegramUrl={telegramUrl} />
    </>
  );
};

export default FloatingButtons;
