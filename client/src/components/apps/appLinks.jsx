import React from "react";
import { FaFacebookF } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

export default function AppLinks() {
  return (
    <div className="flex gap-3">
      <div className="border-2 border-white rounded-full p-2 hover:rotate-[360deg]  hover:bg-white ease-in duration-500 hover:text-black cursor-pointer">
        <FaTwitter className="text-xl " />
      </div>
      <div
        onClick={() =>
          window.open("https://www.facebook.com/gaurvv.gurung/", "_blank")
        }
        className="border-2 border-white rounded-full p-2 hover:rotate-[360deg]  hover:bg-white ease-in duration-500 hover:text-black cursor-pointer"
      >
        <FaFacebookF className="text-xl" />
      </div>
      <div className="border-2 border-white rounded-full p-2 hover:rotate-[360deg]  hover:bg-white ease-in duration-500 hover:text-black cursor-pointer">
        <FaLinkedin className="text-xl" />
      </div>
      <div
        onClick={() =>
          window.open("https://www.instagram.com/gaur_v.g/", "_blank")
        }
        className="border-2 border-white rounded-full p-2 hover:rotate-[360deg]  hover:bg-white ease-in duration-500 hover:text-black cursor-pointer"
      >
        <RiInstagramFill className="text-xl" />
      </div>
    </div>
  );
}
