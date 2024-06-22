import React, { useEffect, useState } from "react";
import { SiGooglechat } from "react-icons/si";
import { IoArrowDownOutline, IoSendSharp } from "react-icons/io5";
import bill from "../../assets/bill.png";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import Chat from "./chat";
import { FaArrowLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { getChatsVendor } from "../../services/vendor/vendor.service";

export default function MainChat() {
  const { id, role } = useSelector((state) => state.user);
  const [openChat, setOpenChat] = useState(false);
  const [allChats, setAllChats] = useState([]);
  const [openVendorChat, setOpenVendorChat] = useState(false);

  //? States to check who is the sender like current user
  //For user
  const [user, setUser] = useState();
  const [vendor, setVendor] = useState();
  const socket = io("http://localhost:1000/");

  //For vendor
  const [userr, setUserr] = useState();
  const [vendorr, setVendorr] = useState();

  const { hotel_id } = useParams();

  useEffect(() => {
    if (role === "vendor") {
      getChatVendor();
    } else {
      socket.emit("checkRoom", { vendor: parseInt(hotel_id), user: id });
      socket.on("roomUsers", (rooms) => {
        console.log(rooms);
        setUser(rooms.user);
        setVendor(rooms.vendor);
      });
    }
  }, []);

  const getChatVendor = async () => {
    try {
      const res = await getChatsVendor(id);
      console.log(res);

      setAllChats(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleOpenChat = (vendor_id, user_id) => {
    setUserr(user_id);
    setVendorr(vendor_id);
  };

  return (
    <div className="flex flex-col rounded-2xl h-[31rem] w-[25rem] shadow-lg bg-white">
      <div className="bg-violet-950 rounded-t-2xl p-2 flex items-center justify-between">
        {openVendorChat && (
          <FaArrowLeft
            className="text-white  cursor-pointer"
            onClick={() => setOpenVendorChat(!openVendorChat)}
          />
        )}
        <div className="flex items-center justify-center w-full">
          <div className=" flex gap-2 items-center justify-center text-white font-semibold">
            <SiGooglechat />
            <p>Live chat</p>
          </div>
        </div>
      </div>

      {role === "vendor" && !openChat ? (
        !openVendorChat ? (
          allChats?.length > 0 ? (
            allChats?.map((chat) => (
              <div
                key={chat.chat_room_id}
                className="overflow-auto gap-2 p-2 scrollbar-thin flex flex-col text-sm text-white  scrollbar-thumb-violet-950 scrollbar-track-gray-200 rounded-md"
              >
                <div
                  className="flex  gap-2 text-black pb-2 items-center border-b-2 border-b-gray-200 cursor-pointer hover:opacity-60"
                  onClick={() => {
                    setOpenVendorChat(!openVendorChat);
                    handleOpenChat(chat.vendor_id, chat.user.user_id);
                  }}
                >
                  <img
                    className="w-16 object-cover h-16  rounded-full"
                    alt="billie"
                    src={chat.user.picture}
                  />
                  <div className="flex flex-col">
                    <p>{chat?.user.user_name}</p>
                    <p>{chat?.latestMessage?.message}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center font-semibold  mt-2 text-lg">
              <p>No guests yet!</p>
            </div>
          )
        ) : (
          <Chat socket={socket} user={userr} vendor={vendorr} />
        )
      ) : (
        <Chat socket={socket} user={user} vendor={vendor} />
      )}
    </div>
  );
}
