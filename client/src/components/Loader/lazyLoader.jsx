import React from "react";
import nez from "../../assets/1488.gif";

export default function LazyLoader() {
  return (
    <div className="h-[100vh] w-screen flex flex-col justify-center items-center gap-2">
      <img className="object-cover w-[5rem] h-[5rem]" src={nez}></img>
      <div className=" text-3xl text-black">
        <p className="text-3xl font-semibold">Loading...</p>
      </div>
    </div>
  );
}
