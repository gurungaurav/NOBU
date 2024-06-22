import { useNavigate, useParams } from "react-router-dom";
import billie from "../../assets/Nobu-Logo-2.png";
import bill from "../../assets/bill.png";
import { bookingSpecificDetails } from "../../services/vendor/vendor.service";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { formatCurrentDates } from "../../utils/formatDates";
import { getBookingDetails } from "../../services/hotels/hotels.service";
import { RxCross1 } from "react-icons/rx";

export default function SpecificBookingDetailsClient() {
  const { booking_id } = useParams();

  // const { jwt } = useSelector((state) => state.user);

  console.log(booking_id);
  const [bookingDetails, setBookingDetails] = useState({});
  const [refundeOldAmount, setRefundedOldAmount] = useState(null);

  const getBookingDetail = async () => {
    try {
      const res = await getBookingDetails(booking_id);
      console.log(res.data);
      setBookingDetails(res.data.data);
      let details = res.data.data;
      if (details.status === "refund") {
        const originalAmount = (parseInt(details.total_price) * 20) / 100;
        setRefundedOldAmount(
          Math.round(parseInt(details.total_price) + originalAmount)
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getBookingDetail();
  }, []);

  const queryParams = new URLSearchParams();
  const navigate = useNavigate();
  //!Function for handling the pending like for continuing the payment
  const handlePendingPayment = (booking, hotel_id, room_id) => {
    queryParams.set("booking_id", booking.booking_id);
    queryParams.set("price", booking.total_price);
    queryParams.set("check_in", booking.check_in_date);
    queryParams.set("check_out", booking.check_out_date);
    const queryString = queryParams.toString();
    console.log(queryString);
    navigate(
      `/mainHotel/${hotel_id}/room/${room_id}/bookingProcess?${queryString}`
    );
  };

  const navigateReturn = () => {
    navigate("/userHistory");
  };

  return (
    <div className="flex flex-col w-full items-center justify-center h-full pt-10 pb-10">
      <div className="bg-blue-50 w-[50rem] shadow-md pb-10 rounded-lg ">
        <div className=" flex flex-col ">
          <div className="bg-violet-950 flex py-4 rounded-t-lg flex-col items-center justify-center text-white">
            <p className=" justify-end  flex w-full text-2xl pr-4 ">
              <RxCross1 className="cursor-pointer" onClick={navigateReturn} />
            </p>
            <img src={billie} className="w-14 h-14 "></img>
            <h1 className="text-3xl font-serif">
              {bookingDetails?.hotel?.hotel_name}
            </h1>
          </div>
        </div>
        <div className=" flex flex-col gap-6 items-center justify-center">
          <div className="p-2 border-b-2 border-b-black w-[15rem] text-sm text-center font-semibold">
            <p>BOOKING DETAILS</p>
          </div>
          <div className="w-[40rem] h-[15rem]">
            <img
              src={bookingDetails?.room?.room_picture}
              className="w-full h-full object-cover"
            ></img>
          </div>
          <div className="flex w-full  justify-center items-center ">
            <div className="flex flex-col gap-1 w-[30rem] justify-center text-gray-500  text-sm font-semibold">
              <div className="flex w-full ">
                <div className="flex w-full  justify-between">
                  <p className="">NAME</p>
                  <p className="text-gray-500">
                    {bookingDetails?.user?.user_name}
                  </p>
                </div>
              </div>
              <div className="flex ">
                <div className="flex w-full justify-between">
                  <p>CHECK - IN</p>
                  <p className="text-gray-500">
                    {bookingDetails?.check_in_date &&
                      formatCurrentDates(bookingDetails?.check_in_date)}
                  </p>
                </div>
              </div>
              <div className="flex ">
                <div className="flex w-full justify-between">
                  <p>CHECK - OUT</p>
                  <p className="text-gray-500">
                    {bookingDetails?.check_out_date &&
                      formatCurrentDates(bookingDetails?.check_out_date)}
                  </p>
                </div>
              </div>
              <div className="flex ">
                <div className="flex w-full justify-between">
                  <p>ROOM</p>
                  <p className="text-gray-500">
                    {bookingDetails?.room?.room_type}
                  </p>
                </div>
              </div>
              <div className="flex ">
                <div className="flex w-full justify-between">
                  <p>GUESTS</p>
                  <p className="text-gray-500">
                    {bookingDetails?.room?.room_capacity}
                  </p>
                </div>
              </div>
              <div className="flex ">
                <div className="flex w-full justify-between">
                  <p>HOTEL NAME</p>
                  <p className="text-gray-500">
                    {bookingDetails?.hotel?.hotel_name}
                  </p>
                </div>
              </div>
              <div className="flex ">
                <div className="flex w-full justify-between">
                  <p>LOCATION</p>
                  <p className="text-gray-500">
                    {bookingDetails?.hotel?.location}
                  </p>
                </div>
              </div>
              {bookingDetails?.status === "refund" && (
                <div className="flex ">
                  <div className="flex w-full justify-between">
                    <p>REFUNDED AMOUNT</p>
                    <p className="text-gray-500">NPR {refundeOldAmount}</p>
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <p className="text-lg font-semibold border-b-2">
                  Additional Services
                </p>
                {bookingDetails?.additionalServices?.length > 0 ? (
                  bookingDetails.additionalServices.map((service) => (
                    <div
                      key={service.additional_services_id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex gap-2 items-center ">
                        <strong>{service.service_name}:</strong>
                      </div>
                      <p className="ml-2">{service.price}</p>
                    </div>
                  ))
                ) : (
                  <p>No additonal services added</p>
                )}
              </div>
              <div className="flex ">
                <div className="flex w-full justify-between">
                  <p> STATUS</p>
                  <p className="text-gray-500">{bookingDetails?.status}</p>
                </div>
              </div>
              <div className="flex ">
                <div className="flex w-full justify-between">
                  <p>TOTAL</p>
                  <p className="text-gray-500">
                    NPR{bookingDetails?.total_price}
                  </p>
                </div>
              </div>
              {bookingDetails?.status === "pending" && (
                <div>
                  <div
                    className="p-2 bg-violet-950 h-fit text-center mt-6 text-white text-sm font-semibold rounded-md cursor-pointer"
                    onClick={() =>
                      handlePendingPayment(
                        bookingDetails,
                        bookingDetails.hotel.hotel_id,
                        bookingDetails.room.room_id
                      )
                    }
                  >
                    <p>Proceed to Payment</p>
                  </div>
                </div>
              )}
              {bookingDetails?.status === "booked" && (
                <div>
                  <div
                    className="p-2 bg-violet-950 h-fit text-center mt-6 text-white text-sm font-semibold rounded-md cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/mainHotel/${bookingDetails.hotel.hotel_id}/room/${bookingDetails.room.room_id}`
                      )
                    }
                  >
                    <p>Proceed to Room</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
