import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";

export default function Button(props) {
  return (
    <button className="group hover:bg-white  hover:border-2 hover:border-violet-950  hover:  flex w-44 cursor-pointer select-none items-center justify-center rounded-md bg-violet-950 px-4 py-2 text-white transition">
      <FaArrowLeftLong className="flex-0 group-hover:w-6 ml-4 h-6 w-0 group-hover:text-violet-950 transition-all" />
      <a
        href="#"
        className="group  group-hover:text-violet-950 flex w-full items-center justify-center rounded py-1 text-center font-bold"
      >
        {props.title}
      </a>
    </button>
  );
}
