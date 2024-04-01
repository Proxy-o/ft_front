export interface Conversation {
  senderId: string;
  receiverId: string;
}

export interface LastMessage {
  message: string;
  type: string;
  user: string;
  read?: boolean;
}

export interface Message {
  user: string;
  receiver: string;
  content: string;
  read: boolean;
  timestamp: string;
}
