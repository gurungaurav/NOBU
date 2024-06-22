import React from "react";
import wall from "../../../../assets/wall.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
// import required modules
import { Navigation } from "swiper/modules";
import MainHeaders from "../../../../components/mainHeaders/mainHeaders";

export default function MainBlogsSlider() {
  return (
    <div className="mt-6 px-60">
      <MainHeaders Headers={"Our latest Blogs"} />
      <Swiper
        navigation={true}
        modules={[Navigation]}
        slidesPerView={2}
        spaceBetween={30}
        className="mySwiper h-[30rem] mt-10"
      >
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <SwiperSlide className="relative rounded-xl h-[30rem] " key={index}>
            {/* Image with black gradient overlay */}
            <div className="relative h-full">
              <img
                src={wall}
                className="w-full h-full rounded-xl object-cover"
                alt="haha"
              />
              {/* Black gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b rounded-xl from-transparent to-black opacity-50"></div>
            </div>
            {/* Text content */}
            <div className="absolute top-10 left-10 text-white">
              <p className="text-md font-bold text-gray-400 leading-6">
                TOURISM
              </p>
              <p className="text-3xl font-bold">
                Mountains at night: 12 best locations to enjoy the view
              </p>
            </div>
            <div className="absolute bottom-10 left-10 bg-white p-2 rounded-md text-sm font-semibold">
              <p>Read blog</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
