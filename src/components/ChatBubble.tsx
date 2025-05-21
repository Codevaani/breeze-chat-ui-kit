
import React from "react";
import { Message } from "@/lib/types";
import { format } from "date-fns";

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-[80%] rounded-lg p-4 shadow-sm ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-white dark:bg-gray-800 text-foreground"
        }`}
      >
        {message.content && <div className="break-words">{message.content}</div>}
        
        {message.imageUrl && (
          <div className="mt-2">
            <img 
              src={message.imageUrl} 
              alt="Uploaded image" 
              className="max-w-full rounded-md"
              onLoad={(e) => {
                // Ensure image doesn't exceed container width
                const img = e.currentTarget;
                if (img.naturalWidth > img.offsetWidth) {
                  img.style.height = 'auto';
                }
              }}
            />
          </div>
        )}
        
        <div 
          className="absolute bottom-1 right-2 text-xs opacity-50"
          title={message.timestamp ? format(new Date(message.timestamp), 'PPpp') : ''}
        >
          {message.timestamp && format(new Date(message.timestamp), 'p')}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
