"use client";
import App from "@/components/app/App";
import Header from "@/components/header/Header";
import { ChatContextProvider } from "@/context/ChatContext";
import { useUser } from "@/hooks/useUser";

export default function Home() {
  const { user } = useUser();

  return (
    <ChatContextProvider user={user}>
      <Header />
      <main className='flex justify-center items-center pt-24'>
        <App />
      </main>
    </ChatContextProvider>
  );
}
