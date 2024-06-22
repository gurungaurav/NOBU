import React from "react";
import nobu from "../../assets/Nobu-Logo-2.png";
import AppLinks from "../apps/appLinks";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Footer() {
  const navigate = useNavigate();
  const { id } = useSelector((state) => state.user);

  const profileNavigation = () => {
    if (id) {
      navigate(`/profile/${id}`);
    } else {
      navigate("/login");
    }
  };
  return (
    <footer className="bg-violet-950 text-white  ">
      <div className="mr-20 ml-20 flex justify-around items-center py-10 border-b border-b-white">
        <div className="w-[5rem] h-[5rem] cursor-pointer">
          <img className="w-full h-full" src={nobu} />
        </div>
        <div className="flex flex-col w-[25rem] gap-2 ">
          <h1 className="font-semibold text-2xl">Customer service</h1>
          <div className="flex gap-32">
            <div className="flex flex-col text-sm gap-2">
              <p
                className="hover:text-blue-500 hover:underline cursor-pointer"
                onClick={profileNavigation}
              >
                My account
              </p>
              <p
                onClick={() => navigate("/listYourProperty")}
                className="hover:text-blue-500 hover:underline cursor-pointer"
              >
                Contact us
              </p>
              <p
                onClick={() => navigate("/listYourProperty")}
                className="hover:text-blue-500 hover:underline cursor-pointer"
              >
                FAQ
              </p>
            </div>
            <div className="flex flex-col  text-sm gap-2">
              <p
                className="hover:text-blue-500 hover:underline cursor-pointer"
                onClick={() => navigate("/terms-conditions")}
              >
                Privacy policy
              </p>
              <p
                className="hover:text-blue-500 hover:underline cursor-pointer"
                onClick={() => navigate("/terms-conditions")}
              >
                Terms & Conditions
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-2 ">
          <div>Connect with us:</div>
          <AppLinks />
        </div>
      </div>
      <div className="flex items-center justify-center pt-5 pb-5 text-sm">
        <p>
          Copyright © 2024 Nobu, Nepal. Tel: +977-9812332149. All Rights
          Reserved.
        </p>
      </div>
      <div className="flex bg-neutral-950 py-4 text-xs justify-center gap-8 text-gray-200">
        <p
          className="border-r pr-4 hover:text-blue-500 hover:underline cursor-pointer"
          onClick={() => navigate("/terms-conditions")}
        >
          Privacy Policy
        </p>
        <p
          className="border-r pr-4 hover:text-blue-500 hover:underline cursor-pointer"
          onClick={() => navigate("/terms-conditions")}
        >
          Terms & Conditions
        </p>
        <p className="border-r pr-4 hover:text-blue-500 hover:underline cursor-pointer">
          Cookie Center
        </p>
        <p className="border-r pr-4 hover:text-blue-500 hover:underline cursor-pointer">
          Security & Safety
        </p>
        <p className="border-r pr-4 hover:text-blue-500 hover:underline cursor-pointer">
          Do Not Sell or Share My Personal Information
        </p>
        <p>© 2024 Nobu Corporation</p>
      </div>
    </footer>
  );
}
