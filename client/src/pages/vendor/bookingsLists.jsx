import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { BsThreeDots } from "react-icons/bs";
import AnimatedProfile from "../../components/animated/animatedProfile";
import { formatCurrentDates } from "../../utils/formatDates";
import {
  bookingDetailsAll,
  bookingSpecificDetails,
  updateBookingDetail,
} from "../../services/vendor/vendor.service";
import { Listbox, Menu, Transition } from "@headlessui/react";
import { MdEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaUpDown } from "react-icons/fa6";
import { RxCross1, RxCross2 } from "react-icons/rx";
import { useFormik } from "formik";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { toast } from "react-toastify";

export default function BookingsLists() {
  const [bookingDetails, setBookingDetails] = useState([]);
  const [specificBookingDetails, setSpecificBookingDetails] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get("page")) || 1;

  const [totalPages, setTotalPages] = useState(1);
  const [totalRooms, setTotalRooms] = useState(0);
  const [totalPending, setTotalPendingRooms] = useState(0);
  const [totalRefunded, setTotalRefundedlRooms] = useState(0);
  const [totalBooked, setTotalBookedRooms] = useState(0);
  const [totalCanceled, setTotalCanceledRooms] = useState(0);
  const [totalSuccess, setTotalSuccessRooms] = useState(0);
  const [totalOngoing, setTotalOngoingRooms] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  //!For opening editors
  const [openItems, setOpenItems] = useState(null); // Track opened items
  const [dialogRoomId, setDialogRoomId] = useState(null); // Track room id for dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogRef = useRef(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const filterTypes = [
    { type: "All" },
    { type: "Oldest" }, // Add Oldest option
    { type: "Newest" }, // Add Newest option
  ];
  const [selected, setSelected] = useState(filterTypes[0]);

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

  const [ongoingRooms, setOngoingRooms] = useState(
    queryParams.get("ongoingBookings") || false
  );

  const [succcessRooms, setSuccessRooms] = useState(
    queryParams.get("successBookings") || false
  );
  const [allDetails, setAllDetails] = useState(false);
  const swiperRef = useRef(null);

  const { hotel_name } = useParams();
  const { jwt } = useSelector((state) => state.user);
  const [allHotelServices, setAllHotelServices] = useState([]);
  const [limit, setLimit] = useState(0);

  //!Will update these only for booking
  const initialValues = {
    booking_id: 0,
    status: "",
    total_price: 0,
    check_in_date: "",
    check_out_date: "",
    additionalServices: [],
  };

  const {
    values,
    handleBlur,
    handleSubmit,
    setFieldValue,
    handleChange,
    touched,
    errors,
    resetForm,
  } = useFormik({
    initialValues: initialValues,
    onSubmit: async () => {
      setIsLoading(true);
      await updateBookingDetails(values);
    },
  });

  const filterBookingsByDate = (bookingDetails, filterOption) => {
    return bookingDetails.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return filterOption === "Oldest" ? dateA - dateB : dateB - dateA;
    });
  };

  useEffect(() => {
    getRooms(page);
    if (
      !queryParams.get("bookedRooms") &&
      !queryParams.get("pendingRooms") &&
      !queryParams.get("refundedRooms") &&
      !queryParams.get("canceledRooms") &&
      !queryParams.get("ongoingBookings") &&
      !queryParams.get("successBookings")
    ) {
      setAllDetails(true);
    }

    const handleClickOutside = (event) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target) &&
        !event.target.closest(".absolute")
      ) {
        setIsDialogOpen(false);
        setIsDeleteDialogOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    page,
    bookedRooms,
    refundedRooms,
    canceledRooms,
    pendingRooms,
    allDetails,
    ongoingRooms,
    succcessRooms,
  ]);

  console.log(bookingDetails);

  const getRooms = async (pageNumber) => {
    let params = {};
    if (bookedRooms) {
      params["bookedRooms"] = true;
      console.log("haha");
    } else if (pendingRooms) {
      params["pendingRooms"] = true;
    } else if (canceledRooms) {
      params["canceledRooms"] = true;
      console.log("hsh");
    } else if (succcessRooms) {
      params["succcessRooms"] = true;
    } else if (refundedRooms) {
      params["refundedRooms"] = true;
    } else if (ongoingRooms) {
      params["ongoingRooms"] = true;
    }

    try {
      // const res = await getAllRooms(hotel_id, pageNumber, params);
      const res = await bookingDetailsAll(hotel_name, pageNumber, params, jwt);

      //!So what i have done is the counts are differntiated at first right so the totalDetails is used as the total counts of the required filtered rooms
      //! Not the paginated one like when i use the paginated one then the total counts will be 2 when the total counts of the list is 4 so
      //! The page wont show another page so the total numbers of required list is set instead of the total numbers of the queried conunts with limits
      const filteredBookings =
        selected.type === "All"
          ? res.data.data.bookingDetails
          : filterBookingsByDate(res.data.data.bookingDetails, selected.type);

      setBookingDetails(filteredBookings);
      setTotalRooms(filteredBookings.length);
      setTotalRooms(res.data.data.total);
      setTotalBookedRooms(res.data.data.allBookedRoomsCount);
      setTotalCanceledRooms(res.data.data.allCanceledRoomsCount);
      setTotalPendingRooms(res.data.data.allPendingRoomsCount);
      setTotalRefundedlRooms(res.data.data.allRefundedRoomsCount);
      setTotalOngoingRooms(res.data.data.allOngoingRoomsCount);
      setTotalSuccessRooms(res.data.data.allSuccessRoomsCount);
      setLimit(res.data.data.limit);
      console.log(res.data.data);
      setTotalPages(
        Math.ceil(res.data.data.totalDetails / res.data.data.limit)
      );
    } catch (e) {
      console.log(e);
    }
  };

  const handlePageChange = (pageNumber) => {
    queryParams.set("page", pageNumber);
    navigate(`/vendor/${hotel_name}/bookingLists?${queryParams.toString()}`);
  };

  //!Function to handle the filtering of the booking Lists
  const handleQuery = (type) => {
    switch (type) {
      case "bookedRooms":
        queryParams.set("bookedRooms", true);
        queryParams.delete("refundedRooms");
        queryParams.delete("pendingRooms");
        queryParams.delete("canceledRooms");
        queryParams.delete("successBookings");
        queryParams.delete("ongoingBookings");
        queryParams.delete("page");
        setBookedRooms(true);
        setRefundedRooms(false);
        setPendingRooms(false);
        setCanceledRooms(false);
        setOngoingRooms(false);
        setSuccessRooms(false);
        setAllDetails(false);
        break;
      case "refundedRooms":
        queryParams.set("refundedRooms", true);
        queryParams.delete("bookedRooms");
        queryParams.delete("pendingRooms");
        queryParams.delete("canceledRooms");
        queryParams.delete("successBookings");
        queryParams.delete("ongoingBookings");
        queryParams.delete("page");

        setRefundedRooms(true);
        setBookedRooms(false);
        setPendingRooms(false);
        setCanceledRooms(false);
        setOngoingRooms(false);
        setSuccessRooms(false);
        setAllDetails(false);
        break;
      case "pendingRooms":
        queryParams.set("pendingRooms", true);
        queryParams.delete("bookedRooms");
        queryParams.delete("refundedRooms");
        queryParams.delete("canceledRooms");
        queryParams.delete("successBookings");
        queryParams.delete("ongoingBookings");
        queryParams.delete("page");

        setPendingRooms(true);
        setRefundedRooms(false);
        setBookedRooms(false);
        setCanceledRooms(false);
        setOngoingRooms(false);
        setSuccessRooms(false);
        setAllDetails(false);
        break;
      case "canceledRooms":
        queryParams.set("canceledRooms", true);
        queryParams.delete("bookedRooms");
        queryParams.delete("refundedRooms");
        queryParams.delete("pendingRooms");
        queryParams.delete("successBookings");
        queryParams.delete("ongoingBookings");
        queryParams.delete("page");

        setCanceledRooms(true);
        setRefundedRooms(false);
        setPendingRooms(false);
        setOngoingRooms(false);
        setSuccessRooms(false);
        setBookedRooms(false);
        setAllDetails(false);
        break;
      case "ongoingBookings":
        queryParams.set("ongoingBookings", true);
        queryParams.delete("bookedRooms");
        queryParams.delete("refundedRooms");
        queryParams.delete("pendingRooms");
        queryParams.delete("successBookings");
        queryParams.delete("canceledRooms");
        queryParams.delete("page");

        setOngoingRooms(true);
        setCanceledRooms(false);
        setRefundedRooms(false);
        setPendingRooms(false);
        setSuccessRooms(false);
        setBookedRooms(false);
        setAllDetails(false);
        break;
      case "successBookings":
        queryParams.set("successBookings", true);
        queryParams.delete("bookedRooms");
        queryParams.delete("refundedRooms");
        queryParams.delete("pendingRooms");
        queryParams.delete("ongoingBookings");
        queryParams.delete("canceledRooms");
        queryParams.delete("page");

        setSuccessRooms(true);
        setOngoingRooms(false);
        setCanceledRooms(false);
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
        queryParams.delete("successBookings");
        queryParams.delete("ongoingBookings");
        queryParams.delete("page");

        setAllDetails(true);
        setOngoingRooms(false);
        setSuccessRooms(false);
        setRefundedRooms(false);
        setPendingRooms(false);
        setCanceledRooms(false);
        setBookedRooms(false);
        break;
      default:
        break;
    }
    navigate(`/vendor/${hotel_name}/bookingLists?${queryParams.toString()}`);
  };

  const getSpecificBookingDetails = async (booking_id) => {
    try {
      const res = await bookingSpecificDetails(hotel_name, booking_id, jwt);
      console.log(res.data);
      setSpecificBookingDetails(res.data.data);
      let bookingDetail = res.data.data;
      setFieldValue("booking_id", bookingDetail.booking_id);
      setFieldValue("check_in_date", bookingDetail.check_in_date);
      setFieldValue("check_out_date", bookingDetail.check_out_date);
      setFieldValue("status", bookingDetail.status);
      setFieldValue("total_price", bookingDetail.total_price);
      setFieldValue("additionalServices", bookingDetail.additionalServices);
      setAllHotelServices(bookingDetail.allServies);
      setDates([
        {
          startDate: new Date(bookingDetail.check_in_date),
          endDate: new Date(bookingDetail.check_out_date),
          key: "selection",
        },
      ]);
    } catch (e) {
      console.log(e);
    }
  };

  const updateBookingDetails = async (form) => {
    try {
      const res = await updateBookingDetail(form, hotel_name, jwt);
      console.log(res.data);
      getRooms(page);
      toast.success(res.data.message);
      setOpenUpdateDialog(false);
      setSpecificBookingDetails(null);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  const calculateTotalPrice = (startDate, endDate) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const diffDays = Math.round(Math.abs((endDate - startDate) / oneDay));

    const roomPrice = specificBookingDetails.room.price;

    const baseTotalPrice = diffDays * roomPrice;
    const additionalServicesPrice = values.additionalServices.reduce(
      (total, service) => total + service.price,
      0
    );

    return baseTotalPrice + additionalServicesPrice;
  };

  const filterBookingNewOld = bookingDetails.filter((book) => {
    const filterNewOld = book.createdAt;
    return;
  });

  return (
    <div className="px-8 flex flex-col w-full ">
      <div className="font-semibold text-xl mt-2">
        <p>Bookings</p>
      </div>
      <div className="flex justify-between border-b">
        <div className="flex gap-6 items-center font-semibold w-fit pt-2 rounded-xl  ">
          <div
            className={`pb-2 text-gray-600 text-sm ${
              allDetails && " border-b-2  border-b-violet-950 text-violet-950"
            }  `}
            onClick={() => handleQuery("allDetails")}
          >
            <p className="cursor-pointer"> All Bookings ({totalRooms})</p>
          </div>
          <div
            className={`pb-2 text-gray-600 text-sm  ${
              bookedRooms && "border-b-2  border-b-violet-950 text-violet-950 "
            }  `}
            onClick={() => handleQuery("bookedRooms")}
          >
            <p className="cursor-pointer">Booked Bookings ({totalBooked})</p>
          </div>
          <div
            className={`pb-2 text-gray-600 text-sm  ${
              ongoingRooms && "border-b-2  border-b-violet-950 text-violet-950 "
            }  `}
            onClick={() => handleQuery("ongoingBookings")}
          >
            <p className="cursor-pointer">Ongoing Bookings ({totalOngoing})</p>
          </div>
          <div
            className={`pb-2 text-gray-600 text-sm  ${
              succcessRooms &&
              "border-b-2  border-b-violet-950 text-violet-950 "
            }  `}
            onClick={() => handleQuery("successBookings")}
          >
            <p className="cursor-pointer">Success Bookings ({totalSuccess})</p>
          </div>
          <div
            className={`pb-2 text-gray-600 text-sm  ${
              refundedRooms && "border-b-2  border-b-violet-950 text-violet-950"
            }  `}
            onClick={() => handleQuery("refundedRooms")}
          >
            <p className="cursor-pointer">
              Refunded Bookings ({totalRefunded})
            </p>
          </div>
          <div
            className={`pb-2 text-gray-600 text-sm  ${
              canceledRooms && "border-b-2  border-b-violet-950 text-violet-950"
            }  `}
            onClick={() => handleQuery("canceledRooms")}
          >
            <p className="cursor-pointer">
              Canceled Bookings ({totalCanceled})
            </p>
          </div>
          <div
            className={`pb-2 text-gray-600 text-sm   
          ${
            pendingRooms && "border-b-2  border-b-violet-950 text-violet-950 "
          }  `}
            onClick={() => handleQuery("pendingRooms")}
          >
            <p className="cursor-pointer">Pending Bookings ({totalPending})</p>
          </div>
        </div>
        <div className="">
          <Listbox
            value={selected}
            onChange={(value) => {
              const filteredBookings = filterBookingsByDate(
                bookingDetails,
                value.type
              );
              setBookingDetails(filteredBookings);
              setSelected(value);
            }}
          >
            <div className="relative mt-1 z-30 w-[10rem]">
              <Listbox.Button className="relative w-full  rounded-lg bg-white py-2 pl-3 pr-10 text-left border cursor-pointer focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate text-center">
                  {selected.type}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <FaUpDown
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-white py-1 text-base  ring-1 ring-black/5 focus:outline-none sm:text-sm">
                  {filterTypes.map((type, index) => (
                    <Listbox.Option
                      key={index}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? "bg-amber-100 text-amber-900"
                            : "text-gray-900"
                        }`
                      }
                      value={type}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {type.type}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>
      <div className="h-[520px] mt-4 overflow-auto border bg-white rounded-t-lg custom-scrollbar">
        <table className="w-full">
          <thead className=" z-20 sticky font-semibold top-0 border-b bg-gray-100 h-[3rem] text-sm ">
            <tr>
              <th className="px-4 py-4 font-semibold">Booking ID </th>
              <th className="px-4 py-4 font-semibold ">Guest </th>
              <th className="px-4 py-4 font-semibold ">Room.no</th>
              <th className="px-4 py-4 font-semibold ">Ordered Date</th>
              <th className="px-4 py-4 font-semibold ">Check-in</th>
              <th className="px-4 py-4 font-semibold ">Check-out</th>
              <th className="px-4 py-4 font-semibold ">Room Type</th>
              <th className="px-4 py-4 font-semibold ">Price</th>
              <th className="px-4 py-4 font-semibold ">Status</th>
              <th className="px-4 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="">
            {bookingDetails &&
              bookingDetails?.map((book, index) => (
                <tr
                  key={book.booking_id}
                  className="border-b text-xs h-[4rem]  font-semibold text-gray-600  "
                >
                  <td className="px-4 py-2 w-[8rem] h-[4rem]">
                    <p className="text-center">#{book.booking_id}</p>
                  </td>
                  <td className="px-14 py-2 w-[10rem] h-[4rem] ">
                    <div
                      className=""
                      onClick={() =>
                        navigate(
                          `/vendor/${hotel_name}/guestsLists/guestDetails/${book?.user?.user_id}`
                        )
                      }
                    >
                      <AnimatedProfile details={book?.user} />
                    </div>
                  </td>
                  <td className="px-4 py-2 w-[8rem] h-[4rem]">
                    <p className="text-center">{book.room.room_no}</p>
                  </td>
                  <td className="px-4 py-2 w-[10rem] h-[4rem]">
                    <p className="text-center">
                      {formatCurrentDates(book.createdAt)}
                    </p>
                  </td>
                  <td className="px-4 py-2 w-[10rem] h-[4rem]">
                    <div className="flex flex-wrap gap-1 justify-center">
                      <p className="text-center">
                        {formatCurrentDates(book.check_in_date)}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-2 w-[10rem] h-[4rem]">
                    <p className="text-center">
                      {formatCurrentDates(book.check_out_date)}
                    </p>
                  </td>
                  <td className="px-4 py-2 h-[4rem]">
                    <p className="text-center">{book.room.room_type}</p>
                  </td>
                  <td className="px-4 py-2 h-[4rem]">
                    <p className="text-center">NPR {book.total_price}</p>
                  </td>
                  <td className="px-4 py-2 h-[4rem]">
                    {book?.status == "booked" ? (
                      <p className="text-center text-green-400"> Booked</p>
                    ) : book?.status == "refund" ? (
                      <p className="text-center text-red-400">Refund </p>
                    ) : book?.status == "canceled" ? (
                      <p className="text-center text-gray-400">Canceled </p>
                    ) : book?.status == "pending" ? (
                      <p className="text-center text-yellow-400">Pending </p>
                    ) : book?.status == "ongoing" ? (
                      <p className="text-center text-yellow-400">Ongoing </p>
                    ) : (
                      <p className="text-center text-green-400">Success </p>
                    )}
                  </td>
                  <td className="px-2 flex flex-col items-center relative h-[70px] justify-center">
                    <Menu>
                      <Menu.Button className=" p-2 rounded-full hover:bg-gray-200 duration-300">
                        <BsThreeDots
                          className="rounded-xl text-2xl font-bold cursor-pointer "
                          // onClick={() => handleOpenItems(index)}
                        />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 -top-12 z-50  mt-2 w-36 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none ">
                          <div className="px-1 py-1 cursor-pointer ">
                            <Menu.Item>
                              {({ active }) => (
                                <div
                                  onClick={() => {
                                    getSpecificBookingDetails(book.booking_id);
                                    setOpenUpdateDialog(true);
                                  }}
                                  className={`${
                                    active
                                      ? "bg-gray-100 text-black"
                                      : "text-black"
                                  } group flex gap-2  w-full items-center rounded-md px-2 py-2 text-sm`}
                                  // to={`/vendor/${hotel_name}/roomLists/room/${room.room_id}/editRoom`}
                                >
                                  <MdEdit />
                                  Edit
                                </div>
                              )}
                            </Menu.Item>

                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  className={`${
                                    active
                                      ? "bg-gray-100 text-black"
                                      : "text-black"
                                  } group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm`}
                                  to={`/vendor/${hotel_name}/bookingLists/${book.booking_id}`}
                                >
                                  <FaEye className="" />
                                  View Details
                                </Link>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                    <Dialog
                      open={openUpdateDialog}
                      onClose={() => {
                        setOpenUpdateDialog(false);
                        setSpecificBookingDetails(null);
                      }}
                      maxWidth="lg"
                    >
                      <DialogContent className=" w-[45rem] ">
                        <div className="flex justify-between items-center">
                          <h1 className="text-2xl font-semibold flex gap-2">
                            Edit Booking number
                            <p># {specificBookingDetails?.booking_id}</p>
                          </h1>
                          <RxCross2
                            className="text-2xl cursor-pointer"
                            onClick={() => {
                              setOpenUpdateDialog(false);
                              setSpecificBookingDetails(null);
                            }}
                          />
                        </div>
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-2 ">
                            <label className="font-semibold">Edit Date:</label>
                            <DateRange
                              ranges={dates}
                              onChange={(item) => {
                                setDates([item.selection]);
                                const totalPrice = calculateTotalPrice(
                                  item.selection.startDate,
                                  item.selection.endDate
                                );
                                setFieldValue("total_price", totalPrice);
                                setFieldValue(
                                  "check_in_date",
                                  item.selection.startDate.toISOString()
                                );
                                setFieldValue(
                                  "check_out_date",
                                  item.selection.endDate.toISOString()
                                );
                              }}
                              className="rounded-lg border-2"
                            />
                            <TextField
                              className="cursor-not-allowed"
                              id="standard-basic"
                              label="Total Price"
                              variant="standard"
                              name="total_price"
                              disabled={true}
                              value={values.total_price}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {touched.total_price && errors.total_price && (
                              <p className="text-red-400">
                                {errors.total_price}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-10">
                            <div>
                              <FormControl variant="standard">
                                <InputLabel id="status-label">
                                  Status
                                </InputLabel>
                                <Select
                                  labelId="status-label"
                                  id="status-select"
                                  value={values.status}
                                  onChange={(e) =>
                                    setFieldValue("status", e.target.value)
                                  }
                                  label="Status"
                                >
                                  <MenuItem value="booked">Booked</MenuItem>
                                  <MenuItem value="refund">Refund</MenuItem>
                                  <MenuItem value="canceled">Canceled</MenuItem>
                                  <MenuItem value="pending">Pending</MenuItem>
                                  <MenuItem value="ongoing">Ongoing</MenuItem>
                                  <MenuItem value="success">Success</MenuItem>
                                </Select>
                              </FormControl>
                            </div>
                            <div className="p-2 border-2 flex flex-col rounded-lg">
                              <p className="font-semibold">
                                Additional Services:
                              </p>
                              {allHotelServices?.map((service) => (
                                <FormControlLabel
                                  key={service.additional_services_id}
                                  control={
                                    <Checkbox
                                      checked={values.additionalServices.some(
                                        (selectedService) =>
                                          selectedService.additional_services_id ===
                                          service.additional_services_id
                                      )}
                                      onChange={(event) => {
                                        const isChecked = event.target.checked;
                                        if (isChecked) {
                                          setFieldValue(
                                            "total_price",
                                            parseInt(values.total_price) +
                                              service.price
                                          );
                                          setFieldValue("additionalServices", [
                                            ...values.additionalServices,
                                            service,
                                          ]);
                                        } else {
                                          setFieldValue(
                                            "total_price",
                                            parseInt(values.total_price) -
                                              service.price
                                          );
                                          setFieldValue(
                                            "additionalServices",
                                            values.additionalServices.filter(
                                              (selectedService) =>
                                                selectedService.additional_services_id !==
                                                service.additional_services_id
                                            )
                                          );
                                        }
                                      }}
                                    />
                                  }
                                  label={`${service.service_name} - NPR ${service.price}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                      <DialogActions>
                        <div className="flex justify-end text-sm font-semibold gap-4">
                          <button
                            className={`p-3 rounded-3xl pl-7 pr-7 hover:bg-neutral-100 text-black flex items-center gap-2 duration-300   ${
                              isLoading && "cursor-not-allowed"
                            }`}
                            type="button"
                            disabled={isLoading}
                            onClick={() => {
                              setOpenUpdateDialog(false);
                              setSpecificBookingDetails(null);
                            }}
                          >
                            <RxCross1 className="font-bold" />
                            <p>Cancel</p>
                          </button>
                          <button
                            onClick={handleSubmit}
                            className={`p-3 rounded-3xl pl-7 pr-7 flex gap-2 text-white bg-violet-950 duration-300  ${
                              isLoading
                                ? "cursor-not-allowed opacity-80"
                                : " hover:bg-violet-900 "
                            }`}
                            disabled={isLoading}
                          >
                            {isLoading && (
                              <CircularProgress color="primary" size={20} />
                            )}
                            <p>Edit</p>
                          </button>
                        </div>
                        {/* <button onClick={handleSubmit}>Edit</button>
                        <button
                          onClick={() => {
                            setOpenUpdateDialog(false);
                            setSpecificBookingDetails(null);
                          }}
                        >
                          Cancel
                        </button> */}
                      </DialogActions>
                    </Dialog>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mb-2 border-b border-r border-l bg-gray-100 rounded-b-lg items-center ">
        {/* <p className="text-xs tracking-wide font-semibold pl-4">
          Showing: {(page - 1) * limit + 1} -{" "}
          {Math.min(page * limit, totalRooms)} of {totalRooms}
        </p> */}
        <Stack spacing={2} className="p-2">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => handlePageChange(value)}
            variant="outlined"
            className=""
            size="medium"
          />
        </Stack>
      </div>
    </div>
  );
}
