export interface Conversation {
  senderId: string;
  receiverId: string;
}

export interface LastMessage {
  message: string;
  type: string;
  user: string;
  id: string;
  read?: boolean;
  avatar?: string;
}

export interface Message {
  user: string;
  receiver: string;
  content: string;
  read: boolean;
  timestamp: string;
}
