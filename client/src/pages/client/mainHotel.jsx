import React, { useEffect, useState } from "react";
import MainHotelTop from "../../features/mainHotel/mainHotelTop";
import MainHotelRooms from "../../features/mainHotel/mainHotelRooms";
import { useParams } from "react-router-dom";
import { getSingleHotel } from "../../services/hotels/hotels.service";
import MainHotelMaps from "../../features/mainHotel/mainHotelMaps";
import MainHotelRoomsLists from "../../features/mainHotel/mainHotelRoomsLists";
import MainHeaders from "../../components/mainHeaders/mainHeaders";
import { format } from "date-fns/format";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
// import required modules
import { Autoplay, FreeMode } from "swiper/modules";
import { MdStar } from "react-icons/md";

export default function MainHotelPage() {
  const { hotel_id } = useParams();

  const [hotelDetails, setHotelDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSpecificHotel = async () => {
    try {
      const res = await getSingleHotel(hotel_id);
      console.log(res.data);
      setHotelDetails(res.data.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getSpecificHotel();
  }, []);

  const generateStars = (ratings) => {
    const filledStars = Math.floor(ratings);
    const hasHalfStar = ratings % 1 !== 0;

    const starArray = [];

    // Add filled stars
    for (let i = 0; i < filledStars; i++) {
      starArray.push(<MdStar key={i} />);
    }

    // Add half star if applicable
    if (hasHalfStar) {
      starArray.push(<MdStar key="half" className="text-yellow-400" />);
    }

    // Add empty stars to fill the remaining space
    for (let i = starArray.length; i < 5; i++) {
      starArray.push(<MdStar key={`empty${i}`} className="text-gray-400" />);
    }

    return starArray;
  };

  return (
    <div className="flex flex-col px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 w-full gap-6 sm:gap-8 lg:gap-10 pt-4 sm:pt-6 pb-8 sm:pb-10">
      <MainHotelTop hotelDetails={hotelDetails} loading={loading} />
      <MainHotelRooms rooms={hotelDetails.roomDetails} loading={loading} />
      <div className="mt-6 sm:mt-8 lg:mt-10">
        <MainHeaders Headers={"Popular Rooms"} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 xl:gap-10 mx-0 sm:mx-4 lg:mx-8 xl:mx-12 2xl:mx-16 mt-6 sm:mt-8 lg:mt-10">
          {hotelDetails?.roomDetails?.slice(0, 4)?.map((room, index) => (
            <div key={index} className="w-full">
              <MainHotelRoomsLists room={room} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 sm:mt-8 lg:mt-10 mb-8 sm:mb-12 lg:mb-16">
        <MainHeaders Headers={"Guest Reviews"} />
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          freeMode={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 32,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
          }}
          modules={[FreeMode, Autoplay]}
          className="mySwiper mb-6 sm:mb-8 mt-6 sm:mt-8 lg:mt-12"
        >
          {hotelDetails?.hotel_reviews?.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="hover:shadow-lg ease-in duration-700 rounded-lg p-4 sm:p-5 lg:p-6 pb-8 sm:pb-12 lg:pb-16 border border-b-4 h-auto min-h-[280px] sm:min-h-[320px] lg:min-h-[15rem] bg-white">
                <div className="flex flex-col gap-2 sm:gap-3 h-full">
                  <div className="flex gap-3 sm:gap-4 items-center">
                    <div className="w-10 sm:w-12 rounded-full h-10 sm:h-12 flex-shrink-0">
                      <img
                        className="w-full h-full object-cover rounded-full"
                        src={review?.user?.user_pic}
                        alt={`${review.user.user_name}'s profile`}
                      />
                    </div>
                    <div className="text-xs sm:text-sm min-w-0 flex-1">
                      <p className="truncate">
                        <strong>{review.user.user_name}, </strong>
                        {format(new Date(review.createdAt), "MMMM dd")}
                      </p>
                    </div>
                  </div>
                  <h1 className="text-violet-950 text-lg sm:text-xl lg:text-2xl font-semibold line-clamp-2">
                    {review.title}
                  </h1>
                  <div className="flex-1">
                    <p className="line-clamp-3 sm:line-clamp-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {review.content}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center mt-auto">
                    <div className="flex text-base sm:text-lg lg:text-xl text-yellow-400">
                      {generateStars(review.ratings)}
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-700">
                      {review.ratings}/5 stars
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="mt-6 sm:mt-8 lg:mt-10">
        <MainHotelMaps
          Location={hotelDetails.location}
          Phone={hotelDetails.phone_number}
          Email={hotelDetails.email}
        />
      </div>
    </div>
  );
}
