import MainHotelRoomsLists from "../mainHotel/mainHotelRoomsLists";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
// import required modules
import { Autoplay, FreeMode } from "swiper/modules";

export default function RoomRecommendations({ room }) {
  console.log(room);
  return (
    <section class="py-10 border-t-2">
      <h1 class="mb-12  font-sans text-3xl font-bold text-gray-900">
        You may also like<span class="text-blue-600">.</span>
      </h1>
      <Swiper
        slidesPerView={3}
        spaceBetween={40}
        freeMode={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        modules={[FreeMode, Autoplay]}
        className="mySwiper mb-8 mt-12"
      >
        <div className="grid grid-cols-2 gap-10">
          {room?.map((room, index) => (
            <SwiperSlide key={index}>
              <MainHotelRoomsLists room={room} />
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </section>
  );
}
