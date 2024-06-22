import React, { Fragment, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineBedroomChild } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import bill from "../../assets/bill.png";
import { checkVendor } from "../../services/vendor/vendor.service";
import { Menu, Transition } from "@headlessui/react";
import { CiLogout } from "react-icons/ci";
import { clearData } from "../../redux/slice/userSlice";
import Error403 from "../../pages/error/error403";
import nobu from "../../assets/Nobu.png";
import { FaChevronDown } from "react-icons/fa";
import { GoHome } from "react-icons/go";
import { FaCalendarAlt } from "react-icons/fa";
import { MdBedroomChild } from "react-icons/md";
import { BsChatDotsFill } from "react-icons/bs";
import { BsPeopleFill } from "react-icons/bs";
import { FaCoins } from "react-icons/fa";
import { MdReviews } from "react-icons/md";
import { FaQuestion } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { MdRoomService } from "react-icons/md";
import Error401 from "../../pages/error/error401";
import Error404 from "../../components/error/error404";

export default function VendorLayout({ children }) {
  const { id, jwt, name } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const { hotel_name } = useParams();

  const dispatch = useDispatch();

  const [unVerified, setUnVerified] = useState(false);

  console.log(hotel_name);
  //!For checking if the vendor is valid or if the vendor is trying to redirect to their respective dashboard or not
  const checkHotel = async () => {
    try {
      const res = await checkVendor(hotel_name, jwt);
      console.log(res.data);
    } catch (e) {
      console.log(e);
      let status = e.response.status;
      if (status == 401) {
        navigate("/error401");
      } else if (status == 404) {
        navigate("*");
      } else if (status == 403) {
        setUnVerified(true);
      }
    }
  };

  useEffect(() => {
    checkHotel();
  }, []);

  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "bg-gray-100 text-black" : "";
  };

  const handleLogOut = () => {
    dispatch(clearData());
    navigate("/");
  };

  return (
    <div className={`${unVerified ? "text-gray-400" : ""} `}>
      <div className="grid grid-cols-6 bg-gray-50 text-black h-full">
        <div className=" col-span-1 border-r bg-white text-gray-500 h-screen shadow-sm flex flex-col sticky  top-0 ">
          <div className=" h-full ">
            <div className="flex gap-2 items-center py-2 border-b pl-1 ">
              <img className="w-12 h-12 ml-2" src={nobu}></img>
              <p className="text-black font-bold tracking-wider">Dashboard</p>
            </div>
            <div className="flex flex-col pt-4 px-1 ">
              {unVerified ? (
                <button
                  disabled={unVerified}
                  // to={`/vendor/${hotel_name}/vendorDashBoard`}
                  className={`${`/vendor/${hotel_name}/vendorDashBoard`} flex items-center m-2 hover:text-black duration-300 p-2 rounded-[10px] cursor-pointer`}
                >
                  <div className="text-3xl pr-2">
                    <MdDashboard />
                  </div>
                  <p className="font-bold">Dashboard</p>
                </button>
              ) : (
                <Link
                  to={`/vendor/${hotel_name}/vendorDashBoard`}
                  className={`${isActive(
                    `/vendor/${hotel_name}/vendorDashBoard`
                  )} flex items-center m-2 hover:text-black  p-2 rounded-[10px]  duration-300  cursor-pointer`}
                >
                  <div className="text-3xl pr-2">
                    <MdDashboard />
                  </div>
                  <p className="font-bold ">Dashboard</p>
                </Link>
              )}
              {unVerified ? (
                <button
                  disabled={unVerified}
                  className={`${`/vendor/${hotel_name}/bookingLists`} flex items-center m-2 hover:text-black duration-300   p-2 rounded-[10px] cursor-pointer`}
                >
                  <div className="text-3xl pr-2">
                    <FaCalendarAlt />
                  </div>
                  <p className="font-bold">Bookings</p>
                </button>
              ) : (
                <Link
                  to={`/vendor/${hotel_name}/bookingLists`}
                  className={`${isActive(
                    `/vendor/${hotel_name}/bookingLists`
                  )} flex items-center m-2 hover:text-black duration-300   p-2 rounded-[10px] cursor-pointer`}
                >
                  <div className="text-3xl pr-2">
                    <FaCalendarAlt />
                  </div>
                  <p className="font-bold">Bookings</p>
                </Link>
              )}
              {unVerified ? (
                <button
                  disabled={unVerified}
                  className={`${`/vendor/${hotel_name}/roomLists`} flex items-center m-2 hover:text-black duration-300  p-2 rounded-[10px] cursor-pointer`}
                >
                  <div className="text-3xl pr-2">
                    <MdBedroomChild />
                  </div>
                  <p className="font-bold">Rooms</p>
                </button>
              ) : (
                <Link
                  to={`/vendor/${hotel_name}/roomLists`}
                  className={`${isActive(
                    `/vendor/${hotel_name}/roomLists`
                  )} flex items-center m-2 hover:text-black duration-300  p-2 rounded-[10px] cursor-pointer`}
                >
                  <div className="text-3xl pr-2">
                    <MdBedroomChild />
                  </div>
                  <p className="font-bold">Rooms</p>
                </Link>
              )}

              {unVerified ? (
                <button
                  disabled={unVerified}
                  className={`${`/vendor/${hotel_name}/guestsLists`} flex items-center m-2 hover:text-black duration-300  p-2 rounded-[10px] cursor-pointer`}
                >
                  <div className="text-3xl pr-2">
                    <BsPeopleFill />
                  </div>
                  <p className="font-bold">Customers</p>
                </button>
              ) : (
                <Link
                  to={`/vendor/${hotel_name}/guestsLists`}
                  className={`${isActive(
                    `/vendor/${hotel_name}/guestsLists`
                  )} flex items-center m-2 hover:text-black duration-300  p-2 rounded-[10px] cursor-pointer`}
                >
                  <div className="text-3xl pr-2">
                    <BsPeopleFill />
                  </div>
                  <p className="font-bold"> Customers</p>
                </Link>
              )}
              {unVerified ? (
                <button
                  disabled={unVerified}
                  className={`${`/vendor/${hotel_name}/paymentLists`} flex items-center m-2 hover:text-black duration-300  p-2 rounded-[10px] cursor-pointer`}
                >
                  <div className="text-3xl pr-2">
                    <FaCoins />
                  </div>
                  <p className="font-bold">Payments</p>
                </button>
              ) : (
                <Link
                  to={`/vendor/${hotel_name}/paymentLists`}
                  className={`${isActive(
                    `/vendor/${hotel_name}/paymentLists`
                  )} flex items-center m-2 hover:text-black duration-300  p-2 rounded-[10px] cursor-pointer`}
                >
                  <div className="text-3xl pr-2">
                    <FaCoins />
                  </div>
                  <p className="font-bold">Payments</p>
                </Link>
              )}

              {unVerified ? (
                <button
                  disabled={unVerified}
                  className={`${`/vendor/${hotel_name}/reviewsLists`} flex items-center m-2 hover:text-black duration-300  p-2 rounded-[10px] cursor-pointer`}
                >
                  <div className="text-3xl pr-2">
                    <MdReviews />
                  </div>
                  <p className="font-bold">Reviews</p>
                </button>
              ) : (
                <Link
                  to={`/vendor/${hotel_name}/reviewsLists`}
                  className={`${isActive(
                    `/vendor/${hotel_name}/reviewsLists`
                  )} flex items-center m-2 hover:text-black duration-300  p-2 rounded-[10px] cursor-pointer`}
                >
                  <div className="text-3xl pr-2">
                    <MdReviews />
                  </div>
                  <p className="font-bold">Reviews</p>
                </Link>
              )}
              {unVerified ? (
                <button
                  disabled={unVerified}
                  className={`${`/vendor/${hotel_name}/additionalServices`} flex items-center m-2 hover:text-black duration-300  p-2 rounded-[10px] cursor-pointer`}
                >
                  <div className="text-3xl pr-2">
                    <MdRoomService />
                  </div>
                  <p className="font-bold">Additional Services</p>
                </button>
              ) : (
                <Link
                  to={`/vendor/${hotel_name}/additionalServices`}
                  className={`${isActive(
                    `/vendor/${hotel_name}/additionalServices`
                  )} flex items-center m-2 hover:text-black duration-300  p-2 rounded-[10px] cursor-pointer`}
                >
                  <div className="text-3xl pr-2">
                    <MdRoomService />
                  </div>
                  <p className="font-bold">Additional Services</p>
                </Link>
              )}
              {unVerified ? (
                <button
                  disabled={unVerified}
                  className={`${`/vendor/${hotel_name}/allAmenities`} flex items-center m-2 hover:text-black duration-300  p-2 rounded-[10px] cursor-pointer`}
                >
                  <div className="text-3xl pr-2">
                    <MdRoomService />
                  </div>
                  <p className="font-bold">Amenities </p>
                </button>
              ) : (
                <Link
                  to={`/vendor/${hotel_name}/allAmenities`}
                  className={`${isActive(
                    `/vendor/${hotel_name}/allAmenities`
                  )} flex items-center m-2 hover:text-black duration-300  p-2 rounded-[10px] cursor-pointer`}
                >
                  <div className="text-3xl pr-2">
                    <MdRoomService />
                  </div>
                  <p className="font-bold">Amenities </p>
                </Link>
              )}
              {unVerified ? (
                <button
                  disabled={unVerified}
                  className={`${`/vendor/${hotel_name}/allFAQHotel`} flex items-center m-2 hover:text-black duration-300  p-2 rounded-[10px] cursor-pointer`}
                >
                  <div className="text-3xl pr-2">
                    <FaQuestion />
                  </div>
                  <p className="font-bold">FAQ's </p>
                </button>
              ) : (
                <Link
                  to={`/vendor/${hotel_name}/allFAQHotel`}
                  className={`${isActive(
                    `/vendor/${hotel_name}/allFAQHotel`
                  )} flex items-center m-2 hover:text-black duration-300  p-2 rounded-[10px] cursor-pointer`}
                >
                  <div className="text-3xl pr-2">
                    <FaQuestion />
                  </div>
                  <p className="font-bold">FAQ's </p>
                </Link>
              )}

              {unVerified ? (
                <button
                  disabled={unVerified}
                  className={`${`/supportChatLists/${hotel_name}`} flex items-center m-2 hover:text-black duration-300  p-2 rounded-[10px] cursor-pointer`}
                >
                  <div className="text-3xl pr-2">
                    <BsChatDotsFill />
                  </div>
                  <p className="font-bold">Support</p>
                </button>
              ) : (
                <Link
                  to={`/supportChatLists/${hotel_name}`}
                  className={`${isActive(
                    `/supportChatLists/${hotel_name}`
                  )} flex items-center m-2 hover:text-black duration-300  p-2 rounded-[10px] cursor-pointer`}
                >
                  <div className="text-3xl pr-2">
                    <BsChatDotsFill />
                  </div>
                  <p className="font-bold">Support </p>
                </Link>
              )}
              {unVerified ? (
                <button
                  disabled={unVerified}
                  className={`${`/vendor/${hotel_name}/settings`} flex items-center m-2 hover:text-black duration-300  p-2 rounded-[10px] cursor-pointer`}
                >
                  <div className="text-3xl pr-2">
                    <IoSettings />
                  </div>
                  <p className="font-bold">Settings</p>
                </button>
              ) : (
                <Link
                  to={`/vendor/${hotel_name}/settings`}
                  className={`${isActive(
                    `/vendor/${hotel_name}/settings`
                  )} flex items-center m-2 hover:text-black duration-300  p-2 rounded-[10px] cursor-pointer`}
                >
                  <div className="text-3xl pr-2">
                    <IoSettings />
                  </div>
                  <p className="font-bold">Settings</p>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-5  ">
          <div className="flex sticky top-0 justify-end p-2 items-center  border z-40 bg-white">
            <Menu>
              <Menu.Button>
                <div className="flex items-center gap-4 mr-10 ">
                  <img
                    className="w-12 rounded-full h-12 object-cover"
                    src={bill}
                  ></img>
                  <div className="flex flex-col  text-xs items-start">
                    <p className="text-violet-950 font-bold ">Vendor</p>
                    <div className="flex gap-2 items-center font-semibold text-gray-600">
                      <p>{name}</p>
                      <FaChevronDown className="text-[10px] " />
                    </div>
                  </div>
                </div>
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
                <Menu.Items className="absolute border-t-2 border-t-purple-950 right-10 -bottom-20  z-50  mt-2 w-36 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none ">
                  <div className="px-1 py-1 font-semibold ">
                    {/* <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-gray-100 text-black" : "text-black"
                      } group flex gap-2  w-full items-center rounded-md px-2 py-2 text-sm duration-300 `}
                    >
                      Profile
                    </button>
                  )}
                </Menu.Item> */}
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          // to={`/vendor/${hotel_name}/guestsLists/guestDetails/${guest.user_id}`}
                          to={"/"}
                          className={`${
                            active ? "bg-gray-100 text-black" : "text-black"
                          } group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm duration-300 `}
                        >
                          {/* <FcViewDetails /> */}
                          <GoHome />
                          Home
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <div
                          onClick={handleLogOut}
                          className={`${
                            active ? "bg-gray-100 text-black" : "text-black"
                          } group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm duration-300 cursor-pointer`}
                        >
                          {/* <FcViewDetails /> */}
                          <CiLogout className="font-semibold text-black" />
                          Logout
                        </div>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
          {unVerified ? <Error403 /> : children}
        </div>
      </div>
    </div>
  );
}
