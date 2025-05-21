
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Image } from "lucide-react";
import { useConversations } from "@/hooks/useConversations";

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { sendMessage, isTyping } = useConversations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!message.trim() && !imageFile) || isTyping) return;
    
    await sendMessage({
      content: message.trim(),
      imageFile: imageFile
    });
    
    setMessage("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {imagePreview && (
        <div className="relative inline-block">
          <img src={imagePreview} alt="Preview" className="h-20 rounded-md" />
          <Button 
            type="button" 
            variant="destructive" 
            size="icon" 
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={handleRemoveImage}
          >
            ✕
          </Button>
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        
        <Button 
          variant="outline" 
          size="icon" 
          className="shrink-0"
          type="button"
          onClick={() => fileInputRef.current?.click()}
        >
          <Image size={20} />
        </Button>
        
        <div className="relative flex-1">
          <Input 
            placeholder="Type a message..." 
            className="pr-10 py-6 bg-white dark:bg-gray-800" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isTyping}
          />
        </div>
        
        <Button 
          className="shrink-0 bg-primary hover:bg-primary/90" 
          size="icon"
          type="submit"
          disabled={(!message.trim() && !imageFile) || isTyping}
        >
          <Send size={20} />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
