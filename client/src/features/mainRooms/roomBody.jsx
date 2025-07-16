import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/free-mode";
import "swiper/css/scrollbar";
import { BiBed } from "react-icons/bi";
import "react-datepicker/dist/react-datepicker.css";
import {
  bookMarkHotelRooms,
  cancelPendingBookings,
  refundBookings,
} from "../../services/client/user.service";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { Alert, Dialog } from "@mui/material";
import RoomRecommendations from "./roomRecommendations";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import MainSkeletonTheme from "../../components/skeletons/mainSkeletonTheme";
import { amenityIcons } from "../../icons/amenitiesIcons";

export default function RoomBody(props) {
  const [liked, setLikedRoom] = useState(false);
  const { id, jwt } = useSelector((state) => state.user);
  const { hotel_id, room_id } = useParams();
  const [successLoader, setSuccessLoader] = useState(false);
  const [refundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [refundBookingDetails, setRefundBookingDetails] = useState(null);
  const [refundAmount, setRefundAmount] = useState(null);
  const loading = props.loading;
  const [cancelPendingDialogOpen, setCancelPendingDialogOpen] = useState(false);
  const [cancelBookingDetails, setCancelBookingDetails] = useState(null);
  const navigate = useNavigate();

  console.log(hotel_id, room_id);
  const roomDetails = props?.roomDetails;

  console.log(roomDetails);

  // queryParams.set("check_out", selectedDates[0].endDate.toISOString()
  const location = useLocation();
  const queryParams = new URLSearchParams(location.pathname);

  const bookMarkRooms = async () => {
    try {
      const res = await bookMarkHotelRooms(id, hotel_id, room_id, jwt);
      console.log(res.data);
      const message = res.data.message;
      if (message === "Room bookmarked successfully.") {
        setLikedRoom(true);
        toast.success(message);
      } else {
        setLikedRoom(false);
        toast.error(message);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  // const refreshPagehehe = () => {
  //   toast.success("Success message before refreshing the page");
  //   setTimeout(() => {
  //     setRefreshPage(true);
  //   }, 1000); // Adjust the timeout as needed
  // };

  function checkLiked() {
    const isLiked = roomDetails?.bookMarks?.some(
      (liked) => liked.user_id === id
    );
    setLikedRoom(isLiked);
  }

  // console.log(props.roomDetails?.bookedDates);

  useEffect(() => {
    checkLiked();
  }, [props?.roomDetails]);

  const bookRoom = async () => {
    if (id) {
      if (roomDetails?.vendor_id === id) {
        return toast.error("You yourself cannot book on your hotel!");
      }

      navigate(
        `/mainHotel/${hotel_id}/room/${room_id}/bookingProcess?${queryParams.toString()}`
      );
    } else {
      toast.error("Please login to book the room please!");
      // navigate("/login");
    }
  };

  const today = new Date();
  today.setDate(today.getDate() + 1); // Get tomorrow's date

  // Function to format the date
  const formatDate = (dateString) => {
    console.log(dateString);
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const refundPayment = async () => {
    try {
      const res = await refundBookings(refundBookingDetails?.booked_id);
      console.log(res.data);
      toast.success(res.data.message);
      setIsRefundDialogOpen(false);
      props.callBackFetch();
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  const openRefund = (bookingDetail) => {
    console.log(bookingDetail);
    //!Only for show case to let the user know how much will they get after the refund
    const originalAmount = (parseInt(bookingDetail.total_price) * 10) / 100;
    setRefundAmount(
      Math.round(parseInt(bookingDetail.total_price) - originalAmount)
    );
    setRefundBookingDetails(bookingDetail);
    setIsRefundDialogOpen(true);
  };

  console.log(refundAmount);
  const openCancelPending = (bookingDetail) => {
    setCancelBookingDetails(bookingDetail);
    setCancelPendingDialogOpen(true);
  };

  const cancelPending = async () => {
    try {
      const res = await cancelPendingBookings(cancelBookingDetails?.booked_id);
      console.log(res.data);
      toast.success(res.data.message);
      setCancelBookingDetails(null);
      setCancelPendingDialogOpen(false);
      props.callBackFetch();
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  return (
    <div className="px-2 md:px-8 lg:px-16 mb-20">
      <div className="flex flex-col lg:flex-row gap-6 mt-6 w-full">
        <div className="flex flex-col w-full lg:w-[80%] lg:mr-20 gap-10">
          {loading ? (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <MainSkeletonTheme className="">
                  <Skeleton width={300} height={40} />
                  <div className="flex items-center gap-2 mt-2">
                    <Skeleton width={80} height={20} />
                    <Skeleton width={80} height={20} />
                  </div>
                  <div className="flex gap-2 items-center mt-2">
                    <Skeleton width={80} height={20} />
                    <Skeleton width={80} height={20} />
                  </div>
                </MainSkeletonTheme>
                <MainSkeletonTheme className="text-4xl cursor-pointer">
                  <Skeleton circle={true} width={40} height={40} />
                </MainSkeletonTheme>
              </div>

              <Swiper
                slidesPerView={4}
                spaceBetween={5}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                modules={[Pagination, Autoplay]}
                className="w-[65rem]"
              >
                {[1, 2, 3, 4].map((_, index) => (
                  <SwiperSlide key={index}>
                    <MainSkeletonTheme>
                      <div className="flex flex-col gap-2 items-center justify-center  font-semibold bg-gray-200 rounded-lg p-4 pb-4">
                        <Skeleton circle={true} width={60} height={60} />
                        <Skeleton width={100} height={20} />
                      </div>
                    </MainSkeletonTheme>
                  </SwiperSlide>
                ))}
              </Swiper>

              <MainSkeletonTheme className="border-b-2 pb-10">
                <Skeleton width={300} height={40} />
                <MainSkeletonTheme className="tracking-wider mt-2">
                  <Skeleton count={3} />
                </MainSkeletonTheme>
              </MainSkeletonTheme>

              <MainSkeletonTheme className="flex flex-col border-b-2 pb-10">
                <Skeleton width={300} height={40} />
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {[1, 2, 3, 4].map((_, index) => (
                    <div key={index}>
                      <Skeleton width={150} height={20} />
                    </div>
                  ))}
                </div>
              </MainSkeletonTheme>

              <MainSkeletonTheme className="flex flex-col pb-10">
                <Skeleton width={300} height={40} />
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {[1, 2, 3, 4].map((_, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Skeleton width={150} height={20} />
                      <div className="p-2 border rounded-lg">
                        <Skeleton width={80} height={15} />
                      </div>
                    </div>
                  ))}
                </div>
              </MainSkeletonTheme>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div className=" ">
                  <h1 className="text-violet-950 font-bold text-2xl">
                    {roomDetails?.roomType?.type_name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <p>{roomDetails?.room_capacity} guests</p>
                    <p>{roomDetails?.room_beds?.length} beds</p>
                  </div>
                  <p>Floor {roomDetails?.floor}</p>
                  {/* <div className="flex gap-2 items-center">
                    {roomDetails?.room_beds?.map((beds) => (
                      <p>{beds.type_name}</p>
                    ))}
                  </div> */}
                </div>
                <div
                  className="text-4xl cursor-pointer "
                  onClick={bookMarkRooms}
                >
                  <FaHeart
                    className={`${liked ? "text-violet-950" : "text-gray-400"}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6 w-full">
                {roomDetails?.room_beds?.map((beds, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-2 items-center justify-center text-gray-700 font-semibold bg-gray-200 rounded-lg p-4 pb-4 min-w-[100px] w-full"
                  >
                    <BiBed className="text-4xl md:text-5xl" />
                    <p className="text-sm md:text-base">{beds.type_name}</p>
                  </div>
                ))}
              </div>
              <div className="border-b-2 pb-6">
                <h1 className="text-violet-950 font-bold text-2xl pb-2">
                  Room Description:
                </h1>
                <div className="tracking-wider">
                  <p>{roomDetails?.description}</p>
                </div>
              </div>
              <div className="flex flex-col border-b-2 pb-6">
                <h1 className="text-violet-950 font-bold text-2xl pb-2">
                  Amenities of the room:
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {roomDetails?.room_amenities &&
                    roomDetails?.room_amenities?.map((amen, index) => (
                      <div className="" key={index}>
                        <span className="font-semibold flex gap-2 items-center">
                          {amenityIcons[amen]} {amen}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex flex-col pb-6">
                <h1 className="text-violet-950 font-bold text-2xl pb-2">
                  Additional in-room services:
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {roomDetails?.additionalServices &&
                    roomDetails?.additionalServices?.map((services, index) => (
                      <div className="flex gap-2 items-center" key={index}>
                        <span className="font-semibold flex items-center gap-2">
                          {amenityIcons[services.service_name]}
                          {services.service_name}
                        </span>
                        <div className="p-2 border rounded-lg">
                          <p className="text-xs font-semibold">
                            NPR {services.price}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col p-4 shadow-xl w-full lg:max-w-xs rounded-lg border sticky h-fit top-36 mt-8 lg:mt-0">
          {/* <SkeletonTheme>
            <Skeleton width={100}></Skeleton>
          </SkeletonTheme> */}
          <div className="flex items-center gap-2 border-b pb-4">
            <p className="font-bold text-xl">
              NPR{roomDetails?.price_per_night}
            </p>
            <p className="text-sm font-semibold">per night</p>
          </div>

          {/* So how this works is all the booking details of the rooms are fetched and then checked if the requierd logged in user has booked the room or not 
        But only for status booked and pending is check cuz they are only the two different things that can be either canceled or payed so yeah  */}
          {roomDetails?.bookedDates.some((booking) =>
            booking.some(
              (hehe) =>
                hehe.user_id === id &&
                (hehe.status === "booked" || hehe.status === "pending")
            )
          ) ? (
            <div className="flex flex-col gap-4">
              {roomDetails?.bookedDates?.map((bookings) => {
                return bookings.map((booking) => {
                  if (booking.user_id === id) {
                    if (booking.status === "booked") {
                      return (
                        <>
                          <div
                            className="flex flex-col gap-2"
                            key={booking.booked_id}
                          >
                            <p className="text-xl font-semibold">
                              Cancelation policy
                            </p>
                            <Alert
                              variant="outlined"
                              severity="warning"
                              className="mb-1 items-center text-xs"
                            >
                              You have already booked this room. You can cancel
                              the booking until{" "}
                              {formatDate(booking?.bookedDates.check_in_date)}.
                            </Alert>
                            <p className="text-xs font-semibold text-gray-500">
                              If you do not show up at the property, no refund
                              will be provided.
                            </p>
                            <Link
                              to={`/mainHotel/${hotel_id}/specificBookingDetails/${booking.booked_id}`}
                              className="bg-violet-950 text-white font-bold cursor-pointer p-2 rounded-md flex items-center justify-center"
                            >
                              <p className="pl-2">View Booking Details</p>
                            </Link>
                          </div>
                          <div
                            onClick={() => {
                              openRefund(booking);
                            }}
                            className="bg-violet-950 text-white font-bold cursor-pointer p-2 rounded-md flex items-center justify-center"
                          >
                            <p className="pl-2">Cancel Bookings</p>
                          </div>
                          <div
                            onClick={bookRoom}
                            className="bg-violet-950 text-white font-bold cursor-pointer p-2 rounded-md flex items-center justify-center"
                          >
                            <p className="pl-2">New Bookings</p>
                          </div>
                        </>
                      );
                    } else if (booking.status === "pending") {
                      return (
                        <>
                          <div
                            className="flex flex-col gap-2"
                            key={booking.booked_id}
                          >
                            <p className="text-xl font-semibold">
                              Cancelation policy
                            </p>
                            <Alert
                              variant="outlined"
                              severity="warning"
                              className="mb-2 items-center text-xs"
                            >
                              Hurry up! Otherwise, someone else may book this
                              room. You need to either make the payment or
                              cancel the booking for this room. Payment must be
                              completed or booking must be canceled by{" "}
                              {formatDate(booking?.bookedDates?.check_in_date)}.
                            </Alert>
                            <Link
                              to={`/mainHotel/${hotel_id}/specificBookingDetails/${booking.booked_id}`}
                              className="bg-violet-950 text-white font-bold cursor-pointer p-2 rounded-md flex items-center justify-center"
                            >
                              <p className="pl-2">View Booking Details</p>
                            </Link>
                          </div>
                          <div
                            onClick={() => {
                              openCancelPending(booking);
                            }}
                            className="bg-violet-950 text-white font-bold cursor-pointer p-2 rounded-md flex items-center justify-center"
                          >
                            <p className="pl-2">Cancel Bookings</p>
                          </div>
                        </>
                      );
                    }
                  }
                  return null;
                });
              })}
            </div>
          ) : (
            <div
              onClick={bookRoom}
              className="bg-violet-950 text-white font-bold cursor-pointer p-2 rounded-md flex items-center justify-center"
            >
              {successLoader && <CircularProgress color="primary" size={20} />}
              <p className="pl-2">Check Availability</p>
            </div>
          )}
        </div>
        <Dialog
          className="absolute"
          open={refundDialogOpen}
          onClose={() => {
            setIsRefundDialogOpen(false);
            setRefundBookingDetails(null);
          }}
        >
          <div className=" flex max-w-lg flex-col items-center rounded-md border px-8 py-10 text-gray-800 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 rounded-xl bg-red-50 p-2 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <p className="mt-4 text-center text-xl font-bold">
              Do you want to cancel the booking?
            </p>
            <Alert
              variant="outlined"
              severity="warning"
              className="my-2 items-center text-xs"
            >
              The amount you will receive after the refund is NPR {refundAmount}{" "}
              out of NPR {refundBookingDetails?.total_price}.
            </Alert>
            <div className="mt-4 flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
              <button
                className="whitespace-nowrap rounded-md hover:bg-opacity-90 duration-300 bg-violet-950 px-4 py-3 font-medium text-white"
                onClick={refundPayment}
              >
                Yes, cancel the booking
              </button>
              <button
                className="whitespace-nowrap rounded-md bg-gray-200 px-4 py-3 font-medium"
                onClick={() => {
                  setIsRefundDialogOpen(false);
                  setRefundBookingDetails(null);
                }}
              >
                Cancel, keep the booking
              </button>
            </div>
          </div>
        </Dialog>
        <Dialog
          className="absolute"
          open={cancelPendingDialogOpen}
          onClose={() => {
            setCancelBookingDetails(null);
            setCancelPendingDialogOpen(false);
          }}
        >
          <div className=" flex max-w-lg flex-col items-center rounded-md border px-8 py-10 text-gray-800 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 rounded-xl bg-red-50 p-2 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <p className="mt-4 text-center text-xl font-bold">
              Do you want to cancel the booking?
            </p>
            <Alert
              variant="outlined"
              severity="warning"
              className="mb-2 items-center text-xs"
            >
              You haven&apos;t done the payment so you can cancel the bookings
              without any cost.
            </Alert>
            <div className="mt-8 flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
              <button
                className="whitespace-nowrap rounded-md bg-violet-950 px-4 py-3 font-medium text-white"
                onClick={cancelPending}
              >
                Yes, cancel the booking
              </button>
              <button
                className="whitespace-nowrap rounded-md bg-gray-200 px-4 py-3 font-medium"
                onClick={() => {
                  setCancelBookingDetails(null);
                  setCancelPendingDialogOpen(false);
                }}
              >
                Cancel, keep the booking
              </button>
            </div>
          </div>
        </Dialog>
      </div>
      <RoomRecommendations room={roomDetails?.recommendationRoomDetails} />
    </div>
  );
}
