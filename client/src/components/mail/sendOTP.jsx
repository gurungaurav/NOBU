import React, { useState } from "react";
import { sendOtpCode } from "../../services/mail/mailVerify";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

//TODO: Need to delete otp code after every 60 seconds
export default function SendOTP() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const submitEmail = async (e) => {
    e.preventDefault();
    try {
      const res = await sendOtpCode({ email: email });
      console.log(res.data);
      const user_id = res.data.data.user_id;
      if (res.data.success) {
        toast.success(res.data.message);
        navigate(`/nobu/user/verification/${user_id}/${res.data.data.email}`);
        // navigate("/nobu/user/verified/passwordReset");
      } else {
        console.log("errror");
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  return (
    <div className=" flex flex-col justify-center items-center bg-gray-200 h-screen">
      <form
        className="bg-white rounded-lg shadow-lg border p-20 w-[50%]"
        onSubmit={(e) => submitEmail(e)}
      >
        <p className="mb-4">
          Please enter your email address to search for your account.
        </p>
        <div class="group relative border border-gray-900 p-1 focus-within:ring-1 focus-within:ring-gray-900 sm:flex-row">
          <input
            type="email"
            name=""
            placeholder="Enter email address"
            class="block  w-full bg-transparent px-4 py-4 placeholder-gray-900 outline-none"
            required="true"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div class="flex border-gray-900 sm:absolute sm:inset-y-0 sm:right-0 sm:h-full sm:border-l">
            <button
              type="submit"
              class="inline-flex w-full items-center justify-center bg-slate-900 px-6 py-3 text-lg font-bold text-white outline-none transition-all sm:hover:translate-x-2 sm:hover:-translate-y-2 hover:bg-gray-600 focus:bg-gray-600"
            >
              Send OTP Mail
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
