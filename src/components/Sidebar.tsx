
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Sidebar header */}
      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <Button className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90 text-white">
          <Plus size={16} />
          <span>New Chat</span>
        </Button>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">No conversations yet</p>
          <p className="text-xs mt-1">Start a new chat to begin</p>
        </div>
        
        {/* This is where conversation items will be rendered later */}
        <div className="space-y-1 mt-2">
          {/* Placeholder for future conversation items */}
        </div>
      </div>

      {/* Sidebar footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Chat App v1.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
