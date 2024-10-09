"use client";
import { useUser } from "@/hooks/useUser";
import { loginSchema, LoginValues } from "@/lib/validation";
import { addToCookie } from "@/utils/addToCookie";
import { baseUrl, postRequest } from "@/utils/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import LoadingButton from "../LoadingButton";
import { PasswordInput } from "../PasswordInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import ErrorMsg from "./ErrorMsg";

const LoginForm = () => {
  // User Context
  const { setUser } = useUser();

  // Next router to redirect to home page after log in
  const router = useRouter();

  // Error state
  const [error, setError] = useState();

  // Use Form Hook to set default inputs value
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  // Function To Handle On Submit
  const onSubmit = async (values: LoginValues) => {
    // Destructuring the inputs
    const { email, password } = values;

    // Set Error to undefined first
    setError(undefined);

    // Start Transition
    startTransition(async () => {
      const res = await postRequest(
        `${baseUrl}/users/login`,
        JSON.stringify({
          email,
          password,
        })
      );

      // Set Error State If There Is Error
      if (res.error) return setError(res.message);

      // Set User into User Context
      setUser(res.data);

      // Add The Token To Cookies
      addToCookie("authToken", res.data.token);

      // Set User in LocalStorage
      localStorage.setItem("user", JSON.stringify(res.data));

      // Redirect To Home Page
      return router.push("/");
    });
  };
  return (
    <div className='mt-10'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-6'
        >
          <div className='flex flex-col items-start'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='w-full text-start'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='Email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex flex-col items-start'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='w-full text-start'>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='Password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <LoadingButton
            loading={isPending}
            type='submit'
            variant='default'
            className='text-secondary-foreground'
          >
            Log in
          </LoadingButton>
          <ErrorMsg error={error} />
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
