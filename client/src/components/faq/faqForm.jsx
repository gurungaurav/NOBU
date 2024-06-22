import React, { useState, useEffect } from "react";
import { sendMailAdminListProperty } from "../../services/client/user.service";
import { toast } from "react-toastify";

export default function FaqForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [messageTouched, setMessageTouched] = useState(false);

  useEffect(() => {
    if (emailTouched) {
      if (email.trim() === "") {
        setEmailError("Email is required");
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    }
  }, [email, emailTouched]);

  useEffect(() => {
    if (messageTouched) {
      if (message.trim() === "") {
        setMessageError("Message is required");
      } else {
        setMessageError("");
      }
    }
  }, [message, messageTouched]);

  const handleEmailBlur = () => {
    setEmailTouched(true);
  };

  const handleMessageBlur = () => {
    setMessageTouched(true);
  };

  console.log(emailError);
  console.log(messageError);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if both emailError and messageError are empty
    if (emailError === "" && messageError === "") {
      try {
        const res = await sendMailAdminListProperty({
          email: email,
          message: message,
        });
        console.log(res.data);
        toast.success(res.data.message);
        setMessage("");
        setEmail("");
        setEmailTouched(false);
        setMessageTouched(false);
      } catch (e) {
        console.log(e);
        toast.error(e.response.data.message);
      }
    } else {
      console.log("ssh");
      toast.error("Please fill up the form correctly!");
    }
  };

  return (
    <div className="flex flex-col mt-16 h-fit gap-2">
      <p className="font-semibold text-lg">
        Still have any questions? Contact us to get your answer!
      </p>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 h-[5rem] ">
          <input
            className="border p-2 outline-blue-600 rounded-md"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleEmailBlur}
          ></input>
          {emailTouched ||
            (emailError && <p className="text-red-500">{emailError}</p>)}
        </div>
        <div className="flex flex-col gap-2 h-[13rem]">
          <textarea
            className="border p-2 outline-blue-600 rounded-md w-full h-[10rem]"
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onBlur={handleMessageBlur}
          ></textarea>
          {messageTouched ||
            (messageError && <p className="text-red-500">{messageError}</p>)}
        </div>
        <button
          type="submit"
          className="hover:scale-105 cursor-pointer duration-300 ease-in w-fit p-3 rounded-md text-sm px-8 bg-violet-950 text-white font-semibold"
          // disabled={emailError || messageError}
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
