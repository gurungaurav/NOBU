import React, { useState, useRef } from "react";
import { checkOTPasswordReset } from "../../services/auth/loginResgiter.service";
import { useParams } from "react-router-dom";
import { sendOtpCode } from "../../services/mail/mailVerify";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function VerificationPage() {
  const [otp, setOTP] = useState(["", "", "", ""]); // Initialize OTP state with empty strings
  const { user_id, email } = useParams();
  const inputRefs = useRef([]);
  const { current: refs } = inputRefs;

  const navigate = useNavigate();

  const handleChange = (index, value) => {
    const updatedOTP = [...otp];
    updatedOTP[index] = value; // Update the OTP value at the specified index
    setOTP(updatedOTP);

    // If a character is entered and there's a next input field, focus on it
    if (value && refs[index + 1]) {
      refs[index + 1].focus();
    }

    // If a character is deleted and there's a previous input field, focus on it
    if (!value && refs[index - 1]) {
      refs[index - 1].focus();
    }
  };

  const renderOTPTags = () => {
    return otp.map((char, index) => (
      <input
        key={index}
        type="text"
        value={char}
        onChange={(e) => handleChange(index, e.target.value)}
        maxLength={1} // Limit input to single character
        className="flex h-16 w-16 items-center pl-5 justify-center rounded-xl border text-4xl font-medium sm:h-20 sm:w-20 sm:text-6xl"
        ref={(el) => (refs[index] = el)} // Store reference to input field
      />
    ));
  };

  const joinedOtp = otp.join("");

  const verifyOtp = async () => {
    // Check if OTP is empty
    if (joinedOtp.trim() === "") {
      toast.error("Please enter the OTP code.");
      return; // Exit function early
    }
    try {
      const res = await checkOTPasswordReset(user_id, joinedOtp);
      console.log(res.data);
      toast.success(res.data.message);
      navigate(`/nobu/user/verified/passwordReset/${joinedOtp}`);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };
  console.log(otp);
  const submitEmail = async (e) => {
    e.preventDefault();

    try {
      const res = await sendOtpCode({ email: email });
      console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        console.log("errror");
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };
  return (
    <div className="mx-auto my-10 flex  max-w-md flex-col rounded-lg border px-8 py-10 shadow-lg">
      <p className="text-xl font-medium">Please check your email</p>
      <p className="mb-4 text-lg text-gray-500">
        We've sent a code to{" "}
        <span className="text-black font-semibold">{email}</span>{" "}
      </p>
      <div className="mb-2 flex flex-wrap space-x-4">{renderOTPTags()}</div>
      <p className="mb-4 text-gray-500 text-sm">
        Didn't get a code?{" "}
        <button
          className="underline hover:text-black hover:font-semibold duration-300"
          onClick={(e) => submitEmail(e)}
        >
          Click to resend
        </button>
      </p>
      <div className="flex flex-col sm:flex-row">
        <button
          className="mb-2 w-full rounded-md border px-8 py-2 font-medium sm:mr-4 sm:mb-0 duration-300  hover:bg-gray-100"
          onClick={() => navigate("/login")}
        >
          Cancel
        </button>
        <button
          className="w-full rounded-md border bg-violet-950 px-8 py-2 duration-300 font-medium text-white hover:bg-opacity-90"
          onClick={verifyOtp}
        >
          Verify
        </button>
      </div>
    </div>
  );
}
