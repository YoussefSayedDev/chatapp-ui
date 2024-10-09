import { Notification } from "@/types/interfaces";

const unReadNotificationsFun = (notifications: Notification[] | null) => {
  if (notifications) return notifications?.filter((n) => n?.is_read === false);
  else return [];
};

// const notificationsWithInfo = (
//   notifications: Notification[] | null,
//   users: User[] | null
// ) => {
//   if (notifications)
//     return notifications?.map(async (n: Notification) => {
//       if (users) {
//         // Sender Name
//         const sender = users.find((user) => user.id === n.conversation_id);

//         // Message Content
//         const messages: Message[] = await getRequest(
//           `${baseUrl}/conversations/${n.conversation_id}/messages`
//         );

//         const wantedMsg = messages.map((msg) => msg.id === n.message_id);

//         if (sender)
//           return {
//             ...n,
//             msgContent: wantedMsg,
//             senderName: sender.name,
//           };
//       }
//     });
// };

export { unReadNotificationsFun };
