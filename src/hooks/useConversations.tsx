
import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Conversation, Message } from "@/lib/types";
import { toast } from "@/components/ui/sonner";

interface ConversationsContextType {
  conversations: { id: string; lastMessagePreview: string }[];
  selectedConversation: Conversation | null;
  selectedConversationId: string | null;
  isLoading: boolean;
  isTyping: boolean;
  createNewConversation: () => void;
  selectConversation: (id: string) => void;
  sendMessage: (payload: { content?: string; imageFile?: File }) => Promise<void>;
}

const ConversationsContext = createContext<ConversationsContextType | null>(null);

export const ConversationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, userId } = useAuth();
  const [conversations, setConversations] = useState<{ id: string; lastMessagePreview: string }[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  // Fetch conversations when signed in
  useEffect(() => {
    if (isSignedIn) {
      fetchConversations();
    }
  }, [isSignedIn]);

  // Fetch conversation details when ID changes
  useEffect(() => {
    if (selectedConversationId) {
      fetchConversationDetails(selectedConversationId);
    } else {
      setSelectedConversation(null);
    }
  }, [selectedConversationId]);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      
      // In a real implementation, this would be an API call
      // For now, we'll just simulate it
      setTimeout(() => {
        const mockConversations = [
          { id: "1", lastMessagePreview: "Hello there!" },
          { id: "2", lastMessagePreview: "How does AI work?" },
          { id: "3", lastMessagePreview: "Tell me about React" }
        ];
        setConversations(mockConversations);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      toast.error("Failed to load conversations");
      setIsLoading(false);
    }
  };

  const fetchConversationDetails = async (id: string) => {
    try {
      setIsLoading(true);
      
      // In a real implementation, this would be an API call
      // For now, we'll just simulate it
      setTimeout(() => {
        const mockMessages: Message[] = [
          { 
            role: "user", 
            content: "Hello, can you explain how AI works?",
            timestamp: new Date(Date.now() - 100000)
          },
          { 
            role: "assistant", 
            content: "AI, or Artificial Intelligence, works by processing large amounts of data to recognize patterns and make decisions. Modern AI systems use neural networks that simulate human brain function, allowing them to learn from examples rather than being explicitly programmed for specific tasks.",
            timestamp: new Date(Date.now() - 90000)
          },
          { 
            role: "user", 
            content: "Can you give me a specific example?",
            timestamp: new Date(Date.now() - 80000)
          },
          { 
            role: "assistant", 
            content: "Sure! One example is image recognition. An AI model might be trained on millions of labeled images. When you show it a new image of a cat, it compares patterns it learned from training data to recognize it as a cat. Another example is language models like me - trained on text to predict and generate human-like responses to your questions.",
            timestamp: new Date(Date.now() - 70000)
          }
        ];
        
        const mockConversation: Conversation = {
          _id: id as any,
          userId: userId || "",
          messages: mockMessages,
          createdAt: new Date(Date.now() - 100000),
          updatedAt: new Date(Date.now() - 70000)
        };
        
        setSelectedConversation(mockConversation);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to fetch conversation details:", error);
      toast.error("Failed to load conversation");
      setIsLoading(false);
    }
  };

  const createNewConversation = useCallback(() => {
    // In a real app, we'd create a new conversation in the database
    // For now, just generate a random ID and set it as selected
    const newId = Date.now().toString();
    const newConv = { 
      id: newId,
      lastMessagePreview: "New Conversation" 
    };
    
    setConversations(prev => [newConv, ...prev]);
    setSelectedConversationId(newId);
    setSelectedConversation({
      _id: newId as any,
      userId: userId || "",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }, [userId]);

  const selectConversation = useCallback((id: string) => {
    setSelectedConversationId(id);
  }, []);

  const sendMessage = useCallback(async (payload: { content?: string; imageFile?: File }) => {
    try {
      const { content = "", imageFile } = payload;
      
      if (!content && !imageFile) return;
      
      if (!selectedConversationId) {
        createNewConversation();
        // We need to wait for the state update
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      
      // Add user message to conversation
      const userMessage: Message = {
        role: "user",
        content: content || undefined,
        imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined,
        timestamp: new Date()
      };
      
      setSelectedConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, userMessage]
        };
      });
      
      // Update conversation preview
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversationId 
            ? { ...conv, lastMessagePreview: content || "Sent an image" }
            : conv
        )
      );
      
      // Simulate AI typing
      setIsTyping(true);
      
      // In a real app, this would be an API call with streaming response
      // For now, simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add AI response
      const aiMessage: Message = {
        role: "assistant",
        content: "This is a simulated response. In a real app, this would come from the AI API.",
        timestamp: new Date()
      };
      
      setSelectedConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, aiMessage]
        };
      });
      
      setIsTyping(false);
      
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
      setIsTyping(false);
    }
  }, [selectedConversationId, createNewConversation]);

  return (
    <ConversationsContext.Provider
      value={{
        conversations,
        selectedConversation,
        selectedConversationId,
        isLoading,
        isTyping,
        createNewConversation,
        selectConversation,
        sendMessage
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
};

export const useConversations = () => {
  const context = useContext(ConversationsContext);
  if (context === null) {
    throw new Error("useConversations must be used within a ConversationsProvider");
  }
  return context;
};
