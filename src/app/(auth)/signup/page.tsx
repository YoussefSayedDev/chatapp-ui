// import signupImage from "@/assets/signup.jpg";
import SignUpFrom from "@/components/auth/SignUpFrom";
import SliderImages from "@/components/SliderImages";
import { Metadata } from "next";
// import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign up",
};

const Signup = () => {
  return (
    <div className='flex h-screen items-center justify-center p-5'>
      <div className='flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden shadow-2xl rounded-3xl bg-secondary text-secondary-foreground'>
        <div className='md:w-1/2 w-full space-y-10 overflow-y-auto p-10'>
          <div className='space-y-1 text-center'>
            <h1 className='text-3xl font-bold mb-4'>Sign up to ChatApp</h1>
            <p className=''>
              A place where <span className='italic'>you</span> can find a
              friend.
            </p>
            <div className='space-y-5'>
              <SignUpFrom />
              <Link
                href='/login'
                className='block text-center hover:underline transition-all duration-300'
              >
                Already have an account? Log in
              </Link>
            </div>
          </div>
        </div>
        <SliderImages />
      </div>
    </div>
  );
};

export default Signup;
