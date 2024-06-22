import React from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function SliderMain(props) {

  console.log(props.pictures);
  return (
      <Swiper
      rewind={true}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        // navigation={tr/ue}
        modules={[Autoplay, Pagination]}
        className="mySwiper rounded-xl"
        autoHeight={true}
      >
       {props.pictures &&
        props.pictures.map((picture, index) => (
          <SwiperSlide key={index} className="">
            <div className="w-full h-[30rem] rounded-xl">
              <img className="w-full h-full object-cover rounded-xl"
                src={picture.hotel_picture}
                alt={`Slide ${index}`}
                // style={{ width: "300px", height: "200px" }} // Set width and height here
              />

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
  );
}
