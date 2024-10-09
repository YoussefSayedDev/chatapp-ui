"use client";
import { useChat } from "@/hooks/useChat";
import { useUser } from "@/hooks/useUser";
import Chat from "./Chat";
import ChatsSkeleton from "./ChatsSkeleton";

const ChatsList = () => {
  const { userChats } = useChat();
  const { user } = useUser();

  return (
    <div className='border rounded-md w-[650px] h-full p-2 mt-2 overflow-hidden overflow-y-auto hidden lg:block'>
      {userChats ? (
        userChats?.map((chat) => (
          <div key={chat?.id}>
            <Chat chat={chat} user={user} />
          </div>
        ))
      ) : (
        <ChatsSkeleton />
      )}
    </div>
  );
};

export default ChatsList;
