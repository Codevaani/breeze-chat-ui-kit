
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Send, Image } from "lucide-react";

interface ChatPaneProps {
  toggleSidebar: () => void;
}

const ChatPane: React.FC<ChatPaneProps> = ({ toggleSidebar }) => {
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
          <h1 className="text-lg font-medium text-gray-800 dark:text-gray-200">New Conversation</h1>
        </div>
      </header>

      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm max-w-md">
            <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">Welcome to Chat</h3>
            <p className="text-sm">This is the beginning of your conversation. Ask anything!</p>
          </div>
        </div>
      </div>

      {/* Chat input area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="shrink-0"
            type="button"
          >
            <Image size={20} />
          </Button>
          <div className="relative flex-1">
            <Input 
              placeholder="Type a message..." 
              className="pr-10 py-6 bg-white dark:bg-gray-800" 
            />
          </div>
          <Button className="shrink-0 bg-primary hover:bg-primary/90" size="icon">
            <Send size={20} />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ChatPane;
