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
    <footer className="bg-violet-950 text-white">
      <div className="mx-4 sm:mx-8 lg:mx-12 xl:mx-20 flex flex-col lg:flex-row justify-center lg:justify-around items-center py-6 sm:py-8 lg:py-10 border-b border-b-white gap-6 lg:gap-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 cursor-pointer flex-shrink-0">
          <img className="w-full h-full" src={nobu} alt="Nobu Logo" />
        </div>
        <div className="flex flex-col w-full max-w-md lg:w-[25rem] gap-3 sm:gap-4 text-center lg:text-left">
          <h1 className="font-semibold text-lg sm:text-xl lg:text-2xl">
            Customer service
          </h1>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-32 justify-center lg:justify-start">
            <div className="flex flex-col text-sm gap-2">
              <p
                className="hover:text-blue-500 hover:underline cursor-pointer transition-colors"
                onClick={profileNavigation}
              >
                My account
              </p>
              <p
                onClick={() => navigate("/listYourProperty")}
                className="hover:text-blue-500 hover:underline cursor-pointer transition-colors"
              >
                Contact us
              </p>
              <p
                onClick={() => navigate("/listYourProperty")}
                className="hover:text-blue-500 hover:underline cursor-pointer transition-colors"
              >
                FAQ
              </p>
            </div>
            <div className="flex flex-col text-sm gap-2">
              <p
                className="hover:text-blue-500 hover:underline cursor-pointer transition-colors"
                onClick={() => navigate("/terms-conditions")}
              >
                Privacy policy
              </p>
              <p
                className="hover:text-blue-500 hover:underline cursor-pointer transition-colors"
                onClick={() => navigate("/terms-conditions")}
              >
                Terms & Conditions
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center lg:items-start gap-2 lg:gap-3">
          <div className="text-sm sm:text-base">Connect with us:</div>
          <AppLinks />
        </div>
      </div>
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5 pb-4 sm:pb-5 text-xs sm:text-sm text-center">
        <p>
          Copyright © 2024 Nobu, Nepal. Tel: +977-9812332149. All Rights
          Reserved.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row bg-neutral-950 py-3 sm:py-4 text-xs justify-center items-center gap-2 sm:gap-4 lg:gap-8 text-gray-200 px-4">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 lg:gap-8">
          <p
            className="border-r border-gray-500 pr-2 sm:pr-4 hover:text-blue-500 hover:underline cursor-pointer transition-colors"
            onClick={() => navigate("/terms-conditions")}
          >
            Privacy Policy
          </p>
          <p
            className="border-r border-gray-500 pr-2 sm:pr-4 hover:text-blue-500 hover:underline cursor-pointer transition-colors"
            onClick={() => navigate("/terms-conditions")}
          >
            Terms & Conditions
          </p>
          <p className="border-r border-gray-500 pr-2 sm:pr-4 hover:text-blue-500 hover:underline cursor-pointer transition-colors">
            Cookie Center
          </p>
          <p className="border-r border-gray-500 pr-2 sm:pr-4 hover:text-blue-500 hover:underline cursor-pointer transition-colors">
            Security & Safety
          </p>
          <p className="hover:text-blue-500 hover:underline cursor-pointer transition-colors text-center">
            Do Not Sell or Share My Personal Information
          </p>
        </div>
        <p className="text-center">© 2024 Nobu Corporation</p>
      </div>
    </footer>
  );
}
