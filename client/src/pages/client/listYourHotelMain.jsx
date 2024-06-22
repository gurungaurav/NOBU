import React, { useEffect, useState } from "react";
import StepProgress from "../../features/listMyHotel/stepProgress";
import FaqListMyHotel from "../../features/listMyHotel/faqListMyHotel";
import FaqForm from "../../components/faq/faqForm";
import { checkListYourProper } from "../../services/client/user.service";
import { useSelector } from "react-redux";
import bill from "../../assets/list.png";
import { GoCheckCircle } from "react-icons/go";
import ListMyHotelHero from "../../features/listMyHotel/listMyHotelHero";

export default function ListYourHotelMain() {
  const { id, jwt, role } = useSelector((state) => state.user);
  const [status, setStatus] = useState("");
  // const [hotelDetails, setHotelDetails] = useState({});

  const checkList = async () => {
    try {
      const res = await checkListYourProper(id, jwt);
      console.log(res.data);
      if (res.data.data) setStatus(res.data.data.hotel_verified);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    checkList();
  }, []);
  return (
    <div className="flex flex-col gap-20 mb-40">
      <ListMyHotelHero role={role} />
      <div className="">
        {/* <div className="flex justify-between items-center ml-20 mr-20">
          <div className="flex gap-2 items-center">
            <RiFileListFill className="text-6xl text-blue-600" />
            <div className="flex flex-col ">
              <p>Sign up first</p>
              <p>Fill in property information and upload pictures</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <RiFileListFill className="text-6xl text-blue-600" />
            <div className="flex flex-col ">
              <p>Submit property information</p>
              <p>Fill in property informaiton and upload pictures</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <RiFileListFill className="text-6xl text-blue-600" />
            <div className="flex flex-col">
              <p>Wait for admin response</p>
              <p>Fill in property informaiton and upload pictures</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <RiFileListFill className="text-6xl text-blue-600" />
            <div className="flex flex-col">
              <p>Welcome your guests</p>
              <p>Fill in property informaiton and upload pictures</p>
            </div>
          </div>
        </div> */}
        <div className="flex justify-center ">
          <StepProgress role={role} status={status} />
        </div>
        <div className="flex justify-center items-center gap-24 bg-gray-50 py-20">
          <div className="gap-6 flex flex-col w-[35rem]">
            <h1 className="text-3xl font-semibold">
              Maintain full control over your property and finances
            </h1>
            <div className="flex gap-2 items-center">
              <GoCheckCircle className="text-4xl" />
              <p>
                Our listing strength checklist helps you complete your property
                setup to attract more guests
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <GoCheckCircle className="text-3xl" />
              <p>Get guaranteed payouts and fraud protection</p>
            </div>
          </div>
          <img className="w-[35rem] h-[25rem] object-cover" src={bill}></img>
        </div>
        <div className="flex flex-col mt-16">
          <h2 className="text-4xl text-center  sm:text-5xl mb-6">
            Have Questions? Checkout these FAQs
          </h2>
          <p className=" text-center text-lg text-gray-600 mb-2">
            We have written down answers to some of the frequently asked
            questions.
          </p>
          <div className="flex gap-10 px-20 ">
            <FaqListMyHotel />
            <FaqForm />
          </div>
        </div>
        {/* <HotelsMembers /> */}
      </div>
    </div>
  );
}
