import { Pagination, Navigation, FreeMode } from "swiper/modules";
import { FaBed, FaCalendarAlt, FaUserFriends } from "react-icons/fa";
import { IoCalendarSharp } from "react-icons/io5";
import bill from "../../../assets/bill.png";
import { SwiperSlide, Swiper } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { formatCurrentDates } from "../../../utils/formatDates";
import { Fragment } from "react";

export default function GuestsCurrentBooking({ latestBookingDetails }) {
  const details = latestBookingDetails;
  console.log(details);

  return (
    <>
      <div className="flex gap-16 items-center text-sm">
        <div className="flex gap-4 items-center">
          <div className="p-4 rounded-full bg-violet-950 text-white text-2xl mt-2">
            <IoCalendarSharp />
          </div>
          <div className="flex flex-col gap-1 font-semibold">
            <p className="text-violet-950">Booking ID #{details?.booking_id}</p>
            <p>{details?.room?.room_type}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1 font-semibold">
          <div className="flex gap-2 items-center text-violet-950">
            <FaUserFriends />
            <p className="text-violet-950">Room Capacity</p>
          </div>
          <p>{details?.room?.capacity} Peoples</p>
        </div>
        <div className="flex flex-col gap-1 font-semibold">
          <div className="flex gap-2 items-center text-violet-950">
            <FaBed />
            <p className="">Bed Types</p>
          </div>
          <p>{details?.room?.beds?.map((bed) => bed.bed_type_name)}</p>
        </div>
        <div className="flex flex-col gap-1  font-semibold">
          <div className="flex gap-2 items-center text-violet-950">
            <FaCalendarAlt />
            <p className="text-violet-950">Check-in Date</p>
          </div>
          {details?.check_in_date && (
            <p>{formatCurrentDates(details?.check_in_date)}</p>
          )}
        </div>
        <div className="flex flex-col gap-1  font-semibold">
          <div className="flex gap-2 items-center text-violet-950">
            <FaCalendarAlt />
            <p className="text-violet-950">Check-out Date</p>
          </div>
          {details?.check_out_date && (
            <p>{formatCurrentDates(details?.check_out_date)}</p>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mt-6">
        <p className="font-semibold">Room Facilities</p>
        <div className="flex items-center gap-1 font-semibold text-sm">
          {details?.room?.amenities?.map((amen, index) => (
            <Fragment key={index}>
              <p>{amen}</p>
              {index !== details?.room?.amenities?.length - 1 && <span>,</span>}
              {/* {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => (
                <p>haha</p>
              ))} */}
            </Fragment>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <Swiper
          navigation={true}
          freeMode={true}
          slidesPerView={3}
          spaceBetween={20}
          modules={[Pagination, Navigation, FreeMode]}
          className="mySwiper w-[972px]"
        >
          {details?.room?.room_pictures?.map((picture, index) => (
            <SwiperSlide key={index}>
              <img
                className="w-[20rem] h-[10rem] object-cover rounded-lg"
                src={picture.room_picture}
              ></img>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
