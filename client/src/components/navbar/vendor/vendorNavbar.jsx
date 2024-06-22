import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getSingleHotel } from "../../../services/hotels/hotels.service";
import Navbar from "../navbar";
import "./navbar.css";

export default function VendorNavbar() {
  const [hotelDetails, setHotelDetails] = useState([]);
  const { hotel_id, room_id } = useParams();
  const location = useLocation();

  useEffect(() => {
    getSpecificHotel();
    scrollToTop();
  }, [hotel_id, location.pathname]);

  const getSpecificHotel = async () => {
    try {
      const res = await getSingleHotel(hotel_id);
      setHotelDetails(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="sticky top-0 z-50 bg-white transition-all duration-300 h-fit">
      <Navbar />
      <div className="ml-20 mr-20 mt-2 bg-white">
        <div className="w-full border-b-2 flex justify-around text-center text-sm ">
          <Link
            to={`/mainHotel/${hotel_id}/`}
            className={`link w-full  ${
              location.pathname === `/mainHotel/${hotel_id}/` ||
              location.pathname === `/mainHotel/${hotel_id}`
                ? "active"
                : ""
            }`}
          >
            <p>Overview</p>
          </Link>
          <Link
            to={`/mainHotel/${hotel_id}/filterRooms`}
            className={`link w-full  ${
              location.pathname === `/mainHotel/${hotel_id}/filterRooms` ||
              location.pathname === `/mainHotel/${hotel_id}/room/${room_id}`
                ? "active"
                : ""
            }`}
          >
            <p>Rooms</p>
          </Link>
          <Link
            to={`/mainHotel/${hotel_id}/gallery`}
            className={`link w-full  ${
              location.pathname === `/mainHotel/${hotel_id}/gallery`
                ? "active"
                : ""
            }`}
          >
            <p>Gallery</p>
          </Link>
          <Link
            to={`/mainHotel/${hotel_id}/reviews`}
            className={`link w-full  ${
              location.pathname === `/mainHotel/${hotel_id}/reviews`
                ? "active "
                : ""
            }`}
          >
            <p>Reviews</p>
          </Link>
          <Link
            to={`/mainHotel/${hotel_id}/contactUs`}
            className={`link w-full  ${
              location.pathname === `/mainHotel/${hotel_id}/contactUs`
                ? "active"
                : ""
            }`}
          >
            <p>Contact us</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
