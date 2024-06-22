import React from "react";
import { FaCheck } from "react-icons/fa";
import PropTypes from "prop-types";
import AOS from "aos";
import "aos/dist/aos.css";

export default function StepProgress({ role, status }) {
  AOS.init();
  // status = "pending"
  const steps = [
    {
      label: "First register your account if you haven't already",
      completed: role === "vendor" || status === false,
    },
    {
      label: "Provide your property details with photos and amenities",
      completed: role === "vendor" || status === false,
    },
    {
      label: "Wait for admin's response",
      completed: role === "vendor" || status === false,
    },
    {
      label: "Your hotel has been verified and listed",
      completed: role === "vendor" && status !== false,
    },
    {
      label: "Welcome your guests",
      completed: role === "vendor",
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 gap-10">
        <div className="flex flex-col text-5xl font-bold gap-2">
          <h1>Sign up today.</h1>
          <h1>It's easy & free.</h1>
          <p className="text-lg font-thin">
            Our dedicated customer service team will guide you through all the
            steps.
          </p>
        </div>
        <div
          className="flex flex-col gap-4"
          data-aos="fade-left"
          data-aos-once="true"
          data-aos-duration="1000"
        >
          <div className="flex items-center gap-2 bg-white shadow-md border rounded-lg p-4">
            <div className="rounded-full w-11 h-11 flex items-center justify-center font-bold bg-violet-950 text-white">
              <p>1</p>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">Sign up to get started</h1>
              <p className="text-sm">Create your user account</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white shadow-md border rounded-lg p-4">
            <div className="rounded-full w-11 h-11 flex items-center justify-center font-bold bg-violet-950 text-white">
              <p>2</p>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">
                List your property if you haven't already
              </h1>
              <p className="text-sm">Add details of your property</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white shadow-md border rounded-lg p-4">
            <div className="rounded-full w-11 h-11 flex items-center justify-center font-bold bg-violet-950 text-white">
              <p>3</p>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">
                Wait for admin's response
              </h1>
              <p className="text-sm">
                The response will be sent via mail or notification
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white shadow-md border rounded-lg p-4">
            <div className="rounded-full w-11 h-11 flex items-center justify-center font-bold bg-violet-950 text-white">
              <p>4</p>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">Welcome Your guests</h1>
              <p className="text-sm">Create your property account</p>
            </div>
          </div>
        </div>
      </div>
      <div className=" grid grid-cols-2 gap-10 my-20">
        <div
          className="relative flex h-full w-fit flex-col overflow-hidden rounded-2xl bg-white text-gray-600 shadow-lg ring-1 ring-gray-200"
          data-aos="fade-right"
          data-aos-once="true"
          data-aos-duration="1000"
        >
          <div className="flex-auto p-6">
            <div className="relative flex flex-col justify-center gap-2 ">
              {steps.map((step, index) => (
                <div key={index} className="relative mb-4">
                  {step.completed ? (
                    <div className="absolute top-0 flex h-7 w-7 items-center justify-center rounded-full bg-violet-950 font-semibold">
                      <FaCheck className="text-white" />
                    </div>
                  ) : (
                    <div className="absolute top-0 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 font-semibold text-gray-600">
                      {index + 1}
                    </div>
                  )}
                  <div className="ml-12 w-auto pt-1">
                    <h6 className=" font-semibold text-black">{step.label}</h6>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col text-5xl font-bold gap-2">
          <h1>Your Process.</h1>
          <p className="text-lg font-thin">
            Your process of the hotel registration will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
}

StepProgress.propTypes = {
  role: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};
