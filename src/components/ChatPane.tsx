
import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useConversations } from "@/hooks/useConversations";
import { Menu } from "lucide-react";
import ChatInput from "@/components/ChatInput";
import ChatBubble from "@/components/ChatBubble";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatPaneProps {
  toggleSidebar: () => void;
}

const ChatPane: React.FC<ChatPaneProps> = ({ toggleSidebar }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { selectedConversation, isLoading, isTyping } = useConversations();
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  return (
    <>
      {/* Chat header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            className="mr-2 md:hidden"
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </Button>
          <h1 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {selectedConversation?.lastMessagePreview || "New Conversation"}
          </h1>
        </div>
      </header>

      {/* Chat messages area */}
      <ScrollArea className="flex-1 p-4 bg-gray-50 dark:bg-gray-900">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] ${i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-blue-500'} p-3 rounded-lg`}>
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-32 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : !selectedConversation?.messages?.length ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm max-w-md">
              <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">Welcome to Chat</h3>
              <p className="text-sm">This is the beginning of your conversation. Ask anything!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedConversation.messages.map((message, index) => (
              <ChatBubble key={index} message={message} />
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Chat input area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <ChatInput />
      </div>
    </>
  );
};

export default ChatPane;
