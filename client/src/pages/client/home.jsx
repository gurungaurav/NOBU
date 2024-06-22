import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import wall from "../../assets/flower.webp";
import HotelIntro from "../../features/home/components/main-top/hotelIntro";
import MainBody from "../../features/home/components/main-body/mainBody";
import Footer from "../../components/footer/footer";
import "../../global/css/navbar.css";
import { IoIosArrowUp } from "react-icons/io";
import bill from "../../assets/hehe.jpeg";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function Home() {
  const [showAnimation, setShowAnimation] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showButton, setShowButton] = useState(0);

  const handleScroll = () => {
    const offset = window.scrollY;

    if (offset > 400) {
      setIsScrolled(true);
      setShowButton(true);
    } else {
      setIsScrolled(false);
      setShowButton(false);
    }
    setScrollPosition(offset);
  };

  useEffect(() => {
    setTimeout(() => {
      setShowAnimation(true);
    }, 400);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scroll({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div
        className={`flex flex-col z-40 w-full bg-white transition-opacity duration-1000 ease-in-out ${
          showAnimation ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* <div
        className={`flex flex-col z-40 w-full bg-white transition-opacity duration-1000 ease-in-out`}
      > */}
        <div
          className={`navbar-container ${isScrolled ? "sticky" : "absolute"}`}
          style={{
            transition: isScrolled ? " 0.2s ease" : "0.2s ease",
          }}
        >
          <Navbar />
        </div>
        <div className="relative h-screen ">
          <div
            className="absolute inset-0 bg-gradient-to-b from-black to-transparent"
            style={{ zIndex: 1, opacity: 0.7 }}
          ></div>
          <div className="absolute inset-0 overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src={wall}
              alt="Background"
              style={{
                transform: `translateY(${scrollPosition * 0.1}px)`,
                transition: "transform 0.3s ease",
              }}
            />
          </div>
          <div className="absolute bottom-16 left-0 w-full z-20">
            <div className="pb-10">
              <HotelIntro />
            </div>
          </div>
        </div>

        <div className="pl-20 pr-20 pt-10">
          <MainBody />
        </div>
        <div
          className=" w-full h-[25rem]  bg-center bg-no-repeat bg-cover z-10 "
          style={{
            backgroundImage: `url(${wall})`,
            backgroundAttachment: "fixed",
          }}
        >
          <div className="text-center flex justify-center items-center flex-col h-full text-white">
            <div className="sm:text-center">
              <h2 className="text-3xl font-semibold leading-7 text-white sm:text-4xl xl:text-5xl">
                Overview
              </h2>
              <hr className="h-1.5 w-32 border-none bg-violet-950 sm:mx-auto mt-3 rounded-lg" />
            </div>
            <div className="mx-auto mt-10 grid max-w-screen-lg grid-cols-1 gap-x-8 gap-y-12 text-center sm:text-left md:grid-cols-3">
              <div className="backdrop-blur-lg relative mb-3 rounded-3xl border bg-white/70 px-12 py-10 text-left shadow lg:px-12">
                <p className="relative text-5xl font-black text-violet-950">
                  10
                </p>
                <p className="relative mt-5 text-gray-600">Listed Hotels</p>
              </div>

              <div className="backdrop-blur-lg relative mb-3 rounded-3xl border bg-white/70 px-12 py-10 text-left shadow lg:px-12">
                <p className="relative text-5xl font-black text-violet-950 ">
                  51%
                </p>
                <p className="relative mt-5 text-gray-600">
                  Customer Satisfaction
                </p>
              </div>

              <div className="backdrop-blur-lg relative mb-3 rounded-3xl border bg-white/70 px-12 py-10 text-left shadow lg:px-12">
                <p className="relative m-0 text-5xl font-black text-violet-950">
                  8529+
                </p>
                <p className="relative mt-5 text-gray-600">Happy Customers</p>
              </div>
            </div>
            <p>Join our growing community today!</p>
          </div>
        </div>
        <div className="grid grid-cols-2 items-center px-[15rem] my-28 gap-20">
          <div>
            <p className="first-letter:capitalize text-5xl text-violet-950 font-semibold">
              Join us
            </p>
            <div className="bg-black w-[4rem] p-[2px] rounded-lg mt-1"></div>
            <p className="mt-2 text-lg ">
              Through our family of websites, travelers connect with the world’s
              best travel suppliers. This is our marketplace–a thriving
              community, passionate about the mind-expanding, soul-filling power
              of travel. Connect with your best guests today!
            </p>
            <button className="group flex w-28 cursor-pointer select-none items-center justify-center rounded-md  border-2  border-white bg-violet-950 text-white  text-sm  transition hover:border-2  hover:bg-white hover:text-black hover:border-violet-950  mt-4 md:w-40 md:text-base lg:w-fit lg:p-3 lg:text-base">
              <Link
                to={"/listYourProperty"}
                className="group ml-3 flex w-full items-center justify-center rounded py-1 text-center text-sm font-bold group-hover:text-secondaryColor md:text-base"
              >
                List your property now
              </Link>
              <FaArrowRightLong className=" mx-2 h-6 w-0 transition-all group-hover:w-6 group-hover:text-secondaryColor" />
            </button>
          </div>
          <img className="h-[25rem] object-cover w-full" src={bill}></img>
        </div>
        {/* <div className="mx-20  border-t border-t-violet-950 flex items-center justify-center">
          <form
            action="#"
            method="POST"
            class="m-10 flex flex-col gap-4 w-[60rem]"
          >
            <p className="text-xl">
              Get exclusive inspiration for your next stay subscribe to our
              newsletter
            </p>
            <div class="group relative border focus-within:ring-1 focus-within:ring-gray-900 sm:flex-row ">
              <input
                type="email"
                name=""
                placeholder="Enter email address"
                class="block  w-full bg-transparent px-4 py-4 bg-slate-300 placeholder-gray-900 outline-none"
                required=""
              />
              <div class="flex  sm:absolute sm:inset-y-0 sm:right-0 sm:h-full sm:border-l">
                <button
                  type="submit"
                  class="inline-flex w-full items-center justify-center bg-green-400 text-violet-950 px-6 py-3 text-lg font-bold"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </form>
        </div> */}
      </div>
      {showButton && (
        <div
          className=" fixed text-white bottom-20 right-10 p-3 text-xl bg-violet-950 rounded-full border-2 z-30 hover:bg-opacity-90 cursor-pointer"
          onClick={scrollToTop}
        >
          <IoIosArrowUp />
        </div>
      )}
      <Footer />
    </>
  );
}
