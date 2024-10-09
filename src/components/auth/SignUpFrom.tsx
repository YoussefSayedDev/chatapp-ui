"use client";
import LoadingButton from "@/components/LoadingButton";
import { PasswordInput } from "@/components/PasswordInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/useUser";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { addToCookie } from "@/utils/addToCookie";
import { baseUrl, postRequest } from "@/utils/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import ErrorMsg from "./ErrorMsg";

const SignUpFrom = () => {
  // User Context
  const { setUser } = useUser();

  // Next router to redirect to home page sign up
  const router = useRouter();

  // Error State
  const [error, setError] = useState();

  // Use Form Hook to set default inputs value
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  // Function To Handle On Submit
  const onSubmit = (values: SignUpValues) => {
    // Destructuring the inputs
    const { firstname, lastname, email, password } = values;

    // Set Error to undefined first
    setError(undefined);

    // Start Transition
    startTransition(async () => {
      const res = await postRequest(
        `${baseUrl}/users/register`,
        JSON.stringify({
          name: firstname + " " + lastname,
          email,
          password,
        })
      );

      // Set Error State IF There Is Error
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
    <div className='mt-6'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-4'
        >
          <div className='flex flex-col gap-5 lg:flex-row text-start w-full'>
            <div className='w-full lg:w-1/2 flex flex-col'>
              <FormField
                control={form.control}
                name='firstname'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First</FormLabel>
                    <FormControl>
                      <Input placeholder='Name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='w-full lg:w-1/2 flex flex-col'>
              <FormField
                control={form.control}
                name='lastname'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last</FormLabel>
                    <FormControl>
                      <Input placeholder='Name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
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
            Create account
          </LoadingButton>
          <ErrorMsg error={error} />
        </form>
      </Form>
    </div>
  );
};

export default SignUpFrom;
