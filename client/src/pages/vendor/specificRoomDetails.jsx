import { Fragment, useEffect, useRef, useState } from "react";
import RoomPhotos from "../../features/mainRooms/roomPhotos";
import { Link, useParams } from "react-router-dom";
import { BiHome } from "react-icons/bi";
import { getSingleRoomDetails } from "../../services/hotels/hotels.service";
import { getSpecificRoomByName } from "../../services/vendor/vendor.service";
import { useSelector } from "react-redux";
import { Menu, Stack } from "@mui/material";
import { formatCurrentDates } from "../../utils/formatDates";
import AnimatedProfile from "../../components/animated/animatedProfile";
import { BsThreeDots } from "react-icons/bs";
import { Transition } from "@headlessui/react";
import { amenityIcons } from "../../icons/amenitiesIcons";

//!This is used for viewing the details through vendor
export default function SpecificRoomDetails() {
  const [activeSection, setActiveSection] = useState("Details");
  const detailsRef = useRef(null);
  const amenitiesRef = useRef(null);
  const imagesRef = useRef(null);
  const [roomDetails, setRoomDetails] = useState();
  const { hotel_name, room_id } = useParams();
  const [bookingDetails, setBookingDetails] = useState([]);
  const { jwt } = useSelector((state) => state.user);

  const handleNavClick = (section) => {
    let targetRef;
    switch (section) {
      case "Details":
        targetRef = detailsRef;
        break;
      case "Amenities":
        targetRef = amenitiesRef;
        break;
      case "Images":
        targetRef = imagesRef;
        break;
      default:
        break;
    }

    if (targetRef && targetRef.current) {
      const offsetTop = targetRef.current.offsetTop - 100; // Adjust the offset as needed
      const offsetScroll = offsetTop > 100 ? offsetTop - 100 : 0; // Subtract a bit more from offsetTop if it's greater than 100
      window.scrollTo({
        top: offsetScroll,
        behavior: "smooth",
      });
      setActiveSection(section);
    }
  };
  useEffect(() => {
    getRoom();
  }, []);

  const getRoom = async () => {
    try {
      const res = await getSpecificRoomByName(hotel_name, room_id, jwt);
      console.log(res.data);

      setRoomDetails(res.data.data.roomDetails);
      setBookingDetails(res.data.data.bookingDetail);
    } catch (e) {
      const errorMessage = e.response.data.message;
      console.log(errorMessage);
      console.log(e.response.data.message);
    }
  };

  // const roomPictures = roomDetails && roomDetails.other_pictures.slice(0,4)
  console.log(bookingDetails);

  const roomPictures = roomDetails && roomDetails?.other_pictures;

  return (
    <div className="flex flex-col w-full px-8 h-full pt-2">
      <div className="gap-2 flex items-center mb-2 ">
        <Link
          to={`/vendor/${hotel_name}/vendorDashBoard`}
          className="p-2 hover:bg-gray-200 rounded-lg cursor-pointer"
        >
          <BiHome />
        </Link>
        /
        <Link
          to={`/vendor/${hotel_name}/roomLists`}
          className="p-2 hover:bg-gray-200 rounded-lg cursor-pointer text-sm"
        >
          <p>Room Lists</p>
        </Link>
        /
        <div className="p-2 text-sm hover:bg-gray-200 rounded-lg cursor-pointer">
          <p>Room {roomDetails?.room_no}</p>
        </div>
      </div>
      <h1 className="text-xl font-semibold tracking-wider">ROOM 101</h1>
      <p className="text-sm font-semibold my-4">NP1000 per night</p>
      <div className=" flex gap-10 top-0 sticky">
        <p
          className={`cursor-pointer ${
            activeSection === "Details"
              ? "border-b-4 rounded-sm border-b-violet-950"
              : "hover:border-b-violet-950"
          } transition-all duration-500 delay-100`}
          onClick={() => handleNavClick("Details")}
        >
          Details
        </p>
        <p
          className={`cursor-pointer ${
            activeSection === "Amenities"
              ? "border-b-4 rounded-sm border-b-violet-950"
              : "hover:border-b-violet-950"
          } transition-all duration-500 delay-100`}
          onClick={() => handleNavClick("Amenities")}
        >
          Amenities
        </p>
        <p
          className={`cursor-pointer ${
            activeSection === "Images"
              ? "border-b-4 rounded-sm border-b-violet-950"
              : "hover:border-b-violet-950"
          } transition-all duration-500 delay-100`}
          onClick={() => handleNavClick("Images")}
        >
          Images
        </p>
      </div>
      <div className="bg-white px-10 py-6 mt-4 rounded-lg border ">
        <div>
          <h1 className="border-b  pb-4 mb-4 font-semibold text-2xl ">
            Pictures
          </h1>

          {roomDetails && <RoomPhotos roomPictures={roomPictures} />}
        </div>
        <div className="">
          <h1 className="border-b pb-4 mb-4 text-2xl font-semibold">Details</h1>
          <div>
            <h1 className="font-semibold  text-lg">Room description</h1>
            <p>{roomDetails?.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Room type</p>
              <p>{roomDetails?.roomType?.type_name}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Bed types</p>
              <div className="grid grid-cols-2 gap-2 w-[18rem] ">
                {roomDetails?.room_beds.map((beds) => (
                  <p>{beds.type_name}</p>
                ))}
              </div>
            </div>
            <div className="flex flex-col mb-4">
              <p className="text-lg font-semibold">Room Capacity</p>
              <p>{roomDetails?.room_capacity}</p>
            </div>
            <div className="flex flex-col mb-4">
              <p className="text-lg font-semibold">Room Floor</p>
              <p>{roomDetails?.floor}</p>
            </div>
          </div>
        </div>
        <div className="">
          <h1 className="border-b  pb-4 mb-4 font-semibold text-2xl ">
            Amenities
          </h1>
          <div className="grid grid-cols-2 w-[20rem] gap-2 ">
            {roomDetails?.room_amenities.map((amen) => (
              <span className="flex gap-2 items-center">
                {amenityIcons[amen]} {amen}
              </span>
            ))}
          </div>
        </div>
      </div>
      <h1 className="mt-10 font-semibold">Booking details of the room</h1>
      <div className="h-[520px] overflow-auto border bg-white rounded-xl custom-scrollbar mt-2">
        <table className="w-full">
          <thead className="shadow-sm border-b z-40 sticky top-0 bg-white ">
            <tr>
              <th className="px-4 py-4 font-semibold ">Guest </th>
              <th className="px-4 py-4 font-semibold w-[140px]">Room Number</th>
              <th className="px-4 py-4 font-semibold ">Ordered Date</th>
              <th className="px-4 py-4 font-semibold ">Check-in</th>
              <th className="px-4 py-4 font-semibold ">Check-out</th>
              <th className="px-4 py-4 font-semibold ">Room Type</th>
              <th className="px-4 py-4 font-semibold ">Price</th>
              <th className="px-4 py-4 font-semibold ">Status</th>
              <th className="px-4 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {bookingDetails &&
              bookingDetails?.bookingDetails?.map((book, index) => (
                <tr
                  key={book?.booking_id}
                  className=" h-[4rem] text-sm font-semibold text-gray-600  "
                >
                  <td className="px-14 py-2 w-[10rem] h-[4rem] ">
                    <AnimatedProfile details={book?.user} />
                  </td>
                  <td className="px-4 py-2 w-[8rem] h-[4rem]">
                    <p className="text-center">#{book.room.room_id}</p>
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
                    {/* <div className="flex flex-wrap gap-1 justify-center">
                    {room.room_amenities.map((amen, index) => (
                      <p key={index}>{amen},</p>
                    ))}
                  </div> */}
                    <p className="text-center">
                      {formatCurrentDates(book.check_out_date)}
                    </p>
                  </td>
                  <td className="px-4 py-2 h-[4rem]">
                    <p className="text-center">{book.room.room_type}</p>
                  </td>
                  <td className="px-4 py-2 h-[4rem]">
                    <p className="text-center">NPR{book.total_price}</p>
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
                    {/* <BsThreeDots
                    className="rounded-xl text-2xl font-bold cursor-pointer "
                    onClick={() => handleOpenItems(index)}
                  /> */}

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
                          <div className="px-1 py-1 ">
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  className={`${
                                    active
                                      ? "bg-gray-100 text-black"
                                      : "text-black"
                                  } group flex gap-2  w-full items-center rounded-md px-2 py-2 text-sm`}
                                  // to={`/vendor/${hotel_name}/roomLists/room/${room.room_id}/editRoom`}
                                >
                                  <MdEdit />
                                  Edit
                                </Link>
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
                                  {/* {active ? (
                                  <DuplicateActiveIcon
                                    className="mr-2 h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <DuplicateInactiveIcon
                                    className="mr-2 h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )} */}
                                  <FaEye className="" />
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
              ))}
          </tbody>
        </table>
      </div>
      {/* <div className="flex justify-end mr-2 mb-2">
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
      </div> */}
    </div>
  );
}
