import React, { useEffect, useState } from "react";
import { BiSolidPhoneCall } from "react-icons/bi";
import { CiMail } from "react-icons/ci";
import { HiLocationMarker } from "react-icons/hi";
import AppLinks from "../../components/apps/appLinks";
import ContactUsForm from "../../features/home/other/contactUs/contactUsForm";
import {
  getFAQClients,
  getSingleHotel,
} from "../../services/hotels/hotels.service";
import { useParams } from "react-router-dom";

export default function ContactUs() {
  const { hotel_id } = useParams();

  const [hotelDetails, setHotelDetails] = useState({});
  const [faqDetails, setFAQDetails] = useState([]);

  const getSpecificHotel = async () => {
    try {
      const res = await getSingleHotel(hotel_id);
      console.log(res.data);
      setHotelDetails(res.data.data);
    } catch (e) {
      // if (e.response.status === 404) {
      //   navigate("*");
      // }
      console.log(e);
    }
  };

  const getFAQ = async () => {
    try {
      const res = await getFAQClients(hotel_id);
      console.log(res.data);
      setFAQDetails(res.data.data);
      // setHotelDetails(res.data.data);
    } catch (e) {
      // if (e.response.status === 404) {
      //   navigate("*");
      // }
      console.log(e);
    }
  };

  useEffect(() => {
    getSpecificHotel();
    getFAQ();
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-20 items-center justify-center mt-10 mb-10">
      <div className=" w-[70%] ">
        <div className="flex items-center justify-center flex-col mb-10 gap-2">
          <h3 className="text-4xl font-bold tracking-wide ">Contact Us</h3>
          <p className="font-bold text-gray-600">
            Any question or remarks? Just write us a message
          </p>
        </div>
        <div className=" flex items-center justify-center rounded-lg shadow-md border h-[34rem] ">
          <div className="w-[40%] h-full flex flex-col gap-24 p-8 px-10 bg-violet-950 rounded-l-lg text-white">
            <div>
              <h2 className="text-[28px] font-semibold">Contact Information</h2>
              <p className="text-md mt-2">Say something to start a live chat</p>
            </div>
            <div className="flex flex-col gap-12">
              <div className="flex text-md items-center gap-5">
                <BiSolidPhoneCall className="text-xl" />
                <p>{hotelDetails?.phone_number}</p>
              </div>
              <div className="flex text-md items-center gap-5">
                <CiMail className="text-xl" />
                <p>{hotelDetails?.email}</p>
              </div>
              <div className="flex text-md items-center gap-5">
                <HiLocationMarker className="text-xl" />
                <p>{hotelDetails?.location}</p>
              </div>
            </div>
            <AppLinks />
          </div>
          <div className="w-[60%] h-full rounded-r-lg pt-10">
            <ContactUsForm hotel_id={hotelDetails?.hotel_id} />
          </div>
        </div>
      </div>
      <div className="mt-8 mb-16">
        <h2 class="text-4xl text-center  mb-4 font-semibold">
          Have Questions? Checkout these FAQs of Hotel{" "}
          {hotelDetails?.hotel_name}
        </h2>
        <p class="text-center text-lg text-gray-600 mb-2">
          We have written down answers to some of the frequently asked
          questions.
        </p>
        <div class="w-[85rem]">
          <ul class="divide-y divide-gray-200 ">
            {faqDetails?.map((faq) => (
              <li class="text-left" key={faq.faq_id}>
                <div>
                  <details class="group">
                    <summary class="flex items-center gap-3 px-4 py-3 font-medium marker:content-none hover:cursor-pointer">
                      <svg
                        class="w-5 h-5 text-gray-500 transition group-open:rotate-90"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                        ></path>
                      </svg>
                      <span>{faq.title}</span>
                    </summary>
                    <article class="px-4 pb-4">
                      <p>{faq.content}</p>
                    </article>
                  </details>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
