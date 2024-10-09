"use client";
import { useUser } from "@/hooks/useUser";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { ModeToggle } from "./ModeToggle";
import Notifications from "./Notifications";

const Header = () => {
  const { user } = useUser();

  return (
    <header className='fixed top-0 left-0 py-2 w-full bg-background/60 backdrop-blur-md z-50'>
      <div className='container py-4 flex items-center justify-between mx-auto px-5'>
        <Logo />
        <div>
          {user && (
            <div className='text-muted-foreground flex gap-2'>
              Logged in as{" "}
              <p className='text-popover-foreground capitalize'>{user.name}</p>
            </div>
          )}
        </div>
        <div className='flex items-center gap-5'>
          <Notifications />
          {user ? <Avatar /> : ""}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
