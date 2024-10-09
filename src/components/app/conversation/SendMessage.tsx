"use client";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";
import { Chat, User } from "@/types/interfaces";
import { membersChat } from "@/utils/membersChat";
import { baseUrl, postRequest } from "@/utils/services";
import { Mic, Send, Smile } from "lucide-react";
import { ChangeEvent, FC, KeyboardEvent, useEffect, useState } from "react";

interface SendMessageProps {
  user: User | null;
  chat: Chat | null;
}

const SendMessage: FC<SendMessageProps> = ({ user, chat }) => {
  const [msg, setMsg] = useState<string>(""); // State for input value
  const {
    currentConversation,
    setMessages,
    messages,
    setNewMessage,
    socket,
    setTyping,
    setNewNotification,
  } = useChat();

  // Handle input value change
  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);

    if (socket && messages) {
      const members = await membersChat(currentConversation);
      const userId = members.find((u: number) => u !== user?.id);
      if (userId)
        socket.emit("sendTyping", {
          userTypingId: userId,
          chatId: chat?.id,
        });
    }
  };

  // Handle sending message & notification
  const handleSendMessage = async (): Promise<void> => {
    if (msg.trim().length === 0) return; // Don't send empty messages

    try {
      const res = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          senderId: user?.id,
          conversationId: chat?.id,
          content: msg,
        })
      );

      if (res.error) return console.error("Send message error:", res.message);

      // Update message list with new message
      if (messages) setMessages([...messages, res.data.message]);

      // // Send message using socket
      if (user && messages) {
        setNewMessage(res.data.message);
      }

      const members = await membersChat(currentConversation);
      const userId = members.find((u: number) => u !== user?.id);

      const resNotification = await postRequest(
        `${baseUrl}/notifications`,
        JSON.stringify({
          userId,
          senderId: user?.id,
          conversationId: chat?.id,
          message: msg,
        })
      );

      if (resNotification.error)
        return console.error(
          "Send notification error:",
          resNotification.message
        );

      // Send notification using socket
      if (user && messages) {
        setNewNotification(resNotification.data.notification);
      }

      // Reset the input after sending
      setMsg("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Send message on Enter key press
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") handleSendMessage();
  };

  //  Handle receiving typing
  useEffect(() => {
    if (socket) {
      socket.on("getTyping", (res) => {
        if (res && res.userTypingId === user?.id) {
          setTyping({
            chatId: res.chatId,
            isTyping: true,
          });

          // Automatically clear typing after 1 seconds
          setTimeout(() => {
            setTyping(null);
          }, 1000); // 1 seconds
        }
      });

      return () => {
        socket.off("getTyping");
      };
    }
  }, [socket, user?.id, setTyping]);

  return (
    <div className='relative w-full px-2 py-4 flex gap-2'>
      {/* Input Field */}
      <input
        type='text'
        placeholder='Message'
        value={msg}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress} // Handle Enter key press
        className='w-full bg-muted py-3 ps-10 pe-5 rounded-xl focus:outline-none'
      />
      {/* Smile Icon */}
      <Smile className='absolute top-1/2 left-4 -translate-y-1/2 size-5 cursor-pointer' />
      {/* Send/Mic Button */}
      <div
        onClick={handleSendMessage}
        className={cn(
          "size-12 rounded-full flex justify-center items-center cursor-pointer",
          msg.trim().length > 0
            ? "bg-green-600 hover:bg-green-600/90"
            : "bg-muted hover:bg-muted/75"
        )}
      >
        {msg.trim().length > 0 ? (
          <Send className='size-4' />
        ) : (
          <Mic className='size-5' />
        )}
      </div>
    </div>
  );
};

export default SendMessage;
