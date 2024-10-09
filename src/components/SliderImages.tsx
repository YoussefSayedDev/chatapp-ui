"use client";

import imagesArr from "@/constants/image-slide";
import Image from "next/image";
import { useEffect, useState } from "react";

const SliderImages = () => {
  const [opacity, setOpacity] = useState<number>(0);

  useEffect(() => {
    const handler = setInterval(() => {
      const randNum = Math.floor(Math.random() * imagesArr.length);
      setOpacity(randNum);
    }, 10000);
    return () => {
      clearInterval(handler);
    };
  }, []);

  return (
    <div className='relative w-1/2 object-cover hidden md:block'>
      {imagesArr.map((imageUrl, index) => (
        <Image
          key={index}
          src={imageUrl}
          width={500}
          height={640}
          alt=''
          className={`absolute h-full w-full object-cover top-0 left-0 transition-opacity duration-1000 ${
            opacity === index ? "opacity-1" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
};

export default SliderImages;
