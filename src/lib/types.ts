
import { ObjectId } from "mongodb";

export interface Message {
  role: 'user' | 'assistant';
  content?: string;
  imageUrl?: string;
  timestamp: Date;
}

export interface Conversation {
  _id: ObjectId | string;
  userId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Memory {
  _id: ObjectId | string;
  userId: string;
  summary: string;
  sourceConversationId: ObjectId | string;
  createdAt: Date;
}

export interface ApiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
