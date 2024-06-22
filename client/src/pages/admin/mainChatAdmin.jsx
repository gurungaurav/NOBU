import React, { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { HiDotsVertical } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  addNewMessage,
  getAllSupportMessages,
  updateChat,
} from "../../services/chat/chatSocket";

export default function MainChatAdmin() {
  const { admin_id, hotel_name, chat_id } = useParams();
  const { role, id } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false); // State to manage dropdown visibility
  const [status, setStatus] = useState("");
  const [chatRoom, setChatRoom] = useState({});
  const navigate = useNavigate();

  const onReturn = () => {
    navigate(`/supportChatLists/${role === "admin" ? admin_id : hotel_name}`);
  };

  const addMessage = async (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      try {
        const res = await addNewMessage(message, chat_id, id);
        console.log(res.data);
        // After adding message, refresh messages
        getMessages();
        setMessage(""); // Clear the input field after sending message
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("Message cannot be empty");
    }
  };

  const getMessages = async () => {
    try {
      const res = await getAllSupportMessages(chat_id);
      console.log(res.data);
      setChatRoom(res.data.data);
      setMessages(res.data.data.chat);
      setStatus(res.data.data.status);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the chat container
    const chatContainer = document.getElementById("chatContainer");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const sortedMessages = messages
    .slice()
    .sort(
      (a, b) => new Date(a.sender.createdAt) - new Date(b.sender.createdAt)
    );

  const updateStatus = async () => {
    try {
      const res = await updateChat(chat_id);
      console.log(res.data);
      navigate(`/supportChatLists/${role === "admin" ? admin_id : hotel_name}`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="border rounded-lg h-fit  my-4 shadow-lg  mx-8 ">
      <div className="border-b border-gray-300 bg-white py-5 px-8 flex items-center justify-between text-sm text-gray-800">
        <div className="flex items-center gap-6">
          <BsArrowLeft
            className="font-bold cursor-pointer text-lg"
            onClick={onReturn}
          />
          <h4 className=" py-1 text-left font-sans font-semibold text-xl">
            {chatRoom?.title}
            {/* <p className="text-sm font-semibold">User</p> */}
          </h4>
        </div>
        {status === "finished" && (
          <p className="text-red-500 font-semibold">
            The task has been completed you cannot chat on this as the problem
            has been solved
          </p>
        )}

        {role === "admin" && (
          <div className="relative">
            <div
              className="p-2 rounded-full hover:bg-gray-200 duration-300 cursor-pointer text-xl"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <HiDotsVertical />
            </div>
            {showDropdown && (
              <div className="absolute right-0 mt-2 border w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                <button
                  className="block w-full py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={updateStatus}
                >
                  Finish
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div
        id="chatContainer"
        className=" px-4 pt-8 text-left  h-[30rem] border overflow-hidden text-white overflow-y-auto scrollbar-thin scrollbar-thumb-violet-950 scrollbar-track-gray-200"
      >
        <div id="chatContainer" className=" flex flex-col text-sm gap-4">
          {sortedMessages.map((message, index) => (
            <div
              className={`flex mt-2 mr-2 gap-1 ${
                message.sender.sender_id === id
                  ? " justify-end"
                  : " justify-start"
              }`}
              key={message.chat_room_id}
            >
              {message.sender.sender_id === id ? (
                <>
                  <div className="bg-violet-950 w-fit max-w-[50%] p-2 rounded-l-3xl rounded-b-3xl">
                    <p className="overflow-hidden text-overflow-ellipsis">
                      {message.sender.message}
                    </p>
                  </div>
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={
                      message.sender.sender_id === message.admin.admin_id
                        ? message.admin.picture
                        : message.vendor.picture
                    }
                    alt="Bill Avatar"
                  />
                </>
              ) : (
                <>
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={
                      message.sender.sender_id === message.admin.admin_id
                        ? message.admin.picture
                        : message.vendor.picture
                    }
                    alt="Bill Avatar"
                  />
                  <div className="bg-violet-950 w-fit max-w-[50%] p-2 rounded-r-3xl rounded-b-3xl">
                    <p className="overflow-hidden text-overflow-ellipsis">
                      {message.sender.message}
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <form
        onSubmit={addMessage}
        className={`flex items-start border-t border-gray-300 sm:p-8 py-4 text-left text-gray-700 ${
          status === "finished" ? "cursor-not-allowed" : ""
        }`}
      >
        <input
          placeholder="Your Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`mr-4 overflow-hidden w-full p-2 cursor-text resize-none rounded-md bg-white text-sm py-2 sm:py-0 font-normal text-gray-600 opacity-70 shadow-none outline-none focus:text-gray-600 focus:opacity-100 ${
            status === "finished" ? "disabled cursor-not-allowed" : ""
          }`}
          disabled={status === "finished"}
        />
        <button
          className={`relative inline-flex h-10 w-auto flex-initial cursor-pointer items-center justify-center self-center rounded-md bg-blue-700 px-6 text-center align-middle text-sm font-medium text-white outline-none focus:ring-2 ${
            status === "finished" ? "disabled cursor-not-allowed" : ""
          }`}
          type="submit"
          disabled={status === "finished"}
        >
          Send
        </button>
      </form>
    </div>
  );
}
