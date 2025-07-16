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
        <div className="relative h-screen min-h-[500px] sm:min-h-[600px] lg:min-h-[700px]">
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent"
            style={{ zIndex: 1 }}
          ></div>
          <div className="absolute inset-0 overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src={wall}
              alt="Beautiful hotel landscape in Nepal"
              style={{
                transform: `translateY(${scrollPosition * 0.1}px)`,
                transition: "transform 0.3s ease",
              }}
            />
          </div>
          <div className="absolute bottom-4 sm:bottom-8 lg:bottom-12 xl:bottom-16 left-0 w-full z-20 px-2 sm:px-4">
            <div className="pb-4 sm:pb-6 lg:pb-8 xl:pb-10">
              <HotelIntro />
            </div>
          </div>
        </div>

        <div className="px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-6 sm:pt-8 lg:pt-10 xl:pt-12">
          <MainBody />
        </div>
        <div
          className="w-full  bg-center bg-no-repeat bg-cover relative py-12 sm:py-16 mt-12 md:mt-16"
          style={{
            backgroundImage: `url(${wall})`,
            backgroundAttachment:
              typeof window !== "undefined" && window.innerWidth > 768
                ? "fixed"
                : "scroll",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 text-center flex justify-center items-center flex-col h-full text-white px-3 sm:px-4 lg:px-6">
            <div className="text-center mb-6 sm:mb-8 lg:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight text-white">
                Overview
              </h2>
              <hr className="h-1.5 w-16 sm:w-24 lg:w-32 border-none bg-violet-950 mx-auto mt-3 sm:mt-4 rounded-lg" />
            </div>
            <div className="mx-auto grid max-w-screen-lg w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="backdrop-blur-lg relative rounded-2xl sm:rounded-3xl border bg-white/80 px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-6 lg:py-8 xl:py-10 text-left shadow-lg hover:shadow-xl transition-shadow">
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-violet-950">
                  10
                </p>
                <p className="mt-2 sm:mt-3 lg:mt-5 text-xs sm:text-sm lg:text-base text-gray-600 font-medium">
                  Listed Hotels
                </p>
              </div>

              <div className="backdrop-blur-lg relative rounded-2xl sm:rounded-3xl border bg-white/80 px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-6 lg:py-8 xl:py-10 text-left shadow-lg hover:shadow-xl transition-shadow">
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-violet-950">
                  51%
                </p>
                <p className="mt-2 sm:mt-3 lg:mt-5 text-xs sm:text-sm lg:text-base text-gray-600 font-medium">
                  Customer Satisfaction
                </p>
              </div>

              <div className="backdrop-blur-lg relative rounded-2xl sm:rounded-3xl border bg-white/80 px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-6 lg:py-8 xl:py-10 text-left shadow-lg hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-violet-950">
                  8529+
                </p>
                <p className="mt-2 sm:mt-3 lg:mt-5 text-xs sm:text-sm lg:text-base text-gray-600 font-medium">
                  Happy Customers
                </p>
              </div>
            </div>
            <p className="mt-4 sm:mt-6 lg:mt-8 text-sm sm:text-base lg:text-lg font-medium">
              Join our growing community today!
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 max-w-7xl mx-auto lg:grid-cols-2 items-center px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 my-12 sm:my-16 lg:my-20 xl:my-24 2xl:my-28 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 2xl:gap-20">
          <div className="order-2 lg:order-1 space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-violet-950 font-bold leading-tight">
                Join Us
              </h3>
              <div className="bg-violet-950 w-12 sm:w-16 lg:w-20 h-1 sm:h-1.5 rounded-full mt-2 sm:mt-3"></div>
            </div>
            <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700 max-w-none lg:max-w-2xl">
              Through our family of websites, travelers connect with the
              world&apos;s best travel suppliers. This is our marketplace–a
              thriving community, passionate about the mind-expanding,
              soul-filling power of travel. Connect with your best guests today!
            </p>
            <div className="pt-2 sm:pt-4">
              <Link
                to={"/listYourProperty"}
                className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-lg border-2 border-violet-950 bg-violet-950 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 hover:bg-white hover:text-violet-950 hover:border-violet-950 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transform hover:scale-105 active:scale-95"
              >
                <span>List your property now</span>
                <FaArrowRightLong className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <img
              className="h-64 sm:h-80 md:h-96 lg:h-[28rem] xl:h-[32rem] object-cover w-full rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              src={bill}
              alt="Travelers enjoying their hotel experience"
            />
          </div>
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
        <button
          className="fixed text-white bottom-4 sm:bottom-6 lg:bottom-8 right-3 sm:right-4 lg:right-6 xl:right-8 p-2.5 sm:p-3 lg:p-4 text-lg sm:text-xl lg:text-2xl bg-violet-950 rounded-full shadow-lg hover:shadow-xl z-30 hover:bg-violet-800 cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <IoIosArrowUp />
        </button>
      )}
      <Footer />
    </>
  );
}
