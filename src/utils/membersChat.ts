import { Chat } from "@/components/types/interfaces";
import { baseUrl, getRequest } from "./services";

export const membersChat = async (chat: Chat | null) => {
  if (chat)
    try {
      const res = await getRequest(`${baseUrl}/conversations/${chat.id}`);

      if (res) return res.data.members;
    } catch (error) {
      return console.error("Get members chat Error:", error);
    }
  return [];
};
