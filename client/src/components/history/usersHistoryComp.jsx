import React from "react";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { IoLocationSharp } from "react-icons/io5";
import { MdOutlinePayment } from "react-icons/md";
import { PiUsers } from "react-icons/pi";
import { Link } from "react-router-dom";

export default function UsersHistoryComp(props) {
  const booking = props.bookingDetails;
  return (
    <div className="grid grid-cols-1 gap-6  w-[70%] ">
      {booking?.length > 0 ? (
        booking?.map((booking, index) => (
          <Link
            to={`/mainHotel/${booking.hotel.hotel_id}/specificBookingDetails/${booking?.booking.booking_id}`}
            className="flex gap-5 shadow-md border rounded-lg "
            key={index}
          >
            <img
              className="w-[27rem] h-[15rem] object-cover rounded-l-lg "
              src={booking?.room?.room_picture[0]?.picture}
            ></img>
            <div className="flex flex-col gap-2 text-sm justify-center text-gray-500">
              <div className="flex gap-2 items-center">
                <img
                  className="w-12 h-12 rounded-full object-cover"
                  src={booking?.hotel?.hotel_picture}
                ></img>
                <p className="text-xl font-semibold text-black">
                  {booking.hotel.hotel_name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <IoLocationSharp className="text-black text-xl" />

                <p>{booking.hotel.hotel_location}</p>
              </div>
              <div className="flex items-center gap-2">
                <PiUsers className="text-black text-xl" />

                <p>{booking?.room?.room_capacity} guests</p>
              </div>

              <div className="flex gap-2 items-center">
                <FaRegCalendarCheck className="text-black text-xl" />
                <p>
                  {`Check-in, ${new Date(
                    booking.booking.check_in_date
                  ).toLocaleDateString()}`}{" "}
                  |
                  {`Check-out, ${new Date(
                    booking.booking.check_out_date
                  ).toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <MdOutlinePayment className="text-black text-xl" />
                <p>Payed method: Khalti</p>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <p className="text-sm font-semibold">No details </p>
      )}
    </div>
  );
}
