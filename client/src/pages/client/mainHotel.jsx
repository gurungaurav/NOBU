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
    <div className="flex flex-col pl-20 pr-20 w-full gap-10 pt-6 pb-10">
      <MainHotelTop hotelDetails={hotelDetails} loading={loading} />
      <MainHotelRooms rooms={hotelDetails.roomDetails} loading={loading} />
      <div className="mt-10">
        <MainHeaders Headers={"Popular Rooms"} />
        <div className="grid grid-cols-2 gap-10 mx-40 mt-10">
          {hotelDetails?.roomDetails?.slice(0, 4)?.map((room, index) => (
            <div key={index}>
              <MainHotelRoomsLists room={room} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 mb-16">
        <MainHeaders Headers={"Guest Reviews"} />
        <Swiper
          slidesPerView={4}
          spaceBetween={40}
          freeMode={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Autoplay]}
          className="mySwiper mb-8 mt-12"
        >
          {hotelDetails?.hotel_reviews?.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="hover:shadow-lg ease-in duration-700 rounded-lg p-6 pb-16 border border-b-4 h-[15rem]">
                <div className="flex flex-col gap-2 ">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 rounded-full h-12">
                      <img
                        className="w-full h-full object-cover rounded-full"
                        src={review?.user?.user_pic}
                      ></img>
                    </div>
                    <div className="text-sm">
                      <p>
                        <strong>{review.user.user_name}, </strong>
                        {format(new Date(review.createdAt), "MMMM dd")}
                      </p>
                    </div>
                  </div>
                  <h1 className="text-violet-950 text-2xl font-semibold">
                    {review.title}
                  </h1>
                  <div className="">
                    <p className="line-clamp-3 text-sm">
                      {review.content} It was a pleasure working with the
                      Saturn. They understood the brief correctly and delivered
                      great designs exceeding the expectations.
                    </p>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="flex text-xl text-yellow-400">
                      {generateStars(review.ratings)}
                    </div>
                    <p className="text-sm font-semibold">
                      {review.ratings}/5 stars
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* <Swiper
          slidesPerView={4}
          spaceBetween={30}
          freeMode={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Autoplay]}
          className="mySwiper"
        >
          {hotelDetails?.hotel_reviews?.map((review, index) => (
            <SwiperSlide key={index} className="ml-6 mr-16">
              <div className="hover:shadow-lg ease-in duration-700 rounded-lg p-6 pb-16 border border-b-4 h-[15rem]">
                <div className="flex flex-col gap-2 ">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 rounded-full h-12">
                      <img
                        className="w-full h-full object-cover rounded-full"
                        src={review?.user?.user_pic}
                      ></img>
                    </div>
                    <div className="text-sm">
                      <p>
                        <strong>{review.user.user_name}, </strong>
                        {format(new Date(review.createdAt), "MMMM dd")}
                      </p>
                    </div>
                  </div>
                  <h1 className="text-violet-950 text-2xl font-semibold">
                    {review.title}
                  </h1>
                  <div className="">
                    <p className="line-clamp-3 text-sm">
                      {review.content} It was a pleasure working with the
                      Saturn. They understood the brief correctly and delivered
                      great designs exceeding the expectations.
                    </p>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="flex text-xl text-yellow-400">
                      {generateStars(review.ratings)}
                    </div>
                    <p>{review.ratings}/5 stars</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper> */}
      </div>
      {/* <MainReviews reviews={hotelDetails.hotel_reviews} /> */}
      <MainHotelMaps
        Location={hotelDetails.location}
        Phone={hotelDetails.phone_number}
        Email={hotelDetails.email}
      />
    </div>
  );
}
