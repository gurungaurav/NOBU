import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import GuestsProfile from "../../features/vendor/guests/guestsProfile";
import GuestsCurrentBooking from "../../features/vendor/guests/guestsCurrentBooking";
import { BsThreeDots } from "react-icons/bs";
import { Menu, Pagination, Stack } from "@mui/material";
import bill from "../../assets/bill.png";
import { getSpecificGuestsDetails } from "../../services/vendor/vendor.service";
import { useSelector } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import { formatCurrentDates } from "../../utils/formatDates";
import { Transition } from "@headlessui/react";
import { MdEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa6";

export default function GuestDetails() {
  const { hotel_name, user_id } = useParams();
  const { jwt } = useSelector((state) => state.user);
  const [userDetails, setUserDetails] = useState({});
  const [is404, setIs404] = useState(false);
  const [latestBookingDetails, setLatestBookingDetails] = useState(0);
  const [totalRooms, setTotalRooms] = useState(0);
  const [totalPending, setTotalPendingRooms] = useState(0);
  const [totalRefunded, setTotalRefundedlRooms] = useState(0);
  const [totalBooked, setTotalBookedRooms] = useState(0);
  const [totalCanceled, setTotalCanceledRooms] = useState(0);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [bookedRooms, setBookedRooms] = useState(
    queryParams.get("bookedRooms") || false
  );
  const [pendingRooms, setPendingRooms] = useState(
    queryParams.get("pendingRooms") || false
  );
  const [refundedRooms, setRefundedRooms] = useState(
    queryParams.get("refundedRooms") || false
  );

  const [canceledRooms, setCanceledRooms] = useState(
    queryParams.get("canceledRooms") || false
  );

  const [allDetails, setAllDetails] = useState(false);

  const navigate = useNavigate();

  const page = parseInt(queryParams.get("page")) || 1;
  const [totalPages, setTotalPages] = useState(1);

  const handlePageChange = (pageNumber) => {
    queryParams.set("page", pageNumber);
    navigate(
      `/vendor/${hotel_name}/guestsLists/guestDetails/${user_id}?${queryParams.toString()}`
    );
  };
  let params;
  //TODO: Need to handle the errors by their status like when the user is not found then no user found should be displayed
  const guestDetail = async (pageNumber) => {
    let params = {};
    if (bookedRooms) {
      params["bookedRooms"] = true;
      console.log("haha");
    } else if (pendingRooms) {
      params["pendingRooms"] = true;
    } else if (canceledRooms) {
      params["canceledRooms"] = true;
      console.log("hsh");
    } else if (refundedRooms) {
      params["refundedRooms"] = true;
    }

    try {
      const res = await getSpecificGuestsDetails(
        hotel_name,
        user_id,
        pageNumber,
        params,
        jwt
      );
      console.log(res.data.data);
      setUserDetails(res.data.data);
      setTotalRooms(res.data.data.totalBookings);
      setLatestBookingDetails(res?.data?.data?.guestLastestBookingDetails);
      setTotalBookedRooms(res.data.data.bookingCounts.allBookedRoomsCount);
      setTotalCanceledRooms(res.data.data.bookingCounts.allCanceledRoomsCount);
      setTotalPendingRooms(res.data.data.bookingCounts.allPendingRoomsCount);
      setTotalRefundedlRooms(res.data.data.bookingCounts.allRefundedRoomsCount);
      setTotalPages(
        Math.ceil(res.data.data.totalQueryCounts / res.data.data.limit)
      );
    } catch (e) {
      console.log(e);
      if (e.response) {
        // navigate(-1);
        setIs404(true);
      }
    }
  };

  useEffect(() => {
    guestDetail(page);
    if (
      !queryParams.get("bookedRooms") &&
      !queryParams.get("pendingRooms") &&
      !queryParams.get("refundedRooms") &&
      !queryParams.get("canceledRooms")
    ) {
      setAllDetails(true);
    }
  }, [
    page,
    bookedRooms,
    refundedRooms,
    canceledRooms,
    pendingRooms,
    allDetails,
  ]);

  const handleQuery = (type) => {
    switch (type) {
      case "bookedRooms":
        queryParams.set("bookedRooms", true);
        queryParams.delete("refundedRooms");
        queryParams.delete("pendingRooms");
        queryParams.delete("canceledRooms");
        queryParams.delete("page");
        setBookedRooms(true);
        setRefundedRooms(false);
        setPendingRooms(false);
        setCanceledRooms(false);
        setAllDetails(false);
        break;
      case "refundedRooms":
        queryParams.set("refundedRooms", true);
        queryParams.delete("bookedRooms");
        queryParams.delete("pendingRooms");
        queryParams.delete("canceledRooms");
        queryParams.delete("page");

        setRefundedRooms(true);
        setBookedRooms(false);
        setPendingRooms(false);
        setCanceledRooms(false);
        setAllDetails(false);
        break;
      case "pendingRooms":
        queryParams.set("pendingRooms", true);
        queryParams.delete("bookedRooms");
        queryParams.delete("refundedRooms");
        queryParams.delete("canceledRooms");
        queryParams.delete("page");

        setPendingRooms(true);
        setRefundedRooms(false);
        setBookedRooms(false);
        setCanceledRooms(false);
        setAllDetails(false);
        break;
      case "canceledRooms":
        queryParams.set("canceledRooms", true);
        queryParams.delete("bookedRooms");
        queryParams.delete("refundedRooms");
        queryParams.delete("pendingRooms");
        queryParams.delete("page");

        setCanceledRooms(true);
        setRefundedRooms(false);
        setPendingRooms(false);
        setBookedRooms(false);
        setAllDetails(false);
        break;
      case "allDetails":
        queryParams.delete("bookedRooms");
        queryParams.delete("refundedRooms");
        queryParams.delete("pendingRooms");
        queryParams.delete("canceledRooms");
        queryParams.delete("page");

        setAllDetails(true);
        setRefundedRooms(false);
        setPendingRooms(false);
        setCanceledRooms(false);
        setBookedRooms(false);
        break;
      default:
        break;
    }
    navigate(
      `/vendor/${hotel_name}/guestsLists/guestDetails/${user_id}?${queryParams.toString()}`
    );
  };

  return (
    <>
      {!is404 ? (
        <div className="px-8 pt-2">
          <div className="flex items-center gap-1 font-semibold mb-2">
            <Link
              to={`/vendor/${hotel_name}/guestsLists`}
              className="p-2 hover:bg-gray-200 rounded-lg "
            >
              <p className="">Guest</p>
            </Link>
            <span>/</span>
            <p className="p-2 hover:bg-gray-200 rounded-lg">
              {userDetails?.userDetails?.user_name}
            </p>
          </div>
          <div className="flex gap-6">
            <div className=" bg-white p-4 w-[18rem] rounded-lg shadow-md">
              <GuestsProfile userDetails={userDetails?.userDetails} />
            </div>
            <div className="bg-white p-6 w-full rounded-lg shadow-md">
              <p className=" font-semibold">Current Booking</p>
              <GuestsCurrentBooking
                latestBookingDetails={latestBookingDetails}
              />
            </div>
          </div>
          <div className=" bg-white rounded-lg mt-8 border">
            <div className="font-bold text-2xl px-10 py-7">
              <p>Booking History</p>
            </div>
            <div className="flex gap-6 items-center font-semibold  w-fit pt-2 px-3 ">
              <div
                className={`pb-3 ${
                  allDetails && " border-b-2  border-b-violet-950 "
                }  `}
                onClick={() => handleQuery("allDetails")}
              >
                <p className="cursor-pointer"> All bookings ({totalRooms})</p>
              </div>
              <div
                className={`pb-3 ${
                  bookedRooms && "border-b-2  border-b-violet-950 "
                }  `}
                onClick={() => handleQuery("bookedRooms")}
              >
                <p className="cursor-pointer">Booked rooms ({totalBooked})</p>
              </div>
              <div
                className={`pb-3 ${
                  refundedRooms && "border-b-2  border-b-violet-950 "
                }  `}
                onClick={() => handleQuery("refundedRooms")}
              >
                <p className="cursor-pointer">
                  Refunded rooms ({totalRefunded})
                </p>
              </div>
              <div
                className={`pb-3 ${
                  canceledRooms && "border-b-2  border-b-violet-950 "
                }  `}
                onClick={() => handleQuery("canceledRooms")}
              >
                <p className="cursor-pointer">
                  Canceled rooms ({totalCanceled})
                </p>
              </div>
              <div
                className={`pb-3 
          ${pendingRooms && "border-b-2  border-b-violet-950 "}  `}
                onClick={() => handleQuery("pendingRooms")}
              >
                <p className="cursor-pointer">Pending rooms ({totalPending})</p>
              </div>
            </div>

            <div className="h-[420px] overflow-auto  bg-white rounded-lg custom-scrollbar border-t-2 ">
              <table className="w-full">
                <thead className="border-b-2 z-40 sticky top-0 bg-white shadow-sm">
                  <tr>
                    <th className="px-4 py-2">Room </th>
                    <th className=" py-2">Room Number</th>
                    <th className="px-4 py-2">Ordered Date</th>
                    <th className="px-4 py-2">Check-in</th>
                    <th className="px-4 py-2">Check-out</th>
                    <th className="px-4 py-2">Room Type</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="">
                  {userDetails?.bookingDetails?.map((book, index) => (
                    <tr
                      key={index}
                      className="border-b-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 cursor-pointer"
                    >
                      <td className="px-4 py-2">
                        {/* <AnimatedProfile details={book.user} /> */}
                        <div className="w-[12rem] h-[6rem]">
                          <img
                            className=" w-full h-full object-cover rounded-lg"
                            src={book?.room?.room_pictures[0]?.room_picture}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 w-[8rem]">
                        <p className="text-center"># {book?.room?.room_id}</p>
                      </td>
                      <td className="px-4 py-2 w-[10rem]">
                        <p className="text-center">
                          {formatCurrentDates(book?.createdAt)}
                        </p>
                      </td>
                      <td className="px-4 py-2 w-[10rem]">
                        <div className="flex flex-wrap gap-1 justify-center">
                          <p className="text-center">
                            {formatCurrentDates(book?.check_in_date)}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-2 w-[10rem]">
                        <p className="text-center">
                          {formatCurrentDates(book?.check_out_date)}
                        </p>
                      </td>
                      <td className="px-4 py-2 ">
                        <p className="text-center">{book?.room?.room_type}</p>
                      </td>
                      <td className="px-4 py-2 w-[8rem]">
                        <p className="text-center">NPR{book?.total_price}</p>
                      </td>
                      <td className="px-4 py-2 w-[8rem]">
                        {book?.status == "booked" ? (
                          <p className="text-center text-green-400"> Booked</p>
                        ) : book?.status == "refund" ? (
                          <p className="text-center text-red-400">Refund </p>
                        ) : book?.status == "canceled" ? (
                          <p className="text-center text-gray-400">Canceled </p>
                        ) : (
                          <p className="text-center text-yellow-400">
                            Pending{" "}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-end mr-2 my-6">
            <Stack spacing={2} className="">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => handlePageChange(value)}
                variant="outlined"
                shape="rounded"
                className=""
                size="large"
              />
            </Stack>
          </div>
        </div>
      ) : (
        <p>No user found</p>
      )}
    </>
  );
}
