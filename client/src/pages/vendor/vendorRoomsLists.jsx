import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsThreeDots } from "react-icons/bs";
import "../../global/css/scrollbar.css";
import { Dialog, MenuItem, Pagination, Select, Stack } from "@mui/material";
import { toast } from "react-toastify";
import {
  deleteHotelRoom,
  getAllRooms,
  getRoomTypesRegistration,
} from "../../services/vendor/vendor.service";
import { Menu, Transition } from "@headlessui/react";
import { MdEdit } from "react-icons/md";
import { FcViewDetails } from "react-icons/fc";
import { FaTrash } from "react-icons/fa";
import Drawer from "@mui/material/Drawer";

export default function VendorRoomsLists() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get("page")) || 1;
  const [totalPages, setTotalPages] = useState(1);
  const [totalRooms, setTotalRooms] = useState(0);
  const [totalBookedRooms, setTotalBookedRoooms] = useState(0);
  const [totalAvailableRoooms, setTotalAvailableRoooms] = useState(0);

  //!For opening editors
  const [openItems, setOpenItems] = useState(null); // Track opened items
  const [dialogRoomId, setDialogRoomId] = useState(null); // Track room id for dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogRef = useRef(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bookedRooms, setBookedRooms] = useState(
    queryParams.get("bookedRooms") || false
  );
  const [deleteRoomId, setDeleteRoomId] = useState(null);

  const [allAvailableRooms, setAllAvailableRooms] = useState(
    queryParams.get("allAvailableRooms") || false
  );
  const [everyRooms, setEveryRooms] = useState(false);

  const { hotel_name } = useParams();
  const { jwt } = useSelector((state) => state.user);
  const [drawerOpen, setDrawerOpen] = useState(false); // State variable for controlling the drawer
  const [limit, setLimit] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const handleUpdateStatusClick = () => {
    setDrawerOpen(!drawerOpen); // Open the drawer when "Update Status" is clicked
  };
  const [selectedRoomFloor, setSelectedRoomFloor] = useState("");

  const floorTypes = {
    First: "First",
    Second: "Second",
    Third: "Third",
    Fourth: "Fourth",
    Fifth: "Fifth",
    Sixth: "Sixth",
    Seventh: "Seventh",
    Eighth: "Eighth",
    Ninth: "Ninth",
    Tenth: "Tenth",
  };

  console.log(totalAvailableRoooms);
  useEffect(() => {
    getRooms(page);
    getRoomTypes();
    if (
      !queryParams.get("bookedRooms") &&
      !queryParams.get("allAvailableRooms")
    ) {
      setEveryRooms(true);
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
    allAvailableRooms,
    everyRooms,
    searchName,
    selectedRoomType,
    selectedRoomFloor,
  ]);

  console.log(rooms);

  const getRooms = async (pageNumber) => {
    let params = {};
    if (allAvailableRooms) {
      params["allAvailableRooms"] = true;
      console.log("hshs");
    } else if (bookedRooms) {
      params["bookedRooms"] = true;
      console.log("haha");
    }

    try {
      const res = await getAllRooms(
        hotel_name,
        pageNumber,
        searchName,
        selectedRoomType,
        selectedRoomFloor,
        params,
        jwt
      );
      // Set the rooms state with the newly fetched rooms
      setRooms(res.data.data.data);
      setTotalRooms(res.data.data.allRoomsCount);
      setTotalAvailableRoooms(res.data.data.allAvailableRoomsCount);
      setTotalBookedRoooms(res.data.data.allBookedRoomsCount);
      console.log(res.data.data);
      setTotalPages(Math.ceil(res.data.data.total / res.data.data.limit));
      setLimit(res.data.data.limit);
    } catch (e) {
      console.log(e);
    }
  };

  const getRoomTypes = async () => {
    try {
      const res = await getRoomTypesRegistration();
      setRoomTypes(res.data.data);
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteRooms = async () => {
    try {
      const res = await deleteHotelRoom(hotel_name, deleteRoomId, jwt);
      setIsDialogOpen(false);
      setDialogRoomId(null);
      console.log(res.data.data);
      toast.success(res.data.message);
      getRooms();
      setIsDeleteDialogOpen(false);
      setDeleteRoomId(null);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  // const roomTypes = [
  //   { id: 1, name: "Single Room" },
  //   { id: 2, name: "Double Room" },
  //   { id: 3, name: "Suite" },
  //   // Add more room types as needed
  // ];

  const handlePageChange = (pageNumber) => {
    queryParams.set("page", pageNumber);
    navigate(`/vendor/${hotel_name}/roomLists?${queryParams.toString()}`);
  };

  const handleQuery = (type) => {
    switch (type) {
      case "bookedRooms":
        queryParams.set("bookedRooms", true);
        queryParams.delete("allAvailableRooms");
        queryParams.delete("page");

        setBookedRooms(true);
        setAllAvailableRooms(false);
        setEveryRooms(false);

        break;
      case "allAvailableRooms":
        queryParams.set("allAvailableRooms", true);
        queryParams.delete("bookedRooms");
        queryParams.delete("page");

        setAllAvailableRooms(true);
        setBookedRooms(false);
        setEveryRooms(false);

        break;
      case "deleteAll":
        queryParams.delete("bookedRooms");
        queryParams.delete("allAvailableRooms");
        queryParams.delete("page");

        setAllAvailableRooms(false);
        setBookedRooms(false);
        setEveryRooms(true);
        break;
      default:
        break;
    }
    navigate(`/vendor/${hotel_name}/roomLists?${queryParams.toString()}`);
  };

  return (
    <div className="px-8 flex flex-col w-full ">
      <div className="font-semibold text-xl mt-2">
        <p>Room List</p>
      </div>

      <div className="flex justify-between border-b">
        <div className="flex gap-6 items-center font-semibold w-fit pt-2 rounded-xl text-sm  ">
          <div
            className={`pb-2 ${
              everyRooms && "border-b-2 border-b-violet-950 "
            }  `}
            onClick={() => handleQuery("deleteAll")}
          >
            <p className="cursor-pointer"> All rooms ({totalRooms})</p>
          </div>
          <div
            className={`pb-2 ${
              bookedRooms && "border-b-2  border-b-violet-950 "
            }  `}
            onClick={() => handleQuery("bookedRooms")}
          >
            <p className="cursor-pointer">Booked rooms ({totalBookedRooms})</p>
          </div>
          <div
            className={`pb-2 ${
              allAvailableRooms && "border-b-2  border-b-violet-950 "
            }  `}
            onClick={() => handleQuery("allAvailableRooms")}
          >
            <p className="cursor-pointer">
              Available rooms ({totalAvailableRoooms})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={selectedRoomFloor || ""}
            onChange={(e) => setSelectedRoomFloor(e.target.value)}
            className="p-2 rounded-lg border text-xs h-[2rem] w-[10rem] "
            displayEmpty
            inputProps={{ "aria-label": "Select Room Type" }}
          >
            <MenuItem value="">Select a floor</MenuItem>
            {Object.keys(floorTypes).map((floor) => (
              <MenuItem key={floor} value={floor}>
                {floorTypes[floor]}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={selectedRoomType || ""}
            onChange={(e) => setSelectedRoomType(e.target.value)}
            className="p-2 rounded-lg border text-xs h-[2rem] w-[10rem] "
            displayEmpty
            inputProps={{ "aria-label": "Select Room Type" }}
          >
            <MenuItem value="">Select Room Type</MenuItem>
            {roomTypes.map((roomType) => (
              <MenuItem
                key={roomType.room_type_id}
                value={roomType.room_type_id}
              >
                {roomType.type_name}
              </MenuItem>
            ))}
          </Select>

          <Link
            to={`/vendor/${hotel_name}/addRooms`}
            className="p-2 rounded-lg border font-semibold bg-violet-950  text-sm text-white cursor-pointer hover:bg-opacity-90 duration-300"
          >
            <p>Add rooms</p>
          </Link>
        </div>
      </div>
      <div class="relative w-[30rem] mt-2 border flex items-center justify-between rounded-full">
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
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          class="h-10 w-full cursor-text rounded-full border bg-slate-200 py-2 pr-40 pl-12  outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          placeholder="Search by room number"
        />
      </div>

      <div className="h-[520px] mt-4 overflow-auto border bg-white rounded-t-lg custom-scrollbar">
        <table className="w-full">
          <thead className=" z-30 sticky font-semibold top-0 border-b bg-gray-100 h-[3rem] text-sm ">
            <tr>
              <td className="px-4 py-2  text-center ">Room ID</td>
              <td className="px-4 py-2  text-center ">Room.no</td>
              <td className="px-4 py-2  text-center w-[12rem]">Images</td>
              <th className="px-4 py-2 font-semibold">Room Type</th>
              <th className="px-4 py-2 font-semibold">Bed Types</th>
              <th className="px-4 py-2 font-semibold">Room Amenities</th>
              <th className="px-4 py-2 font-semibold">Floor</th>
              <th className="px-4 py-2 font-semibold w-[128px]">Capacity</th>
              <th className="px-4 py-2 font-semibold">Price</th>
              <th className="px-4 py-2 font-semibold">Status</th>
              <th className="px-4 py-2 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms?.map((room, index) => (
              <tr
                key={room.room_id}
                className="border-b text-xs font-semibold text-gray-500"
              >
                <td className="px-4 py-2">
                  <p className="text-center">#{room.room_id}</p>
                </td>
                <td className="px-4 py-2">
                  <p className="text-center">{room.room_no}</p>
                </td>
                <td className="px-4">
                  <img
                    className="w-[10rem] h-[4rem] object-cover rounded-xl"
                    src={room?.other_pictures[0]?.room_picture}
                    alt="Room"
                  />
                  {/* <Swiper
                    navigation={true}
                    modules={[Navigation]}
                    className="w-[12rem] h-[6rem] rounded-xl "
                  >
                    {room?.other_pictures?.map((images) => (
                      <SwiperSlide>
                        <img
                          className="w-full h-full object-cover rounded-xl"
                          src={images.room_picture}
                          alt="Room"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper> */}
                </td>
                <td className="px-4 py-2">
                  <p className="text-center">{room.room_type}</p>
                </td>
                <td className="px-4 py-2 w-[10rem]">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {room?.bed_types.map((beds, index) => (
                      <p key={index}>{beds.type_name}</p>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2 w-[15rem]">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {" "}
                    {room.room_amenities.map((amen, index) => (
                      <p key={index}>
                        {amen}
                        {index !== room.room_amenities.length - 1 ? "," : ""}
                      </p>
                    ))}{" "}
                  </div>
                </td>
                <td className="px-4 py-2">
                  <p className="text-center">{room.floor}</p>
                </td>
                <td className="px-4 py-2 w-[5rem]">
                  <p className="text-center">{room.room_capacity}</p>
                </td>
                <td className="px-4 py-2">
                  <p className="text-center">NPR {room.price_per_night}</p>
                </td>
                <td className="px-4 py-2">
                  {room?.is_available ? (
                    <p className="text-center text-green-500"> Available</p>
                  ) : (
                    <p className="text-center text-red-500"> Booked</p>
                  )}
                </td>
                <td className="px-2 flex flex-col items-center relative h-[5rem] justify-center">
                  <Menu>
                    <Menu.Button>
                      <BsThreeDots
                        className="rounded-xl text-2xl font-bold cursor-pointer  "
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
                      <Menu.Items className="absolute right-0 -bottom-24 z-50  mt-2 w-36 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none ">
                        <div className="px-1 py-1 ">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                className={`${
                                  active
                                    ? "bg-gray-100 text-black"
                                    : "text-black"
                                } group flex gap-2  w-full items-center rounded-md px-2 py-2 text-sm`}
                                to={`/vendor/${hotel_name}/roomLists/room/${room.room_id}/editRoom`}
                              >
                                <MdEdit />
                                Edit
                              </Link>
                            )}
                          </Menu.Item>
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
                                  setDeleteRoomId(room.room_id);
                                }}
                              >
                                <FaTrash />
                                Delete
                              </button>
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
                                to={`/vendor/${hotel_name}/roomLists/room/${room.room_id}`}
                              >
                                <FcViewDetails className="" />
                                View Details
                              </Link>
                            )}
                          </Menu.Item>
                          {/* <Menu.Item>
                            {({ active }) => (
                              <div
                                onClick={handleUpdateStatusClick}
                                className={`${
                                  active
                                    ? "bg-gray-100 text-black"
                                    : "text-black"
                                } group flex gap-2  w-full items-center rounded-md px-2 py-2 text-sm cursor-pointer`}
                                // to={`/vendor/${hotel_name}/roomLists/room/${room.room_id}/editRoom`}
                              >
                                <MdEdit />
                                Update status
                              </div>
                            )}
                          </Menu.Item> */}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                  {/* <Drawer
                    anchor="right"
                    open={drawerOpen}
                    onClose={handleUpdateStatusClick}
                  >
                    <div style={{ width: 350 }}>
                      <div>
                        <div>
                          <p>Hehe</p>
                        </div>
                        <div>
                          <p>Haha</p>
                        </div>
                      </div>
                    </div>
                  </Drawer> */}
                  <Dialog
                    className="absolute"
                    open={isDeleteDialogOpen}
                    onClose={() => {
                      setIsDeleteDialogOpen(false);
                      setDeleteRoomId(null);
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
                        Are you sure you want to delete the room id{" "}
                        <span className="truncate font-medium">
                          {deleteRoomId}
                        </span>
                        ?
                      </p>
                      <div className="mt-8 flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                        <button
                          className="whitespace-nowrap rounded-md bg-purple-950 px-4 py-3 font-medium text-white"
                          onClick={deleteRooms}
                        >
                          Yes, delete the room
                        </button>
                        <button
                          className="whitespace-nowrap rounded-md bg-gray-200 px-4 py-3 font-medium"
                          onClick={() => setIsDeleteDialogOpen(false)}
                        >
                          Cancel, keep the room
                        </button>
                      </div>
                    </div>
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
