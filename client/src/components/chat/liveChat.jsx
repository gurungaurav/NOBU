import React, { useState } from "react";
import { SiGooglechat } from "react-icons/si";
import { FaChevronDown } from "react-icons/fa";
import MainChat from "./mainChat";

export default function LiveChat() {
  const [openChat, setOpenChat] = useState(false);

  const handleOpenChat = () => {
    setOpenChat(!openChat);
  };

  return (
    <>
      <div
        className="relative rounded-[2rem] transform hover:scale-105 transition-transform duration-300 ease-in font-semibold cursor-pointer bg-violet-950 text-white items-center p-4 pr-6 pl-6 flex gap-2 "
        onClick={handleOpenChat}
      >
        {openChat ? (
          <FaChevronDown />

        ) : (
          <>
            <SiGooglechat />
            <p>Live chat</p>
          </>
        )}
      </div>
      {openChat &&
      <div className="absolute -top-[500px] right-0">
          <MainChat />
      </div>
      }
    
    </>
  );
}
