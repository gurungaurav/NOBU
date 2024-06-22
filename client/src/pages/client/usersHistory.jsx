import React, { useEffect, useRef, useState } from "react";
import { checkUsersHistory } from "../../services/client/user.service";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { MdOutlinePayment } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import { PiUsers } from "react-icons/pi";
import UsersHistoryComp from "../../components/history/usersHistoryComp";

export default function UsersHistory() {
  const [activeSection, setActiveSection] = useState("Pending");
  const [userHistory, setUsersHistory] = useState([]);
  const [pending, setPending] = useState([]);
  const [successful, setSuccessful] = useState([]);
  const [booked, setBooked] = useState([]);
  const [refunded, setRefunded] = useState([]);
  const [canceled, setCanceled] = useState([]);
  const [ongoing, setOngoing] = useState([]);

  const pendingRef = useRef(null);
  const successRef = useRef(null);
  const currentRef = useRef(null);
  const deletedRef = useRef(null);
  const canceledRef = useRef(null);
  const ongoingRef = useRef(null);

  // const handleNavClick = (section) => {
  //   let targetRef;
  //   switch (section) {
  //     case "Pending":
  //       targetRef = pendingRef;
  //       break;
  //     case "Successful":
  //       targetRef = successRef;
  //       break;
  //     case "Currently Booked":
  //       targetRef = currentRef;
  //       break;
  //     case "Refunded":
  //       targetRef = deletedRef;
  //       break;
  //     case "Canceled":
  //       targetRef = canceledRef;
  //       break;
  //     case "On going":
  //       targetRef = ongoingRef;
  //       break;
  //     default:
  //       break;
  //   }

  //   if (targetRef && targetRef.current) {
  //     const offsetTop = targetRef.current.offsetTop - 100; // Adjust the offset as needed
  //     const offsetScroll = offsetTop > 100 ? offsetTop - 100 : 0; // Subtract a bit more from offsetTop if it's greater than 100
  //     window.scrollTo({
  //       top: offsetScroll,
  //       behavior: "smooth",
  //     });
  //     setActiveSection(section);
  //   }
  // };
  const navigate = useNavigate();

  const { id } = useSelector((state) => state.user);
  console.log(id);

  const usersHistory = async () => {
    try {
      const res = await checkUsersHistory(id);
      console.log(res.data);
      setUsersHistory(res.data.data);
      //!Setting up the datas according to the status of the bookings hehe
      const data = res.data.data;

      // Filter data based on booking status
      const pendingBookings = data.filter(
        (booking) => booking.booking.booking_status === "pending"
      );
      const ongoingBookings = data.filter(
        (booking) => booking.booking.booking_status === "ongoing"
      );
      const successfulBookings = data.filter(
        (booking) => booking.booking.booking_status === "success"
      );
      const bookedBookings = data.filter(
        (booking) => booking.booking.booking_status === "booked"
      );
      const refundedBookings = data.filter(
        (booking) => booking.booking.booking_status === "refund"
      );
      const canceledBookings = data.filter(
        (booking) => booking.booking.booking_status === "canceled"
      );

      // Set filtered data to state variables
      setPending(pendingBookings);
      setSuccessful(successfulBookings);
      setBooked(bookedBookings);
      setRefunded(refundedBookings);
      setOngoing(ongoingBookings);
      setCanceled(canceledBookings);
    } catch (e) {
      navigate(-1);
      console.log(e);
    }
  };

  console.log(booked);
  useEffect(() => {
    usersHistory();
    // const handleScroll = () => {
    //   const scrollPosition = window.scrollY + 300; // Add some offset for better accuracy
    //   if (
    //     scrollPosition >= pendingRef.current.offsetTop &&
    //     scrollPosition < successRef.current.offsetTop
    //   ) {
    //     setActiveSection("Pending");
    //   } else if (
    //     scrollPosition >= successRef.current.offsetTop &&
    //     scrollPosition < currentRef.current.offsetTop
    //   ) {
    //     setActiveSection("On going");
    //   } else if (
    //     scrollPosition >= successRef.current.offsetTop &&
    //     scrollPosition < currentRef.current.offsetTop
    //   ) {
    //     setActiveSection("Successful");
    //   } else if (
    //     scrollPosition >= currentRef.current.offsetTop &&
    //     scrollPosition < deletedRef.current.offsetTop
    //   ) {
    //     setActiveSection("Currently Booked");
    //   } else if (
    //     scrollPosition >= currentRef.current.offsetTop &&
    //     scrollPosition < deletedRef.current.offsetTop
    //   ) {
    //     setActiveSection("Canceled");
    //   } else if (scrollPosition >= deletedRef.current.offsetTop) {
    //     setActiveSection("Refunded");
    //   }
    // };

    // window.addEventListener("scroll", handleScroll);
    // return () => {
    //   window.removeEventListener("scroll", handleScroll);
    // };
  }, []);

  // const queryParams = new URLSearchParams();
  // const navigate = useNavigate();
  // //!Function for handling the pending like for continuing the payment
  // const handlePendingPayment = (booking, hotel_id, room_id) => {
  //   queryParams.set("booking_id", booking.booking_id);
  //   queryParams.set("price", booking.total_price);
  //   queryParams.set("check_in", booking.check_in_date);
  //   queryParams.set("check_out", booking.check_out_date);
  //   const queryString = queryParams.toString();
  //   console.log(queryString);
  //   navigate(
  //     `/mainHotel/${hotel_id}/room/${room_id}/bookingProcess?${queryString}`
  //   );
  // };

  return (
    <div className="w-full h-full pl-48 pr-48 mt-8 mb-10">
      <div className="">
        <div className="sticky top-[88px] bg-white z-20">
          <h1 className="text-3xl font-bold tracking-wider mb-1">
            Your bookings History
          </h1>
          <p className="mb-4 text-sm">
            Here there will be the history of your bookings on different hotels
            available on NOBU
          </p>
          <div className=" flex gap-10">
            <p
            // className={`cursor-pointer ${
            //   activeSection === "Pending"
            //     ? "border-b-4 rounded-sm border-b-violet-950"
            //     : "hover:border-b-violet-950"
            // } transition-all duration-500 delay-100`}
            // onClick={() => handleNavClick("Pending")}
            >
              Pending
            </p>
            <p
            // className={`cursor-pointer ${
            //   activeSection === "On going"
            //     ? "border-b-4 rounded-sm border-b-violet-950"
            //     : "hover:border-b-violet-950"
            // } transition-all duration-500 delay-100`}
            // onClick={() => handleNavClick("On going")}
            >
              On Going
            </p>
            <p
            // className={`cursor-pointer ${
            //   activeSection === "Successful"
            //     ? "border-b-4 rounded-sm border-b-violet-950"
            //     : "hover:border-b-violet-950"
            // } transition-all duration-500 delay-100`}
            // onClick={() => handleNavClick("Successful")}
            >
              Successful
            </p>
            <p
            // className={`cursor-pointer ${
            //   activeSection === "Currently Booked"
            //     ? "border-b-4 rounded-sm border-b-violet-950"
            //     : "hover:border-b-violet-950"
            // } transition-all duration-500 delay-100`}
            // onClick={() => handleNavClick("Currently Booked")}
            >
              Currently Booked
            </p>
            <p
            // className={`cursor-pointer ${
            //   activeSection === "Canceled"
            //     ? "border-b-4 rounded-sm border-b-violet-950"
            //     : "hover:border-b-violet-950"
            // } transition-all duration-500 delay-100`}
            // onClick={() => handleNavClick("Canceled")}
            >
              Canceled
            </p>
            <p
            // className={`cursor-pointer ${
            //   activeSection === "Refunded"
            //     ? "border-b-4 rounded-sm border-b-violet-950"
            //     : "hover:border-b-violet-950"
            // } transition-all duration-500 delay-100`}
            // onClick={() => handleNavClick("Refunded")}
            >
              Refunded
            </p>
          </div>
        </div>
        <div className="mt-6 border-b pb-2" ref={pendingRef}>
          <p className="text-2xl font-semibold ">Pending</p>
          <p className="mb-6 text-sm">
            Here will be the details of your pending history that you have not
            payed or missed or reserved the rooms!
          </p>
          <UsersHistoryComp bookingDetails={pending} />
        </div>
        <div className="mt-6 border-b pb-2" ref={ongoingRef}>
          <p className="text-2xl font-semibold ">On going</p>
          <p className="mb-6 text-sm">
            Here will be the details of your ongoing bookings!
          </p>
          <UsersHistoryComp bookingDetails={ongoing} />
        </div>
        <div className="mt-6 border-b pb-2" ref={successRef}>
          <p className="text-2xl font-semibold mb-6">Successful</p>
          <p className="mb-6 text-sm">
            Here will be the details of your successful bookings!
          </p>
          <UsersHistoryComp bookingDetails={successful} />
        </div>
        <div className="mt-6 border-b pb-2" ref={currentRef}>
          <p className="text-2xl font-semibold mb-6">Currently Booked</p>
          <p className="mb-6 text-sm">
            Here will be the details of your currently booked rooms!
          </p>
          <UsersHistoryComp bookingDetails={booked} />
        </div>
        <div className="mt-6 border-b pb-2" ref={canceledRef}>
          <p className="text-2xl font-semibold mb-6">Canceled</p>
          <p className="mb-6 text-sm">
            Here will be the details of your canceled bookings!
          </p>
          <UsersHistoryComp bookingDetails={canceled} />
        </div>
        <div className="mt-6 border-b pb-2" ref={deletedRef}>
          <p className="text-2xl font-semibold mb-6">Refunded</p>
          <p className="mb-6 text-sm">
            Here will be the details of your refunded bookings!
          </p>
          <UsersHistoryComp bookingDetails={refunded} />
        </div>
      </div>
    </div>
  );
}
