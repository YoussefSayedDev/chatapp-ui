import Link from "next/link";

const Navbar = () => {
  return (
    <nav>
      <ul className='flex items-center gap-5 font-medium capitalize hover:text-foreground'>
        <li>
          <Link href='/signup' className='hover:underlin'>
            Sign up
          </Link>
        </li>
        <li>
          <Link href='/login' className='hover:underlin'>
            Log in
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
