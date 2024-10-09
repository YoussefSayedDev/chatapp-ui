"use client";
import { User } from "@/components/types/interfaces";
import { useChat } from "@/hooks/useChat";
import { useUser } from "@/hooks/useUser";
import { baseUrl, getRequest, postRequest } from "@/utils/services";
import Image from "next/image";
import { FC } from "react";
interface userProps {
  user: User;
}

const UserAvatar: FC<userProps> = ({ user: userAvatar }) => {
  const { user } = useUser();
  const { setUserChats, setCurrentConversation, userChats, onlineUsers } =
    useChat();

  const createNewConversation = async () => {
    // Create The Conversation if does not exist
    if (user?.id) {
      const response = await postRequest(
        `${baseUrl}/conversations`,
        JSON.stringify({
          userIds: [user.id, userAvatar.id],
          isGroup: false,
          name: null,
        })
      );

      if (response.error)
        console.error("Conversation error: ", response.message);

      // Get All The New Conversations
      const res = await getRequest(`${baseUrl}/users/${user.id}/conversations`);
      if (res.error) console.error("Conversation error: ", res.message);

      setUserChats(res.data);

      const chat = userChats?.filter(
        (chat) => chat?.id === response.data.conversation.id
      );
      if (chat) setCurrentConversation(chat[0]);
    }
  };

  return (
    user && (
      <div
        onClick={createNewConversation}
        className='relative my-5 cursor-pointer flex flex-col justify-center items-center'
      >
        <Image
          src={userAvatar.profile_picture}
          width={60}
          height={60}
          alt='User avater'
          className='rounded-full size-14'
        />
        {onlineUsers &&
          onlineUsers.map(
            (user) =>
              user.userId === userAvatar.id && (
                <span
                  key={userAvatar.id}
                  className='absolute top-2 right-2 size-3 rounded-full bg-green-500'
                ></span>
              )
          )}
        <div className='w-20 text-center'>
          <h3 className='text-xs line-clamp-1'>{userAvatar.name}</h3>
        </div>
      </div>
    )
  );
};

export default UserAvatar;
