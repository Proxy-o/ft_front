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
