import React, { useEffect, useState, useRef } from "react";
import MainHeaders from "../../../../components/mainHeaders/mainHeaders";
import { getAllHotels } from "../../../../services/hotels/hotels.service";
import { Link } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../../../utils/cn";
import wall from "../../../../assets/light.jpg";
import { FaStar } from "react-icons/fa";
import { amenityIcons } from "../../../../icons/amenitiesIcons";
import HotelSkeleton from "../../../../components/skeletons/hotelListsSkeleton";

//!So i will just add the total reviews of all the hotels and the send the same reviews to the hotel details
export default function MainHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  Aos.init();
  const getHotels = async () => {
    try {
      const res = await getAllHotels();
      setHotels(res.data.data);
      console.log(res.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getHotels();
  }, []);

  const ref = useRef(null);

  const [direction, setDirection] = useState("left");

  const handleMouseEnter = (event) => {
    if (!ref.current) return;

    const direction = getDirection(event, ref.current);
    console.log("direction", direction);
    switch (direction) {
      case 0:
        setDirection("top");
        break;
      case 1:
        setDirection("right");
        break;
      case 2:
        setDirection("bottom");
        break;
      case 3:
        setDirection("left");
        break;
      default:
        setDirection("left");
        break;
    }
  };

  const getDirection = (ev, obj) => {
    const { width: w, height: h, left, top } = obj.getBoundingClientRect();
    const x = ev.clientX - left - (w / 2) * (w > h ? h / w : 1);
    const y = ev.clientY - top - (h / 2) * (h > w ? w / h : 1);
    const d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;
    return d;
  };

  const variants = {
    initial: {
      x: 0,
    },

    exit: {
      x: 0,
      y: 0,
    },
    top: {
      y: 20,
    },
    bottom: {
      y: -20,
    },
    left: {
      x: 20,
    },
    right: {
      x: -20,
    },
  };

  const textVariants = {
    initial: {
      y: 0,
      x: 0,
      opacity: 0,
    },
    exit: {
      y: 0,
      x: 0,
      opacity: 0,
    },
    top: {
      y: -20,
      opacity: 1,
    },
    bottom: {
      y: 2,
      opacity: 1,
    },
    left: {
      x: -2,
      opacity: 1,
    },
    right: {
      x: 20,
      opacity: 1,
    },
  };

  return (
    <div>
      <div className="flex justify-center mt-6">
        <MainHeaders Headers={"Our Hotels & Restros"} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 pt-10 gap-10 ">
        {loading ? (
          [1, 2, 3, 4].map(() => <HotelSkeleton />)
        ) : hotels ? (
          hotels.slice(0, 4).map((hotel) => (
            <Link to={`/mainHotel/${hotel.hotel_id}`} key={hotel.hotel_id}>
              <div className="border rounded-md flex flex-col shadow-md cursor-pointer ">
                <motion.div
                  onMouseEnter={handleMouseEnter}
                  ref={ref}
                  className={cn(
                    "w-full bg-transparent rounded-t-md overflow-hidden group/card relative"
                  )}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      className="relative h-full w-full"
                      initial="initial"
                      whileHover={direction}
                      exit="exit"
                    >
                      <motion.div className="group-hover/card:block hidden absolute inset-0 w-full h-full bg-black/40 z-10 transition duration-500" />
                      <motion.div
                        variants={variants}
                        className="h-full w-full relative bg-gray-50 dark:bg-black"
                        transition={{
                          duration: 0.2,
                          ease: "easeOut",
                        }}
                      >
                        <img
                          alt="hehe"
                          className={cn(
                            "h-[25rem] w-full object-cover scale-[1.15]"
                          )}
                          src={hotel?.main_picture}
                        />
                      </motion.div>
                      <motion.div
                        variants={textVariants}
                        transition={{
                          duration: 0.5,
                          ease: "easeOut",
                        }}
                        className={cn(
                          "text-white absolute bottom-4 left-4 z-20"
                        )}
                      >
                        <h1 className="font-semibold text-xl">
                          {hotel.location}
                        </h1>
                        <p className="inline text-sm">NPR {hotel.leastPrice}</p>{" "}
                        -{" "}
                        <p className="inline text-sm">
                          NPR {hotel.mostExpensivePrice}
                        </p>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
                <div className="pr-5 pl-5 pt-5 pb-10 ">
                  <div className="border py-1 px-2 rounded-md w-fit text-sm border-violet-950 text-violet-900 font-semibold flex gap-1 items-center">
                    <FaStar className="text-yellow-400 " />
                    <p> {hotel.ratings} star hotel</p>
                  </div>
                  <div className="flex flex-col mt-2">
                    <div className="flex flex-col">
                      <p className="text-violet-950 text-2xl font-semibold ">
                        {hotel.hotel_name}
                      </p>
                      {/* <div className="p-2 rounded-lg bg-violet-950 text-white font-semibold w-fit mt-2">
                        <p>4.5</p>
                      </div> */}
                      <p className="text-xs text-black  tracking-wide mt-1">
                        {hotel.hotel_reviews_ratings}/5 - Excellent (
                        {hotel.hotel_reviews.length} reviews)
                      </p>
                    </div>
                    <div className="flex gap-6 items-center">
                      {hotel.hotel_amenities?.slice(0, 6).map((amen, index) => (
                        <div
                          key={index}
                          className="flex  text-sm font-semibold mt-3  justify-between "
                        >
                          <div className="flex gap-1 items-center">
                            {amenityIcons[amen]} {amen}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No hotels found</p>
        )}
      </div>
      {hotels?.length > 4 && (
        <div className="flex justify-center items-center cursor-pointer mt-10">
          <Link
            to={`/filterHotels`}
            className="p-2 bg-violet-950 text-white fonst-semibold transform hover:scale-105 transition-transform duration-300 ease-in"
          >
            <p>Load more</p>
          </Link>
        </div>
      )}
    </div>
  );
}
