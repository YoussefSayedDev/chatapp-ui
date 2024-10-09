"use client";
import imageAavatr from "@/assets/image-1.jpg";
import { useUser } from "@/hooks/useUser";
import { removeFromCookie } from "@/utils/removeFromCookie";
import { LogOut, SettingsIcon, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Settings } from "./Settings";

const Avatar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { user, setUser } = useUser();

  const router = useRouter();

  const handLogout = () => {
    setUser(null);

    removeFromCookie("authToken");

    return router.push("/login");
  };

  const imageRef = useRef(null);

  document.addEventListener("click", (e) => {
    if (e.target !== imageRef.current) {
      setIsOpen(false);
    }
  });

  return (
    <div className='relative select-none'>
      <Image
        onClick={() => setIsOpen(!isOpen)}
        src={user?.profile_picture ? user?.profile_picture : imageAavatr}
        width={50}
        height={50}
        alt='Avatar'
        className='rounded-full object-cover size-10 cursor-pointer'
        ref={imageRef}
      />
      {isOpen && (
        <div className='absolute top-10 right-10 bg-secondary p-1.5 w-36 z-50 rounded-sm'>
          <ul className='flex flex-col gap-1'>
            <li className='bg-popover p-1 rounded-sm text-base font-semibold text-popover-foreground cursor-pointer hover:bg-destructive'>
              <Link href='/profile' className='flex items-center gap-2'>
                <User className='size-5' />
                Profile
              </Link>
            </li>
            <li className='bg-popover p-1 flex items-center gap-2 rounded-sm text-base font-semibold text-popover-foreground cursor-pointer hover:bg-destructive'>
              <SettingsIcon className='size-5' />
              <Settings />
            </li>
            <li
              onClick={handLogout}
              className='bg-popover p-1 flex items-center gap-2 rounded-sm text-base font-semibold text-popover-foreground cursor-pointer hover:bg-destructive'
            >
              <LogOut className='size-5' />
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Avatar;
