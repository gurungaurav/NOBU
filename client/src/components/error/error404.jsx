import React from "react";
import error from "../../assets/error404.jpg";
import Button from "../buttons/button";
import { Link } from "react-router-dom";
import question from "../../assets/ehh.png";
import lost from "../../assets/lost.jpg";

export default function Error404(props) {
  console.log(props.Error);
  return (
    <div className="h-[42rem] relative bg-gray-100">
      {/* <img className="w-full h-full object-cover" src={error}></img> */}
      <div className="container flex flex-col items-center justify-center px-5 mx-auto mt-14">
        <div className="max-w-md text-center">
          <h2 className="mb-8 font-extrabold text-9xl dark:text-gray-400">
            <span className="sr-only">Error</span>404
          </h2>
          <p className="text-2xl font-semibold md:text-3xl">Lost again.</p>
          <p className="mt-4 mb-8 dark:text-gray-600">
            Sorry, we couldn't find this page.
          </p>
          <Link
            rel="noopener noreferrer"
            to={"/"}
            className="px-8 py-3 font-semibold rounded dark:bg-violet-950 hover:bg-opacity-90 duration-300 dark:text-gray-50"
          >
            Back to homepage
          </Link>

          {/* <Link to={"/"} className="">
            <Button title={"Return"} />
          </Link> */}
        </div>
      </div>
      {/* <p className="absolute inset-0 left-1/2 top-1/3  w-fit h-fit text-2xl font-bold text-red-600">
        {props.Error}
      </p> */}

      {/* <img className="absolute bottom-0  left-1/3" src={zoro}></img> */}
      <div className="absolute bottom-0  right-0">
        <img
          className="absolute -top-1 right-32  rotate-12 w-8 h-8"
          src={question}
        ></img>
        <img className="" src={lost}></img>
      </div>
    </div>
  );
}
