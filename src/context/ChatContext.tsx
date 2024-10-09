"use client";

import { Chat, Message, Notification, Online, User } from "@/types/interfaces";
import { membersChat } from "@/utils/membersChat";
import { baseUrl, getRequest, postRequest } from "@/utils/services";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

// Define ChatContextType with the appropriate types
interface ChatContextType {
  userChats: Chat[] | null;
  setUserChats: (chats: Chat[] | null) => void;
  userChatsError: string | null;
  isLoadingUserChats: boolean;
  currentConversation: Chat | null;
  setCurrentConversation: (chat: Chat | null) => void;
  messages: Message[] | null;
  setMessages: (messages: Message[] | null) => void;
  isMessagesLoading: boolean;
  messagesError: string | null;
  onlineUsers: Online[] | null;
  newMessage: Message[] | null;
  setNewMessage: (message: Message[] | null) => void;
  socket: Socket | null;
  typing: { chatId: number; isTyping: boolean } | null;
  setTyping: (typing: { chatId: number; isTyping: boolean } | null) => void;
  notifications: Notification[] | null;
  setNotification: (notification: Notification[] | null) => void;
  markAllNotificationsAsRead: () => void;
  markNotificationsAsRead: (notification: Notification) => void;
  markChatAsRead: (chat: Chat) => void;
  isNotificationsLoading: boolean;
  notificationsError: string | null;
  newNotification: Notification[] | null;
  setNewNotification: (notification: Notification[] | null) => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

export const ChatContextProvider = ({
  children,
  user,
}: {
  children: ReactNode;
  user: User | null;
}) => {
  /// State for chats
  const [userChats, setUserChats] = useState<Chat[] | null>(null);
  const [userChatsError, setUserChatsError] = useState<string | null>(null);
  const [isLoadingUserChats, setIsLoadingUserChats] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<Chat | null>(
    null
  );

  /// State for messages
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  /// Socket.io-related state
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Online[] | null>(null);
  const [newMessage, setNewMessage] = useState<Message[] | null>(null);
  const [newNotification, setNewNotification] = useState<Notification[] | null>(
    null
  );
  const [typing, setTyping] = useState<{
    chatId: number;
    isTyping: boolean;
  } | null>(null); // State for typing

  /// State for notifications
  const [notifications, setNotification] = useState<Notification[] | null>(
    null
  );
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationError] = useState<string | null>(
    null
  );

  // Initialize socket connection
  useEffect(() => {
    if (user?.id) {
      const newSocket = io(
        process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:9000"
      );
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user?.id]);

  // Emit 'addNewUser' and listen for 'getOnlineUsers'
  useEffect(() => {
    if (socket && user?.id) {
      socket.emit("addNewUser", user.id);

      socket.on("getOnlineUsers", (res) => {
        setOnlineUsers(res);
      });

      return () => {
        socket.off("getOnlineUsers");
      };
    }
  }, [socket, user?.id]);

  // Fetch messages when current conversation changes
  useEffect(() => {
    const getAllMessages = async () => {
      if (currentConversation) {
        setIsMessagesLoading(true);

        const res = await getRequest(
          `${baseUrl}/conversations/${currentConversation.id}/messages`
        );

        setIsMessagesLoading(false);

        if (res.error) return setMessagesError(res.message);

        setMessages(res.data.messages);
      }
    };
    getAllMessages();
  }, [currentConversation]);

  // Fetch user chats
  useEffect(() => {
    const getUserChats = async () => {
      if (user?.id) {
        setIsLoadingUserChats(true);

        const res = await getRequest(
          `${baseUrl}/users/${user.id}/conversations`
        );
        setIsLoadingUserChats(false);

        if (res.error) return setUserChatsError(res.error);

        setUserChats(res.data);
      }
    };

    getUserChats();
  }, [user?.id]);

  // Handle sending a new message
  useEffect(() => {
    if (socket && newMessage && currentConversation) {
      membersChat(currentConversation).then((data) => {
        const userId = data.find((u: number) => u !== user?.id);
        socket.emit("sendMessage", {
          message: newMessage,
          userId,
        });

        setNewMessage(null); // Clear the newMessage after sending
      });
    }
  }, [currentConversation, newMessage, socket, user?.id]);

  // Handle receiving messages
  useEffect(() => {
    if (socket && currentConversation) {
      socket.on("getMessage", (res) => {
        if (res && res.message.conversation_id === currentConversation.id) {
          setMessages((prevMessages) =>
            prevMessages ? [...prevMessages, res.message] : [res.message]
          );
        }
      });

      return () => {
        socket.off("getMessage");
      };
    }
  }, [socket, currentConversation]);

  // Mark chat as read
  const markChatAsRead = useCallback(async (chat: Chat) => {
    try {
      const res = await postRequest(
        `${baseUrl}/notifications/${chat.id}/chat/markall`,
        ""
      );
      if (res) setNotification(res.data.markNotifications);
    } catch (error) {
      console.error("Error marking chat notifications as read: ", error);
    }
  }, []);

  // Handle sending a new message
  useEffect(() => {
    if (socket && newNotification) {
      socket.emit("sendNotification", {
        newNotification,
      });
    }
  }, [newNotification, socket]);

  // Handle receiving notifications
  useEffect(() => {
    if (socket) {
      socket.on("getNotification", (res) => {
        if (currentConversation) {
          const isChatOpen = currentConversation?.id === res.conversation_id;

          if (isChatOpen) {
            markChatAsRead(currentConversation);
          } else {
            setNotification((prevNotification) =>
              prevNotification ? [res, ...prevNotification] : [res]
            );
          }
        } else {
          setNotification((prevNotification) =>
            prevNotification ? [res, ...prevNotification] : [res]
          );
        }
      });

      return () => {
        socket.off("getNotification");
      };
    }
  }, [currentConversation, markChatAsRead, socket]);

  // Fetch all notifications
  useEffect(() => {
    const getAllNotifications = async () => {
      if (user?.id) {
        setIsNotificationsLoading(true);

        const res = await getRequest(
          `${baseUrl}/users/${user.id}/notifications`
        );
        setIsNotificationsLoading(false);

        if (res.error) return setNotificationError(res.message);

        setNotification(res.data);
      }
    };
    getAllNotifications();
  }, [user?.id]);

  // Mark all notifications as read
  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      const res = await postRequest(
        `${baseUrl}/notifications/${user?.id}/user/markall`,
        ""
      );

      if (res) setNotification(res.data.markNotifications);
    } catch (error) {
      console.error("Error marking all notifications as read: ", error);
    }
  }, [user?.id]);

  // Mark individual notification as read
  const markNotificationsAsRead = useCallback(
    async (notification: Notification) => {
      try {
        const res = await postRequest(
          `${baseUrl}/notifications/${notification.id}`,
          ""
        );

        if (res) setNotification(res.data.markNotification);
      } catch (error) {
        console.error("Error marking notification as read: ", error);
      }

      const wantedChat = userChats?.find(
        (chat) => chat.id === notification.conversation_id
      );

      if (wantedChat) setCurrentConversation(wantedChat);

      try {
        const result = await postRequest(
          `${baseUrl}/notifications/${wantedChat?.id}/chat/markall`,
          ""
        );

        if (result) setNotification(result.data.markNotifications);
      } catch (error) {
        console.error("Error marking chat notifications as read: ", error);
      }
    },
    [userChats]
  );

  return (
    <ChatContext.Provider
      value={{
        userChats,
        setUserChats,
        userChatsError,
        isLoadingUserChats,
        currentConversation,
        setCurrentConversation,
        messages,
        setMessages,
        isMessagesLoading,
        messagesError,
        onlineUsers,
        newMessage,
        setNewMessage,
        socket,
        typing,
        setTyping,
        notifications,
        setNotification,
        markAllNotificationsAsRead,
        markNotificationsAsRead,
        markChatAsRead,
        isNotificationsLoading,
        notificationsError,
        newNotification,
        setNewNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
