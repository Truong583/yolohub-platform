"use client";

import dynamic from "next/dynamic";
import { useChatbot } from "@/hooks/use-chatbot";
import { useIsAuthenticated } from "@/lib/auth";

const ChatbotButton = dynamic(() => import("./chatbot-button"), {
  ssr: false,
});

const ChatbotDialog = dynamic(() => import("./chatbot-dialog"), {
  ssr: false,
});

const Chatbot = () => {
  const isAuthenticated = useIsAuthenticated();
  const { isOpen, messages, isLoading, toggleChat, closeChat, sendMessage } =
    useChatbot();

  return (
    <>
      <ChatbotButton isOpen={isOpen} onClick={toggleChat} />

      {isOpen && (
        <ChatbotDialog
          onClose={closeChat}
          messages={messages}
          onSendMessage={sendMessage}
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
        />
      )}
    </>
  );
};

export default Chatbot;
