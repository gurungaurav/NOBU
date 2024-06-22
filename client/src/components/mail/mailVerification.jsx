import React from "react";
import { mailVerify } from "../../services/mail/mailVerify";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import mail from "../../assets/mail.png";
import mailVeri from "../../assets/mailVeri.gif";

//!This is for user's mail verification
export default function MailVerification() {
  const id = useParams();
  const token = useParams();
  const navigate = useNavigate();
  console.log(id, token);

  const userId = parseInt(id.id);
  console.log(userId);

  const userToken = token.token;

  const verifyMail = async (e) => {
    e.preventDefault();
    try {
      const res = await mailVerify(userId, userToken);
      console.log(res.data);
      Swal.fire({
        title: res.data.message,
        text: "Your account's been verified now you can login",
        imageUrl: mailVeri,
        // timer:4000
      });
      navigate("/login");
    } catch (error) {
      const errorMessage = error.response.data.message;
      toast.error(errorMessage);
    }
  };

  return (
    <div className="bg-violet-950500 flex  justify-center h-screen items-center">
      <div className="w-[20rem] h-[20rem] bg-gray-100 flex flex-col items-center justify-center">
        <div className="w-[10rem] ">
          <img src={mail}></img>
        </div>
        <div className="">
          <p className="font-bold text-xl">Verify your email address</p>
        </div>
        <div
          className="bg-pink-600 mt-2 cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 p-2 rounded-md"
          onClick={(e) => verifyMail(e)}
        >
          <p className="text-white text-sm font-bold ">CLICK TO VERIFY </p>
        </div>
      </div>
    </div>
  );
}
