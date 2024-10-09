import { Chat, User } from "@/types/interfaces";
import { baseUrl, getRequest } from "@/utils/services";
import { useEffect, useState } from "react";

interface useFetchTypes {
  chat: Chat | null;
  user: User | null;
}

interface recipientType {
  email: string;
  id: number;
  name: string;
  profile_picture: string;
}

const useFetchRecipientUser = ({ chat, user }: useFetchTypes) => {
  const [recipientUser, setRecipientUser] = useState<recipientType | null>(
    null
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      if (chat) {
        const currentChat = await getRequest(
          `${baseUrl}/conversations/${chat?.id}`
        );

        if (currentChat.error) return setError(currentChat.message);
        const recipientId = currentChat.data.members.filter(
          (id: number) => id !== user?.id
        );

        if (!recipientId) return;

        const recipientUserResponse = await getRequest(
          `${baseUrl}/users/${recipientId}`
        );

        if (recipientUserResponse.error)
          return setError(recipientUserResponse.message);

        setRecipientUser(recipientUserResponse.data);
      }
    };

    getUser();
  }, [chat, user?.id]);

  const fetchRecipient = {
    recipientUser,
    error,
  };

  return fetchRecipient;
};

export default useFetchRecipientUser;
