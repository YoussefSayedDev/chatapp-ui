"use client";
import Header from "@/components/header/Header";
import { ChatContextProvider } from "@/context/ChatContext";
import { useUser } from "@/hooks/useUser";
import { baseUrl } from "@/utils/services";
import Image from "next/image";
import { useState } from "react";

const Profile = () => {
  const { user, setUser } = useUser();

  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Preview the image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      console.log("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("userImage", selectedFile);

    try {
      console.log("selectedFile", selectedFile);
      const response = await fetch(`${baseUrl}/users/${user?.id}/edit`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      console.log("Image uploaded successfully:", data);

      // Reset The User After Update To Local Storage
      localStorage.setItem("user", JSON.stringify(data.data));

      // Set The Update User To User State
      setUser(data.data);

      // Set Image State To Null
      setImage(null);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleCancelUpdate = () => {
    setImage(null);
  };

  return (
    user && (
      <ChatContextProvider user={user}>
        <div className='mt-24'>
          <Header />
          <div className='border min-h-[400px] rounded-md container py-4 flex gap-60 flex-col lg:flex-row items-start justify-between mx-auto px-5'>
            <div className='flex-shrink border rounded-md'>
              <div className='w-[400px] h-[400px]'>
                <Image
                  width={400}
                  height={400}
                  src={typeof image === "string" ? image : user.profile_picture}
                  alt='Profile'
                  className='h-full w-full object-cover rounded-sm'
                />
              </div>
              <div>
                <label
                  htmlFor='file'
                  className='text-center block p-2 m-2 border rounded-md cursor-pointer hover:bg-muted font-semibold text-muted-foreground'
                >
                  Change profile image
                </label>
                <input
                  onChange={handleInputChange}
                  type='file'
                  name='image'
                  id='file'
                  className='hidden'
                  accept='image/*'
                />
                {image && (
                  <form className='flex gap-4' onSubmit={handleOnSubmit}>
                    <button
                      type='submit'
                      className='flex-1 mt-4 px-4 py-2 bg-blue-500 text-white rounded-md'
                    >
                      Upload Image
                    </button>
                    <button
                      onClick={handleCancelUpdate}
                      type='button'
                      className='flex-1 mt-4 px-4 py-2 bg-red-500 text-white rounded-md'
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            </div>
            <div className='flex-1 border min-h-[400px] h-full p-5'>
              <h1 className='font-bold'>Information about you</h1>
              <div className='py-10 px-5 flex flex-col gap-5'>
                <h2 className='flex gap-1 items-center'>
                  <span className='text-muted-foreground'>Name:</span>
                  <p>{user.name}</p>
                </h2>
                <h2 className='flex gap-1 items-center'>
                  <span className='text-muted-foreground'>Email:</span>
                  <p>{user.email}</p>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </ChatContextProvider>
    )
  );
};

export default Profile;
