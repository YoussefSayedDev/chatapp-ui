"use client";
import { useUser } from "@/hooks/useUser";
import UserAvatar from "./UserAvatar";
import UsersSkeleton from "./UsersSkeleton";

const UsersList = () => {
  const { allUsers } = useUser();

  return (
    <div className='flex items-center gap-1 overflow-y-hidden overflow-x-auto border p-2 rounded-md mb-1 w-full h-[120px]'>
      {!allUsers ? (
        <UsersSkeleton />
      ) : (
        allUsers?.map((user) => (
          <div key={user.id}>
            <UserAvatar user={user} />
          </div>
        ))
      )}
    </div>
  );
};

export default UsersList;
