import loginImage from "@/assets/login.webp";
import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login",
};

const Login = () => {
  return (
    <div className='flex h-screen items-center justify-center p-5'>
      <div className='flex h-full max-h-[40rem] w-full max-w-[64rem] shadow-2xl rounded-3xl overflow-hidden bg-secondary text-secondary-foreground'>
        <div className='md:w-1/2 w-full space-y-10 overflow-y-auto p-10'>
          <div className='space-y-1 text-center'>
            <h1 className='text-3xl font-bold mb-4'>Login to ChatApp</h1>
            <p className=''>
              Welcome <span className='italic'>back</span>
            </p>
            <div className='space-y-5'>
              <LoginForm />
              <Link
                href='/signup'
                className='block text-center hover:underline transition-all duration-300'
              >
                Don&apos;t have an account? Sign up
              </Link>
            </div>
          </div>
        </div>
        <Image
          src={loginImage}
          width={500}
          height={640}
          alt=''
          className='w-1/2 object-cover hidden md:block'
        />
      </div>
    </div>
  );
};

export default Login;
