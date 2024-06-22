import React, { Fragment, useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getGuestsDetailsAPI } from "../../services/vendor/vendor.service";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Pagination,
  Stack,
} from "@mui/material";
import { Menu, Transition } from "@headlessui/react";
import { MdDelete, MdEdit } from "react-icons/md";
import { FcViewDetails } from "react-icons/fc";
import {
  AllUsersAdmin,
  DeleteUserByAdmin,
} from "../../services/admin/admin.service";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import { LuTrash } from "react-icons/lu";
import { formatDate } from "../../utils/formatDates";

export default function UsersLists() {
  const [guests, setGuests] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get("page")) || 1;
  const [totalGuests, setTotalGuests] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [openDeleteUser, setOpenDeleteUser] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  //!For opening editors
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogRef = useRef(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { id } = useSelector((state) => state.user);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit, setLimit] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  const handleClose = () => {
    setErrorMessage("");
    setMessage("");
    setDeleteUser(null);
    setOpenDeleteUser(false);
  };

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
      //   const res = await getGuestsDetailsAPI(
      //     hotel_name,
      //     pageNumber,
      //     searchName,
      //     jwt
      //   );
      const res = await AllUsersAdmin(searchName, pageNumber);
      // Set the rooms state with the newly fetched rooms
      setGuests(res.data.data.users);
      setTotalUsers(res.data.data.total);
      console.log(res.data.data);
      setLimit(res.data.data.limit);
      setTotalPages(Math.ceil(res.data.data.total / res.data.data.limit));
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmitDelete = async () => {
    if (deleteUser && message !== "") {
      try {
        const res = await DeleteUserByAdmin(deleteUser.user_id, {
          message: message,
        });
        console.log(res.data);
        toast.success(res.data.message);
        handleClose();
        getGuests(page);
      } catch (e) {
        console.log(e);
        toast.error(e.response.data.message);
      }
    } else {
      setErrorMessage("Please provide a message!");
    }
  };

  const handlePageChange = (pageNumber) => {
    queryParams.set("page", pageNumber);
    navigate(`/admin/${id}/allUsers?${queryParams.toString()}`);
  };

  return (
    <div className="px-8 flex flex-col w-full ">
      <div className="font-semibold text-xl mt-2 mb-2">
        <p>User's List</p>
      </div>
      <div className="flex gap-6 items-center font-semibold  w-fit text-gray-500 text-sm ">
        <div className={` `}>
          <p className="">You have total {totalUsers} users</p>
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
              <td className="px-4 py-4  text-center w-[16rem]">User</td>
              <th className="px-4 py-4 font-semibold">Phone Number</th>
              <th className="px-4 py-4 font-semibold">Email</th>
              <th className="px-4 py-4 font-semibold">Role</th>
              <th className="px-4 py-4 font-semibold">Joined in</th>
              <th className="px-4 py-4 font-semibold">Status</th>
              <th className="px-4 py-4 font-semibold"></th>
            </tr>
          </thead>

          <tbody>
            {guests.length > 0 ? (
              guests?.map((guest, index) => (
                <tr
                  key={guest.user_id}
                  className="border-b text-xs font-semibold text-gray-500"
                >
                  <td className="px-4 py-2 h-[4rem]">
                    <div className="flex gap-4  items-center">
                      <img
                        className="w-14 h-14 rounded-full object-cover"
                        src={guest.profile_picture}
                      ></img>
                      <p>{guest.user_name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2 w-[15rem] text-center h-[4rem]">
                    {guest?.phone_number}
                  </td>
                  <td className="px-4 py-2 w-[15rem] text-center h-[4rem]">
                    {guest.email}
                  </td>
                  <td className="px-4 py-2 w-[15rem] text-center h-[4rem]">
                    {guest.roles}
                  </td>
                  <td className="px-4 py-2 w-[15rem] text-center h-[4rem]">
                    {formatDate(guest.createdAt)}
                  </td>
                  <td className="px-4 py-2 w-[15rem] text-center h-[4rem]">
                    {guest?.verified ? "Verified" : "Not Verified  "}
                  </td>
                  {/* <td className="px-4 py-2 text-center w-[10rem] h-[4rem]">
                    <p>20,10221</p>
                  </td> */}
                  <td className="px-2 flex flex-col items-center relative h-[70px] justify-center">
                    <div
                      className="p-2 rounded-md  text-black text-xl hover:bg-red-700 hover:text-white duration-500 cursor-pointer"
                      onClick={() => {
                        setOpenDeleteUser(true);
                        setDeleteUser(guest);
                      }}
                    >
                      <LuTrash />
                    </div>
                  </td>
                  <Dialog open={openDeleteUser} onClose={handleClose}>
                    <DialogContent className="w-[30rem]">
                      <div className="flex flex-col gap-2 ">
                        <div className="flex justify-between items-center">
                          <h1 className="text-2xl font-semibold">
                            Delete User named {deleteUser?.user_name}
                          </h1>
                          <RxCross2
                            className="text-2xl cursor-pointer"
                            onClick={handleClose}
                          />
                        </div>
                        <p className="text-sm text-red-500 font-semibold">
                          Note: The reason should be compulsory.
                        </p>
                        <textarea
                          className="h-[20rem] border-2 rounded-lg p-2 outline-violet-950"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder={`Write a message on why you deleted the user named ${deleteUser?.user_name}`}
                        ></textarea>
                        {errorMessage !== "" && message == "" && (
                          <p>{errorMessage}</p>
                        )}
                      </div>
                    </DialogContent>
                    <DialogActions className="text-sm ">
                      <button
                        class="whitespace-nowrap rounded-md bg-violet-950 px-4 py-3 font-medium text-white"
                        type="button"
                        onClick={handleSubmitDelete}
                      >
                        DELETE
                      </button>
                      <button
                        onClick={handleClose}
                        class="whitespace-nowrap rounded-md bg-gray-200 px-4 py-3 font-medium mr-4"
                      >
                        CANCEL
                      </button>
                    </DialogActions>
                  </Dialog>
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
