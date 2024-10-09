"use client";
import { useChat } from "@/hooks/useChat";
import useFetchRecipientUser from "@/hooks/useFetchRecipientUser";
import { Chat as ChatType, Message, User } from "@/types/interfaces";
import { unReadNotificationsFun } from "@/utils/notificationFuns";
import { baseUrl, getRequest } from "@/utils/services";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import Moment from "../conversation/Moment";

interface ChatProps {
  chat: ChatType | null;
  user: User | null;
}

const Chat: FC<ChatProps> = ({ chat, user }) => {
  const [lastMessage, setLastMessage] = useState<Message | undefined>(
    undefined
  );
  const [isThereMessage, setIsThereMessage] = useState(false);
  const { recipientUser } = useFetchRecipientUser({ chat, user });
  const {
    setCurrentConversation,
    onlineUsers,
    messages,
    typing,
    notifications,
    markChatAsRead,
  } = useChat();

  // Get last message
  useEffect(() => {
    const getLastMessage = async () => {
      if (chat) {
        const res = await getRequest(
          `${baseUrl}/conversations/${chat.id}/messages`
        );

        if (res.error) return console.error(res.message);

        const messages = res.data.messages;

        // Get the last message
        setLastMessage(messages[messages.length - 1]);

        /// Create a new conversation
        setIsThereMessage(Boolean(messages.length));
      }
    };

    getLastMessage();
  }, [chat, setLastMessage, isThereMessage, messages, notifications]);

  const notificationCurrentUser = unReadNotificationsFun(notifications).filter(
    (n) => n.sender_id === recipientUser?.id && n.conversation_id === chat?.id
  );

  return (
    recipientUser &&
    isThereMessage && (
      <div
        onClick={() => {
          setCurrentConversation(chat);
          if (chat) markChatAsRead(chat);
        }}
        className='relative flex items-center gap-2 mb-3 last:mb-0 cursor-pointer hover:bg-accent px-3 py-4 rounded-md border-b'
      >
        <Image
          src={recipientUser?.profile_picture}
          width={50}
          height={50}
          alt='User'
          className='rounded-full size-12'
        />
        <div className='w-full'>
          <div className='flex items-center justify-between'>
            <h3 className='text-base font-semibold flex gap-2 items-end'>
              {recipientUser.name}
              {chat?.id === typing?.chatId && typing?.isTyping && (
                <p className='text-xs'>typing...</p>
              )}
            </h3>
            {onlineUsers &&
              onlineUsers.map(
                (user) =>
                  user.userId === recipientUser.id && (
                    <span
                      key={recipientUser.id}
                      className='absolute top-2 right-2 size-3 rounded-full bg-green-500'
                    ></span>
                  )
              )}
            <p className='text-xs text-muted-foreground'>
              {lastMessage ? <Moment timestamp={lastMessage.created_at} /> : ""}
            </p>
          </div>
          <div className='flex items-center justify-between'>
            <p className='w-4/5 text-sm text-secondary-foreground/70 line-clamp-1'>
              {lastMessage ? lastMessage.content : "No message yet."}
            </p>
            {notificationCurrentUser && notificationCurrentUser?.length > 0 && (
              <span className='text-xs bg-teal-700 text-white size-5 flex items-center justify-center rounded-full'>
                {notificationCurrentUser.length}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Chat;
