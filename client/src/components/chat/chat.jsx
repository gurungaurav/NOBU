import React, { useEffect, useState } from "react";
import { IoSendSharp } from "react-icons/io5"; // Assuming you are using react-icons/io5 for the send icon
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllChatss } from "../../services/chat/chatSocket";
// ... (previous imports)

export default function Chat({ socket, user, vendor }) {
  const { id } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const [showMessages, setShowMessages] = useState([]);
  const [chatRoomId, setChatRoomId] = useState(0);

  const sender = id === user ? user : vendor;

  useEffect(() => {
    const getChats = async () => {
      try {
        const res = await getAllChatss(vendor, user);
        console.log(res.data);
        setShowMessages(res.data.data);
        setChatRoomId(res.data.data[0].chat_room_id);

        const receiveMessageHandler = (data) => {
          console.log(data, "jsjsj");
          const existingChatRoom = res.data.data?.find(
            (message) => message.chat_room_id === data.chat_room_id
          );
          //!Checking the room the socket sends the message directly so checking and then sending to that specific room only
          if (existingChatRoom) {
            console.log("pass");
            setShowMessages((previousMessages) => [data, ...previousMessages]);
          } else {
            console.log("fail");
          }
        };

        // Set up event listener when component mounts
        socket.on("receiveMessage", receiveMessageHandler);

        // Clean up the socket connection when the component unmounts
        return () => {
          socket.off("receiveMessage", receiveMessageHandler);
          socket.disconnect();
        };
      } catch (e) {
        console.log(e);
      }
    };

    getChats();
  }, [socket, vendor, user]);
  const submitMessage = (e) => {
    e.preventDefault();
    if (message !== "") {
      socket.emit("messages", {
        vendor: vendor,
        user: user,
        sender: sender,
        message: message,
      });
      setMessage("");
    }
  };

  // Sort messages based on timestamps
  const sortedMessages = [...showMessages].sort(
    (a, b) => new Date(a.sender.createdAt) - new Date(b.sender.createdAt)
  );

  //!This is used to auto matically scroll to the latest messages
  useEffect(() => {
    // Scroll to the bottom of the chat container
    const chatContainer = document.getElementById("chatContainer");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [showMessages]);

  return (
    <>
      <div
        id="chatContainer"
        className="overflow-auto gap-2 p-2 scrollbar-thin flex flex-col text-sm text-white h-full scrollbar-thumb-violet-950 scrollbar-track-gray-200 rounded-md"
      >
        {sortedMessages && sortedMessages.length > 0 ? (
          sortedMessages.map((message) => (
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
                    className="w-8 h-8 rounded-full object-cover"
                    src={
                      message.sender.sender_id === message.hotel.vendor_id
                        ? message.hotel.picture
                        : message.user.picture
                    }
                    alt="Bill Avatar"
                  />
                </>
              ) : (
                <>
                  <img
                    className="w-8 h-8 rounded-full object-cover"
                    src={
                      message.sender.sender_id === message.hotel.vendor_id
                        ? message.hotel.picture
                        : message.user.picture
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
          ))
        ) : (
          <div>
            <p>Start a conversation</p>
          </div>
        )}
      </div>
      <form
        onSubmit={(e) => submitMessage(e)}
        className="p-2 flex rounded-b-2xl gap-2 items-center shadow-2xl"
      >
        <div className="w-[90%]">
          <input
            className="outline-none w-full pl-3"
            placeholder="Type a message..."
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-violet-950 p-[10px] text-white cursor-pointer"
          // onClick={(e) => submitMessage(e)}
        >
          <IoSendSharp />
        </button>
      </form>
    </>
  );
}
