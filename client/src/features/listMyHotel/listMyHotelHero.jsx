import React from "react";
import billNotFound from "../../assets/flower.webp";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { LuCheck } from "react-icons/lu";
import Aos from "aos";
import "aos/dist/aos.css";

export default function ListMyHotelHero({ role }) {
  Aos.init();

  const toasterr = () => {
    toast.error("You have already listed your hotel.");
  };
  return (
    <div className="relative h-[30rem] w-full">
      <div
        alt="hehe"
        className=" h-full w-full object-cover"
        // src={billNotFound}
        style={{
          backgroundImage: `url(${billNotFound})`,
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute top-1/3 w-full text-5xl text-white font-semibold items-center justify-center gap-10 flex">
          <div className="w-[35rem]">
            <p className=""> Register on Nobu.com</p>
            <p className=" text-3xl">
              Show your property to worldwide travellers
              <span className="text-violet-950 ">.</span>
            </p>
          </div>
          <div
            className="bg-white w-[25rem] text-black rounded-md "
            data-aos="fade-up"
            data-aos-once="true"
            data-aos-duration="500"
          >
            <div className="p-6 border-b  mb-10">
              <p className="text-2xl font-bold text-black ">
                Earn more with consistent bookings
              </p>
              <div className="flex gap-2 items-center">
                <LuCheck className="text-xl" />
                <p className="text-base my-4">
                  Full control over your property and finances
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <LuCheck className="text-xl" />
                <p className="text-base ">
                  Registration is free and takes 15 minutes
                </p>
              </div>
              <div className="text-sm flex justify-center mt-2 ">
                {role === "user" ? (
                  <Link
                    to={"/vendorRegistration"}
                    className="bg-violet-950 p-4 w-full text-center text-white  rounded-lg cursor-pointer"
                  >
                    <p>List now</p>
                  </Link>
                ) : role != undefined ? (
                  <div
                    onClick={toasterr}
                    className="bg-violet-950 p-4 w-full text-center text-white rounded-lg cursor-pointer"
                  >
                    <p>List now</p>
                  </div>
                ) : (
                  <Link
                    to={"/login"}
                    className="bg-violet-950 p-4 text-center w-full text-white rounded-lg cursor-pointer"
                  >
                    <p>List now</p>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ListMyHotelHero.propTypes = {
  role: PropTypes.string.isRequired,
};
