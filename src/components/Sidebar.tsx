import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Clock, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useConversations } from "@/hooks/useConversations";
import { useUser } from "@clerk/clerk-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SignOutButton, UserButton } from "@clerk/clerk-react";

const Sidebar = () => {
  const { conversations, isLoading, createNewConversation, selectConversation, selectedConversationId } = useConversations();
  const { user } = useUser();

  const handleNewChat = () => {
    createNewConversation();
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Sidebar header */}
      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <Button className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90 text-white" onClick={handleNewChat}>
          <Plus size={16} />
          <span>New Chat</span>
        </Button>
      </div>

      {/* Conversations list */}
      <ScrollArea className="flex-1 px-2 py-2">
        {isLoading ? (
          <div className="space-y-2 mt-2 px-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-2 p-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : conversations.length > 0 ? (
          <div className="space-y-1 mt-2">
            {conversations.map((conversation) => (
              <Button
                key={conversation.id}
                variant="ghost"
                className={`w-full justify-start text-left px-2 py-2 ${
                  selectedConversationId === conversation.id ? "bg-accent" : ""
                }`}
                onClick={() => selectConversation(conversation.id)}
              >
                <Clock size={16} className="mr-2 flex-shrink-0" />
                <span className="truncate">
                  {conversation.lastMessagePreview || "New Conversation"}
                </span>
              </Button>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1">Start a new chat to begin</p>
          </div>
        )}
      </ScrollArea>

      {/* Sidebar footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserButton />
            <div className="text-sm font-medium truncate">
              {user?.primaryEmailAddress?.emailAddress || "User"}
            </div>
          </div>
          <SignOutButton>
            <Button variant="ghost" size="sm">
              Sign Out
            </Button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
