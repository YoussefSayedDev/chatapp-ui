"use client";
import { useChat } from "@/hooks/useChat";
import useFetchRecipientUser from "@/hooks/useFetchRecipientUser";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { EllipsisVertical, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import Moment from "./Moment";
import SendMessage from "./SendMessage";

const ChatBox = () => {
  const { user } = useUser();
  const {
    currentConversation,
    messages,
    isMessagesLoading,
    onlineUsers,
    typing,
  } = useChat();
  const chat = currentConversation;
  const { recipientUser } = useFetchRecipientUser({ chat, user });

  const boxChatRef = useRef<HTMLDivElement | null>(null); // Ref for chat box

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (boxChatRef.current) {
      boxChatRef.current.scrollTop = boxChatRef.current.scrollHeight;
    }
  };

  // Automatically scroll to bottom when messages change or chat opens
  useEffect(() => {
    if (messages?.length) {
      scrollToBottom();
    }
  }, [messages, recipientUser, chat]);

  // Handle case when no conversation is selected
  if (!recipientUser)
    return (
      <div className='border rounded-md w-full h-full p-2 mt-2 flex flex-col justify-center items-center'>
        <p className='text-gray-300'>No conversation selected yet.</p>
      </div>
    );

  return (
    <div className='border rounded-md w-full h-full p-4 mt-2'>
      <div className='border-b w-full'>
        <div className='h-14 mb-3 mx-5 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Image
              src={recipientUser.profile_picture}
              width={60}
              height={60}
              alt='User'
              className='size-14 rounded-full'
            />
            <div className='transition-all duration-1000'>
              <h2 className='text-xl'>{recipientUser.name}</h2>
              {chat?.id === typing?.chatId && typing?.isTyping && (
                <p className='text-xs'>typing...</p>
              )}
            </div>
          </div>
          <div className='-translate-x-2/4 self-start'>
            {onlineUsers &&
              onlineUsers.map(
                (user) =>
                  user.userId === recipientUser.id && (
                    <span
                      key={recipientUser.id}
                      className='text-base font-semibold mb-auto text-green-500'
                    >
                      online
                    </span>
                  )
              )}
          </div>
          <div>
            <EllipsisVertical />
          </div>
        </div>
      </div>
      <div className='flex flex-col justify-between mt-2 rounded-sm height-chatbox border'>
        <div
          ref={boxChatRef} // Chat box ref for scrolling
          className='h-full flex flex-col p-2 my-2 overflow-x-hidden overflow-y-auto'
        >
          {!isMessagesLoading ? (
            messages?.length === 0 ? (
              <div className='m-auto'>
                <p className='text-xl'>No messages yet.</p>
              </div>
            ) : (
              messages?.map((msg) => (
                <div
                  key={msg.created_at}
                  className={cn(
                    msg.sender_id === user?.id ? "self-end" : "bg-muted",
                    "flex flex-col border max-w-[75%] w-fit px-2 py-1 my-1 rounded-md"
                  )}
                >
                  <h2 className='text-xl me-5 w-fit'>{msg.content}</h2>
                  <Moment timestamp={msg.created_at} />
                </div>
              ))
            )
          ) : (
            <div className='m-auto'>
              <Loader2 className='size-10 animate-spin' />
            </div>
          )}
        </div>
        <SendMessage user={user} chat={chat} />
      </div>
    </div>
  );
};

export default ChatBox;
