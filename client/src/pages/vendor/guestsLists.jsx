import React, { Fragment, useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getGuestsDetailsAPI } from "../../services/vendor/vendor.service";
import { useSelector } from "react-redux";
import { Pagination, Stack } from "@mui/material";
import { Menu, Transition } from "@headlessui/react";
import { MdDelete, MdEdit } from "react-icons/md";
import { FcViewDetails } from "react-icons/fc";
import { formatDate } from "../../utils/formatDates";
import AnimatedProfile from "../../components/animated/animatedProfile";

export default function GuestsLists() {
  const [guests, setGuests] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get("page")) || 1;
  const [totalGuests, setTotalGuests] = useState(1);
  const [searchName, setSearchName] = useState("");
  //!For opening editors
  const [openItems, setOpenItems] = useState(null); // Track opened items
  const [dialogRoomId, setDialogRoomId] = useState(null); // Track room id for dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogRef = useRef(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(0);

  const { hotel_name } = useParams();
  const { jwt } = useSelector((state) => state.user);

  useEffect(() => {
    getGuests(page);
    // const swiperContainer = swiperRef.current;
    // const params = {
    //   navigation: true,
    //   pagination: true,
    // };

    // Object.assign(swiperContainer, params);
    // swiperContainer.initialize();

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
  }, [page, searchName]);

  const getGuests = async (pageNumber) => {
    try {
      const res = await getGuestsDetailsAPI(
        hotel_name,
        pageNumber,
        searchName,
        jwt
      );
      setGuests(res.data.data.user);
      console.log(res.data.data);
      setLimit(res.data.data.limit);
      setTotalPages(Math.ceil(res.data.data.total / res.data.data.limit));
    } catch (e) {
      console.log(e);
    }
  };

  const handleOpenItems = (index) => {
    console.log(index);
    // setOpenItems(index === openItems ? null : index);
    setDialogRoomId(index === index ? guests[index].user_id : null);
    setIsDialogOpen(index === openItems ? !isDialogOpen : true);
  };

  const handlePageChange = (pageNumber) => {
    queryParams.set("page", pageNumber);
    navigate(`/vendor/${hotel_name}/guestsLists?${queryParams.toString()}`);
  };

  return (
    <div className="px-8 flex flex-col w-full ">
      <div className="font-semibold text-xl mt-2 mb-2">
        <p>Customer's List</p>
      </div>
      <div className="flex gap-6 items-center font-semibold  w-fit text-gray-500 text-sm ">
        <div className={` `}>
          <p className="">You have total {guests?.length} customers</p>
        </div>
      </div>
      <div class="relative w-[30rem] border flex items-center justify-between rounded-full mt-2 mb-4">
        <svg
          class="absolute left-2 block h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" class=""></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65" class=""></line>
        </svg>
        <input
          type="name"
          name="search"
          onChange={(e) => setSearchName(e.target.value)}
          class="h-10 w-full cursor-text rounded-full border bg-slate-200 py-2 pr-40 pl-12  outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          placeholder="Search by name"
        />
      </div>
      <div className="h-[520px]  overflow-auto border bg-white rounded-t-lg custom-scrollbar">
        <table className="w-full">
          <thead className=" z-30 sticky font-semibold top-0 border-b bg-gray-100 h-[3rem] text-sm ">
            <tr>
              <th className="px-4 py-4 font-semibold ">Guest </th>
              <th className="px-4 py-4 font-semibold">Phone Number</th>
              <th className="px-4 py-4 font-semibold">Email</th>
              <th className="px-4 py-4 font-semibold">No.of bookings</th>
              <th className="px-4 py-4 font-semibold">Verified</th>
              <th className="px-4 py-4 font-semibold">Last Check out</th>
              <th className="px-4 py-4 font-semibold">Last Check out</th>
              <th className="px-4 py-4 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {guests?.length > 0 ? (
              guests?.map((guest, index) => (
                <tr
                  key={guest.user_id}
                  className="border-b text-xs font-semibold text-gray-500"
                >
                  <td className="px-14 py-2 w-[10rem] h-[4rem] ">
                    <div
                      className="flex items-center gap-3"
                      onClick={() =>
                        navigate(
                          `/vendor/${hotel_name}/guestsLists/guestDetails/${guest?.user_id}`
                        )
                      }
                    >
                      <AnimatedProfile details={guest} />
                      <p>{guest?.user_name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2 w-[9rem] text-center h-[4rem]">
                    {guest?.phone_number}
                  </td>
                  <td className="px-4 py-2 w-[15rem] text-center h-[4rem]">
                    {guest.email}
                  </td>
                  <td className="px-4 py-2 w-[9rem]  text-center h-[4rem]">
                    {guest?.bookingCounts}
                  </td>
                  <td className="px-4 py-2 text-center h-[4rem]">
                    {guest?.status ? <p>True</p> : <p>False</p>}
                  </td>
                  <td className="px-4 py-2 text-center w-[10rem] h-[4rem]">
                    <p>{formatDate(guest?.last_check_in)}</p>
                  </td>
                  <td className="px-4 py-2 text-center w-[10rem] h-[4rem]">
                    <p>{formatDate(guest?.last_check_out)}</p>
                  </td>
                  <td className="px-2 flex flex-col items-center relative h-[70px] justify-center">
                    <Menu>
                      <Menu.Button>
                        <BsThreeDots className=" text-2xl font-bold cursor-pointer  rounded-full " />
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
                        <Menu.Items className="absolute right-0 -bottom-6 z-50  mt-2 w-36 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none ">
                          <div className="px-1 py-1 ">
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to={`/vendor/${hotel_name}/guestsLists/guestDetails/${guest.user_id}`}
                                  className={`${
                                    active
                                      ? "bg-gray-100 text-black"
                                      : "text-black"
                                  } group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm`}
                                >
                                  <FcViewDetails />
                                  View Details
                                </Link>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </td>
                </tr>
              ))
            ) : (
              <div className="">
                <p>No guests found</p>
              </div>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mb-2 border-b border-r border-l bg-gray-100 rounded-b-lg items-center ">
        {/* <p className="text-xs tracking-wide font-semibold pl-4">
          Showing: {(page - 1) * limit + 1} -{" "}
          {Math.min(page * limit, totalGuests)} of {totalGuests}
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
