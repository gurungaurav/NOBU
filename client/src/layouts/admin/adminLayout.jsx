import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { clearData } from "../../redux/slice/userSlice";
import { CiLogout } from "react-icons/ci";
import { MdDashboard } from "react-icons/md";
import nobu from "../../assets/Nobu.png";
import { FaChevronDown } from "react-icons/fa";
import { GoHome } from "react-icons/go";
import { RiHotelFill } from "react-icons/ri";
import { BsChatDotsFill, BsFillPeopleFill } from "react-icons/bs";
import { FaBloggerB, FaCoins } from "react-icons/fa6";

export default function AdminLayout({ children }) {
  const { id, name, profile_picture } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(clearData());
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path ? "bg-gray-100 text-black" : "";
  };

  return (
    <div>
      <div className="grid grid-cols-6 bg-gray-50 text-black ">
        <div className="col-span-1 border-r bg-white h-screen text-gray-500 shadow-sm flex flex-col sticky top-0">
          <div className="flex gap-2 items-center py-2 border-b pl-1">
            <img className="w-12 h-12 ml-2" src={nobu} alt="nobu logo" />
            <p className="text-black font-bold tracking-wider">Dashboard</p>
          </div>
          <div className="flex flex-col pt-4 px-1 ">
            <Link
              to={`/admin/${id}/adminDash`}
              className={`${isActive(
                `/admin/${id}/adminDash`
              )} flex items-center m-2 hover:text-black duration-300 p-2 rounded-[10px] cursor-pointer`}
            >
              <div className="text-3xl pr-2">
                <MdDashboard />
              </div>
              <p className="font-bold">Dash Board</p>
            </Link>
            <Link
              to={`/admin/${id}/allHotels`}
              className={`${isActive(
                `/admin/${id}/allHotels`
              )} flex items-center m-2 hover:text-black duration-300 p-2 rounded-[10px] cursor-pointer`}
            >
              <div className="text-3xl pr-2">
                <RiHotelFill />
              </div>
              <p className="font-bold">Hotels</p>
            </Link>
            <Link
              to={`/admin/${id}/verifyVendorsLists`}
              className={`${isActive(
                `/admin/${id}/verifyVendorsLists`
              )} flex items-center m-2 hover:text-black duration-300 p-2 rounded-[10px] cursor-pointer`}
            >
              <div className="text-3xl pr-2">
                <RiHotelFill />
              </div>
              <p className="font-bold">Verify Hotels</p>
            </Link>
            <Link
              to={`/admin/${id}/allTransactions`}
              className={`${isActive(
                `/admin/${id}/allTransactions`
              )} flex items-center m-2 hover:text-black duration-300  p-2 rounded-[10px] cursor-pointer`}
            >
              <div className="text-3xl pr-2">
                <FaCoins />
              </div>
              <p className="font-bold">Transactions</p>
            </Link>
            {/* <Link
              to={`/admin/${id}/allAmenities`}
              className={`${isActive(
                `/admin/${id}/AllAmenities`
              )} flex items-center m-2 hover:text-black duration-300 p-2 rounded-[10px] cursor-pointer`}
            >
              <div className="text-3xl pr-2">
                <MdRoomService />
              </div>
              <p className="font-bold"> Amenities</p>
            </Link> */}
            {/* <Link
              to={`/admin/${id}/allBedTypes`}
              className={`${isActive(
                `/admin/${id}/allBedTypes`
              )} flex items-center m-2 hover:text-black duration-300  p-2 rounded-[10px] cursor-pointer`}
            >
              <div className="text-3xl pr-2">
                <IoBedSharp />
              </div>
              <p className="font-bold"> Bed Types</p>
            </Link> */}
            <Link
              to={`/admin/${id}/allUsers`}
              className={`${isActive(
                `/admin/${id}/allUsers`
              )} flex items-center m-2 hover:text-black duration-300 p-2 rounded-[10px] cursor-pointer`}
            >
              <div className="text-3xl pr-2">
                <BsFillPeopleFill />
              </div>
              <p className="font-bold">Users</p>
            </Link>
            <Link
              to={`/admin/${id}/blogLists`}
              className={`${isActive(
                `/admin/${id}/blogLists`
              )} flex items-center m-2 hover:text-black duration-300 p-2 rounded-[10px] cursor-pointer`}
            >
              <div className="text-3xl pr-2">
                <FaBloggerB />
              </div>
              <p className="font-bold">Blogs</p>
            </Link>
            <Link
              to={`/supportChatLists/${id}`}
              className={`${isActive(
                `/supportChatLists/${id}`
              )} flex items-center m-2 hover:text-black duration-300 p-2 rounded-[10px] cursor-pointer`}
            >
              <div className="text-3xl pr-2">
                <BsChatDotsFill />
              </div>
              <p className="font-bold">Support Chat</p>
            </Link>
          </div>
        </div>
        <div className="col-span-5 ">
          <div className="flex sticky top-0 justify-end p-2 items-center  border z-40 bg-white">
            <Menu>
              <Menu.Button>
                <div className="flex items-center gap-4 mr-10 ">
                  <img
                    className="w-12 rounded-full h-12 object-cover"
                    src={profile_picture}
                  ></img>
                  <div className="flex flex-col  text-xs items-start">
                    <p className="text-violet-950 font-bold ">Administrator</p>
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
          {children}
        </div>
      </div>
    </div>
  );
}
