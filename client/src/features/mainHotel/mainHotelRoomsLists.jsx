import React, { useRef, useState } from "react";
import { cn } from "../../utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import wall from "../../assets/wall.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
// import required modules
import { EffectFade, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

export default function MainHotelRoomsLists({ room }) {
  const ref = useRef(null);

  console.log(room);

  const [direction, setDirection] = useState("left");

  const roomDetails = room;

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

  console.log(roomDetails);

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
    <Link
      className="cursor-pointer"
      to={`/mainHotel/${room?.hotel_id}/room/${room?.room_id}`}
    >
      <motion.div
        onMouseEnter={handleMouseEnter}
        ref={ref}
        className={cn(
          "w-full bg-transparent overflow-hidden group/card relative"
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
            <Swiper
              spaceBetween={30}
              effect="fade"
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              className="mySwiper w-full h-[20rem] "
              modules={[EffectFade, Autoplay]}
            >
              {roomDetails?.other_pictures?.map((hehe, index) => (
                <SwiperSlide key={index} className="w-full h-full">
                  <img
                    alt="hehe"
                    className={cn(" object-cover w-full h-full scale-[1.15]")}
                    src={hehe.room_picture}
                    variants={variants}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <motion.div
              variants={textVariants}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
              className={cn("text-white absolute bottom-4 left-5 z-40")}
            >
              {/* <h1 className="font-semibold text-xl">hehe</h1> */}
              <p className="inline font-semibold">
                NPR {roomDetails?.price_per_night} per night
              </p>
              <p className="text-sm">{roomDetails?.capacity} People </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div>
        <h1 className="text-2xl font-semibold mb-4 text-violet-950">
          {roomDetails?.room_type?.type_name}
        </h1>
        <p className="text-black  line-clamp-3">{roomDetails?.description}</p>
        <div className="flex items-start">
          <div className="p-2 text-sm bg-violet-950 text-white font-semibold mt-4">
            <p>View Details</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
