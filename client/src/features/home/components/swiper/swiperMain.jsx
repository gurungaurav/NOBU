import React from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from 'swiper/react';
import demonBg from "../../../../assets/demon.jpg";


export default function SwiperMain() {
  return (
  
    <div className="w-full h-full">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper" 
        autoHeight={true}
      >

        <SwiperSlide >
          <div className="h-[25rem] md:h-[40rem]">
            <img className="h-full w-full object-cover" src={demonBg}></img>
          </div> 
          </SwiperSlide>
        {/* <SwiperSlide><img className="" src={demonBg}></img></SwiperSlide>
        <SwiperSlide><img className="" src={demonBg}></img></SwiperSlide>
        <SwiperSlide><img className="" src={demonBg}></img></SwiperSlide> */}
      </Swiper>
    </div>
  );
}
