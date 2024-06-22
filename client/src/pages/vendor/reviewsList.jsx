import React, { Fragment, useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Dialog, Pagination, Stack } from "@mui/material";
import { Menu, Transition } from "@headlessui/react";
import { MdDelete, MdEdit } from "react-icons/md";
import { FcViewDetails } from "react-icons/fc";
import {
  deleteHotelReviewsVendor,
  getHotelReviewsVendor,
} from "../../services/vendor/vendor.service";
import { formatCurrentDates } from "../../utils/formatDates";
import { generateStars } from "../../utils/convertStars";
import { MdStar } from "react-icons/md";
import { toast } from "react-toastify";

export default function ReviewsList() {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get("page")) || 1;
  const [totalreviews, setTotalreviews] = useState(1);
  //!For opening editors
  const [openItems, setOpenItems] = useState(null); // Track opened items
  const [dialogRoomId, setDialogRoomId] = useState(null); // Track room id for dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogRef = useRef(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteReviewId, setDeleteReviewId] = useState(null);
  const [limit, setLimit] = useState(0);

  const { hotel_name } = useParams();
  const { jwt } = useSelector((state) => state.user);

  useEffect(() => {
    getReviews(page);
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
  }, [page]);

  const getReviews = async (pageNumber) => {
    try {
      const res = await getHotelReviewsVendor(hotel_name, pageNumber, jwt);
      setReviews(res.data.data.allReviews);
      setLimit(res.data.data.limit);
      setTotalPages(Math.ceil(res.data.data.total / res.data.data.limit));
    } catch (e) {
      console.log(e);
    }
  };

  const handlePageChange = (pageNumber) => {
    queryParams.set("page", pageNumber);
    navigate(`/vendor/${hotel_name}/reviewsLists?${queryParams.toString()}`);
  };

  const deleteReview = async () => {
    try {
      const res = await deleteHotelReviewsVendor(
        hotel_name,
        deleteReviewId,
        jwt
      );
      console.log(res.data);
      toast.success(res.data.message);
      setIsDeleteDialogOpen(false);
      setDeleteReviewId(null);
      getReviews();
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  return (
    <div className=" flex flex-col w-full px-8 gap-4">
      <div className="font-semibold text-xl mt-4 ">
        <p>Review's List</p>
      </div>
      <div className="flex gap-6 items-center font-semibold  w-fit text-gray-500 text-sm ">
        <div className={` `}>
          <p className="">You have total {reviews?.length} reviews</p>
        </div>
      </div>
      <div className="h-[40rem] overflow-auto border bg-white rounded-xl custom-scrollbar">
        <div className="w-full">
          <div className="border-b-2 w-full z-40 sticky top-0 bg-white flex justify-between">
            <div className="mx-10 py-2 border-b-4 border-violet-950 w-[10rem] text-center">
              <p>All Reviews</p>
            </div>
            {/* <div className="items-center flex gap-2 pr-8 ">
              <p className="font-semibold">Sort By Rate:</p>
              {[1, 2, 3, 4, 5].map((index) => (
                <MdStar className="text-yellow-400 text-2xl" />
              ))}
            </div> */}
          </div>
          <thead className="border-b-2  font-semibold">
            <tr>
              <th className=""></th>
              <th className=""></th>
              <th className=""></th>
            </tr>
          </thead>

          <tbody>
            {reviews?.length > 0 ? (
              reviews?.map((guest, index) => (
                <tr
                  key={guest.user_id}
                  className="  text-sm font-semibold text-gray-500  "
                >
                  <td className="px-4 py-2 h-[4rem] w-[25rem] border-b">
                    <div className="flex gap-4 items-center justify-center">
                      <img
                        className="w-16 h-16 rounded-full object-cover"
                        src={guest?.user?.profile}
                      ></img>
                      <div>
                        <p className="text-xl text-black font-bold">
                          {guest?.user?.user_name}
                        </p>
                        <p>Posted on {formatCurrentDates(guest?.createdAt)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 w-[60rem]  h-[4rem]">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-10 items-center">
                        <p className="text-black capitalize text-lg font-bold">
                          {guest?.title}
                        </p>
                        <div className="flex items-center text-yellow-400 text-xl">
                          {generateStars(guest?.ratings)}
                        </div>
                      </div>
                      <p>
                        {guest?.content} Billie Eilish, born Billie Eilish
                        Pirate Baird O'Connell, is a phenomenally talented
                        singer-songwriter who has taken the music world by storm
                        with her unique blend of pop, electronic, and
                        alternative music. Born in Los Angeles in 2001, Billie
                        grew up in a family deeply involved in the arts, which
                        fostered her early passion for music. Her breakthrough
                        came in 2015 when she uploaded the song "Ocean Eyes" to
                        SoundCloud, catching the attention of listeners
                        worldwide.
                      </p>
                    </div>
                  </td>
                  <td className="px-4 flex flex-col items-center relative h-[8rem] justify-center">
                    <Menu>
                      <Menu.Button>
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
                          <div className="px-1 py-1 ">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={`${
                                    active
                                      ? "bg-gray-100 text-black"
                                      : "text-black"
                                  } group flex gap-2  w-full items-center rounded-md px-2 py-2 text-sm`}
                                  onClick={() => {
                                    setIsDeleteDialogOpen(true);
                                    // handleOpenItems(index);
                                    setDeleteReviewId(guest.review_id);
                                  }}
                                >
                                  <MdDelete />
                                  Delete
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                    <Dialog
                      className="absolute"
                      open={isDeleteDialogOpen}
                      onClose={() => {
                        setIsDeleteDialogOpen(false);
                        setDeleteReviewId(null);
                      }}
                    >
                      <div className=" flex max-w-lg flex-col items-center rounded-md border px-8 py-10 text-gray-800 shadow-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 rounded-xl bg-red-50 p-2 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        <p className="mt-4 text-center text-xl font-bold">
                          Do you want to delete this room?
                        </p>
                        <p className="mt-2 text-center text-lg">
                          Are you sure you want to delete the user{" "}
                          <span className="truncate font-medium">
                            James Keyser
                          </span>
                          ?
                        </p>
                        <div className="mt-8 flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                          <button
                            className="whitespace-nowrap rounded-md bg-red-500 px-4 py-3 font-medium text-white"
                            onClick={deleteReview}
                          >
                            Yes, delete the review
                          </button>
                          <button
                            className="whitespace-nowrap rounded-md bg-gray-200 px-4 py-3 font-medium"
                            onClick={() => {
                              setIsDeleteDialogOpen(false);
                              setDeleteReviewId(null);
                            }}
                          >
                            Cancel, keep the review
                          </button>
                        </div>
                      </div>
                    </Dialog>
                  </td>
                </tr>
              ))
            ) : (
              <div className="">
                <p>No reviews found</p>
              </div>
            )}
          </tbody>
        </div>
      </div>
      <div className="flex justify-end mb-2 border-b border-r border-l bg-gray-100 rounded-b-lg items-center ">
        {/* <p className="text-xs tracking-wide font-semibold pl-4">
          Showing: {(page - 1) * limit + 1} -{" "}
          {Math.min(page * limit, totalreviews)} of {totalreviews}
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
