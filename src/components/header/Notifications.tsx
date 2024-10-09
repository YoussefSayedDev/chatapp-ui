"use client";
import { useChat } from "@/hooks/useChat";
import { useUser } from "@/hooks/useUser";
import {
  // notificationsWithInfo,
  unReadNotificationsFun,
} from "@/utils/notificationFuns";
import { baseUrl, deleteRequest } from "@/utils/services";
import { Bell, CircleX, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import Moment from "../app/conversation/Moment";

const Notifications = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const bellDivRef = useRef(null);
  const bellRef = useRef(null);
  const notificationBox = useRef<HTMLDivElement>(null);
  const markAsRead = useRef(null);
  const optionIcon = useRef(null);
  const clicleRef = useRef(null);

  const {
    notifications,
    setNotification,
    markAllNotificationsAsRead,
    markNotificationsAsRead,
  } = useChat();

  const { allUsers, user } = useUser();

  const unReadNotifications = unReadNotificationsFun(notifications);

  // document.onclick = (e) => {
  //   if (
  //     e.target !== bellRef.current &&
  //     e.target !== bellDivRef.current &&
  //     e.target !== markAsRead.current &&
  //     e.target !== optionIcon.current &&
  //     e.target !== clicleRef.current
  //   )
  //     setIsOpen(false);
  // };

  // Handle Delete All Notifications
  const handleRomoveAllNotification = async () => {
    if (user?.id) {
      const res = await deleteRequest(
        `${baseUrl}/users/${user.id}/notifications`
      );

      if (res.error)
        return console.log("Error deletion all notification: ", res.message);

      // Reset the notifiction to null
      setNotification(null);
    }
  };

  // Handle Delete A Specific Notification
  const handleRomoveNotification = async (notificationId: number) => {
    if (notificationId) {
      const res = await deleteRequest(
        `${baseUrl}/notifications/${notificationId}`
      );

      if (res.error)
        return console.log("Error deletion all notification: ", res.message);

      // Reset the notifiction to null
      setNotification(res.data);
    }
  };

  return (
    <div className='relative'>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`size-10 border 
            ${isOpen && "bg-secondary"}
            hover:bg-secondary transition-all duration-300
            rounded-full flex justify-center items-center
          `}
        ref={bellDivRef}
      >
        <Bell className='size-5 cursor-pointer' ref={bellRef} />
        {unReadNotifications && unReadNotifications?.length > 0 && (
          <span className='absolute -top-1 -right-1 text-[10px] bg-teal-700 text-white size-5 flex items-center justify-center rounded-full'>
            {unReadNotifications?.length}
          </span>
        )}
      </div>
      {isOpen && (
        <div
          className={`absolute top-12 right-0 bg-secondary w-96 p-4 rounded-md`}
        >
          <div className='flex justify-between items-center font-semibold text-lg'>
            Notifications
            {notifications && notifications?.length > 0 && (
              <>
                <p
                  onClick={markAllNotificationsAsRead}
                  ref={markAsRead}
                  className='capitalize text-sm text-muted-foreground cursor-pointer font-normal'
                >
                  mark all as read
                </p>
                <span>
                  <Trash2
                    ref={optionIcon}
                    onClick={handleRomoveAllNotification}
                    className='size-5 cursor-pointer hover:text-red-600 transition-all duration-300'
                  />
                </span>
              </>
            )}
          </div>
          <div
            ref={notificationBox}
            className={`${
              notificationBox.current &&
              notificationBox.current.scrollHeight > 300 &&
              "pr-2"
            } mt-5 flex flex-col gap-2 max-h-96 overflow-auto`}
          >
            {notifications &&
              (notifications.length > 0 ? (
                notifications.map(
                  (n) =>
                    n && (
                      <div
                        key={n.id}
                        className={`border-b rounded-md p-2 cursor-pointer ${
                          n.is_read
                            ? "bg-gray-700/10 hover:bg-gray-700/30 border-muted-foreground"
                            : "bg-indigo-700 bg-indigo-700/90 border-[#03a9f4]"
                        }`}
                      >
                        <div className='flex gap-2 items-center justify-between w-full'>
                          <h4
                            onClick={() => {
                              setIsOpen(false);
                              markNotificationsAsRead(n);
                            }}
                            className='font-semibold text-lg flex gap-2'
                          >
                            {allUsers?.find((u) => u.id === n.sender_id)?.name}
                            <p className='text-base ml-auto w-fit relative top-1.5 text-muted-foreground'>
                              send you a new message
                            </p>
                          </h4>
                          <span className='block mb-4'>
                            <CircleX
                              ref={clicleRef}
                              onClick={() => handleRomoveNotification(n.id)}
                              className='size-5 text-muted-foreground hover:text-red-600 transition-all duration-300'
                            />
                          </span>
                        </div>
                        <p
                          onClick={() => {
                            setIsOpen(false);
                            markNotificationsAsRead(n);
                          }}
                          className='line-clamp-1'
                        >
                          {n.message}
                        </p>
                        <span className='text-xs text-muted-foreground/65 ms-auto w-fit block'>
                          <Moment timestamp={n.created_at} />
                        </span>
                      </div>
                    )
                )
              ) : (
                <p className='text-center text-base text-muted-foreground'>
                  No notiticaion.
                </p>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
