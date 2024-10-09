export interface User {
  id: number;
  name: string;
  email: string;
  profile_picture: string;
}

export interface Register {
  name: string;
  email: string;
  password: string;
}

export interface Chat {
  id: number;
  name: string | null;
  is_group: boolean;
  created_at: string;
}

export interface Message {
  id: number;
  sender_id: number;
  conversation_id: number;
  content: string;
  created_at: string;
}

export interface Online {
  userId: number;
  socketId: string;
}

export interface Notification {
  id: number;
  user_id: number;
  sender_id: number;
  message: string;
  conversation_id: number;
  is_read: boolean;
  created_at: string;
}

export interface NotificationWithSenderName extends Notification {
  senderName: string;
}
