import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import bill from "../../assets/bill.png";

export default function RoomAllPhotos(props) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const images = props?.images;
  return (
    <div className="">
      <Swiper
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
        }}
        loop={true}
        spaceBetween={0}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2 h-[35rem] w-[1030px]"
      >
        {images &&
          images?.map((image) => (
            <SwiperSlide className="h-fit w-fit">
              <img
                className="h-full w-full object-cover"
                src={image.room_picture}
              />
            </SwiperSlide>
          ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {images &&
          images?.map((image) => (
            <SwiperSlide className="cursor-pointer hover:opacity-90">
              <img
                className="h-[10rem] object-cover"
                src={image.room_picture}
              />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}
