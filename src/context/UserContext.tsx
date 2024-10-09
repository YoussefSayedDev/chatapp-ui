"use client";
import { User } from "@/types/interfaces";
import { baseUrl, getRequest } from "@/utils/services";
import React, { createContext, ReactNode, useEffect, useState } from "react";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  allUsers: User[] | null;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  // User State
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[] | null>(null);

  useEffect(() => {
    const getAllUsers = async () => {
      const res = await getRequest(`${baseUrl}/users`);

      // Get All Users Except The Current User
      const allUsers = res.data.users.filter((u: User) => u.id !== user?.id);

      setAllUsers(allUsers);
    };

    getAllUsers();
  }, [user?.id]);

  useEffect(() => {
    const storageUser = localStorage.getItem("user");

    if (storageUser) setUser(JSON.parse(storageUser));
  }, [user?.id]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        allUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
