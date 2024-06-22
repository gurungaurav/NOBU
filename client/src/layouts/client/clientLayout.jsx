import React from "react";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import { IoIosArrowUp } from "react-icons/io";

export default function ClientLayout({ children }) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col ">
      <Navbar />
      {children}
      <Footer />
      {/* <div
        className=" fixed text-white bottom-20 right-10 p-3 text-xl bg-violet-950 rounded-full border-2 z-30 hover:bg-opacity-90 cursor-pointer"
        onClick={scrollToTop}
      >
        <IoIosArrowUp />
      </div> */}
    </div>
  );
}
