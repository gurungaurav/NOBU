import React, { useEffect, useState } from "react";
import useWindow from "../../hooks/useWindowHook";
import nobu from "../../assets/Nobu.png";
import { Menu, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearData } from "../../redux/slice/userSlice";
import { MdHistory } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { MdDashboard } from "react-icons/md";
import { IoReorderThreeOutline } from "react-icons/io5";
import "./navbar.css";
import Drawer from "@mui/material/Drawer";
import { convertSpacesToUnderscores } from "../../utils/convertURL";
import { getOneHotel } from "../../services/vendor/vendor.service";
import { checkNoti } from "../../services/client/user.service";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hotel_name, setHotel] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false); // State variable for controlling the drawer

  const [notiCounts, setNotiCounts] = useState(0);
  const [navbarClick, setNavbarClick] = useState("home");

  const { id, profile_picture, role, name } = useSelector(
    (state) => state.user
  );
  console.log("User ID:", id, "Role:", role, "Name:", name);

  const [hoveredIndexTabs, setHoveredIndexTabs] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndexTabs(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndexTabs(null);
  };

  const handleUpdateStatusClick = () => {
    setDrawerOpen(true); // Open the drawer when "Update Status" is clicked
  };

  const handleScroll = () => {
    const offset = window.scrollY;

    if (offset > 400) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [width] = useWindow();

  //!Get hotel from vendor_id
  const getSpecificHotel = async () => {
    try {
      const res = await getOneHotel(id);
      setHotel(res.data.data.hotel_name);
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const checkNotifi = async () => {
    try {
      const res = await checkNoti(id);
      console.log(res.data);
      setNotiCounts(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  //!Function to know on which page the current user is it is necessary because if i dont use this then when i re render the components or page
  //!Then the location shown on the navbar like the color change of the page will be again the same so this will be used
  const pathname = location.pathname;
  const findCurrentPage = () => {
    if (pathname === "/") {
      setNavbarClick("home");
    } else if (
      /^\/mainHotel\//.test(pathname) ||
      pathname === "/filterHotels"
    ) {
      setNavbarClick("hotels");
    } else if (/^\/blogs\//.test(pathname) || pathname === "/blogs") {
      setNavbarClick("blogs");
    } else if (pathname === "/hotelReg") {
      setNavbarClick("hotelReg");
    } else if (pathname === "/listYourProperty") {
      setNavbarClick("listYourProperty");
    } else {
      setNavbarClick("others");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (id) {
      getSpecificHotel();
      checkNotifi();
    }
    findCurrentPage();
    scrollToTop();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, id]);

  const parsedName = convertSpacesToUnderscores(hotel_name);

  return (
    <>
      <div
        className={`flex px-4 sm:px-10 lg:px-20 py-3 md:py-6 font-semibold justify-between items-center sticky top-0 z-40 ${
          navbarClick != "home" && "bg-black"
        } `}
        style={{
          backgroundColor:
            navbarClick === "home" && (isScrolled ? "black" : "transparent"),
          transition:
            navbarClick === "home" && "background-color 0.7s ease-in-out",
        }}
      >
        <div
          className="w-12 h-12 sm:w-14 sm:h-14 cursor-pointer flex-shrink-0"
          onClick={() => navigate("/")}
        >
          <img className="w-full h-full" src={nobu} alt="Nobu Logo" />
        </div>
        {width <= 768 ? (
          <div
            className="text-3xl sm:text-4xl text-white"
            onClick={handleUpdateStatusClick}
          >
            <IoReorderThreeOutline />
          </div>
        ) : (
          <>
            <div className="hidden md:flex justify-center gap-6 lg:gap-8 xl:gap-10 flex-1 max-w-2xl mx-8">
              <Link
                to={"/"}
                className={`${
                  navbarClick === "home"
                    ? "border-b-2 border-b-violet-900 text-violet-900 "
                    : hoveredIndexTabs === 0
                    ? "link-border link-border-active text-violet-900 "
                    : "link-border text-white"
                } duration-300 transition-colors hover:text-violet-300`}
                onMouseEnter={() => handleMouseEnter(0)}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className="p-2 cursor-pointer text-sm lg:text-base"
                  onClick={() => setNavbarClick("home")}
                >
                  <p>Home</p>
                </div>
              </Link>
              <Link
                to={"/filterHotels"}
                className={`${
                  navbarClick === "hotels"
                    ? "border-b-2 border-b-violet-900 text-violet-900 "
                    : hoveredIndexTabs === 1
                    ? "link-border link-border-active text-violet-900 "
                    : "link-border text-white"
                } duration-300 transition-colors hover:text-violet-300`}
                onMouseEnter={() => handleMouseEnter(1)}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className="p-2 cursor-pointer text-sm lg:text-base"
                  onClick={() => setNavbarClick("hotels")}
                >
                  <p>Hotels</p>
                </div>
              </Link>

              <Link
                to={"/blogs"}
                className={`${
                  navbarClick === "blogs"
                    ? "border-b-2 border-b-violet-900 text-violet-900 "
                    : hoveredIndexTabs === 2
                    ? "link-border link-border-active text-violet-900 "
                    : "link-border text-white"
                } duration-300 transition-colors hover:text-violet-300`}
                onMouseEnter={() => handleMouseEnter(2)}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className="p-2 cursor-pointer text-sm lg:text-base"
                  onClick={() => setNavbarClick("blogs")}
                >
                  <p>Blogs</p>
                </div>
              </Link>

              <Link
                to={"/listYourProperty"}
                className={`${
                  navbarClick === "listYourProperty"
                    ? "border-b-2 border-b-violet-900 text-violet-900 "
                    : hoveredIndexTabs === 3
                    ? "link-border link-border-active text-violet-900 "
                    : "link-border text-white"
                } duration-300 transition-colors hover:text-violet-300`}
                onMouseEnter={() => handleMouseEnter(3)}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className="p-2 cursor-pointer text-sm lg:text-base whitespace-nowrap"
                  onClick={() => setNavbarClick("listYourProperty")}
                >
                  <p>List my hotel</p>
                </div>
              </Link>
            </div>

            <div className="flex font-semibold items-center gap-2 sm:gap-4 flex-shrink-0">
              {id ? (
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="rounded-full border border-gray-500 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center relative hover:border-violet-300 transition-colors">
                      <img
                        className="rounded-full w-full h-full object-cover !m-0 !p-0 object-top border relative transition duration-500"
                        src={profile_picture}
                        alt="Profile"
                      />
                      {notiCounts > 0 && (
                        <div className="px-1.5 sm:px-2 py-[1px] sm:py-[2px] bg-red-500 rounded-full text-center text-white text-xs sm:text-sm absolute -top-1 sm:-top-2 -end-1 sm:-end-2 min-w-[18px] sm:min-w-[20px]">
                          <p>{notiCounts > 99 ? "99+" : notiCounts}</p>
                          <div className="absolute top-0 start-0 rounded-full -z-10 animate-ping bg-red-200 w-full h-full"></div>
                        </div>
                      )}
                    </Menu.Button>
                  </div>
                  <Transition
                    as={React.Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 sm:w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {role === "vendor" && (
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to={`/vendor/${parsedName}/vendorDashBoard`}
                              className={`${
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700"
                              } flex items-center gap-2 px-3 sm:px-4 py-2 text-sm hover:bg-gray-50 transition-colors`}
                            >
                              <MdDashboard className="text-lg flex-shrink-0" />
                              <span className="truncate">Dashboard</span>
                            </Link>
                          )}
                        </Menu.Item>
                      )}
                      {role === "admin" && (
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to={`/admin/${id}/adminDash`}
                              className={`${
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700"
                              } flex items-center gap-2 px-3 sm:px-4 py-2 text-sm hover:bg-gray-50 transition-colors`}
                            >
                              <MdDashboard className="text-lg flex-shrink-0" />
                              <span className="truncate">Dashboard</span>
                            </Link>
                          )}
                        </Menu.Item>
                      )}
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to={`/profile/${id}`}
                            className={`${
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700"
                            } flex items-center gap-2 px-3 sm:px-4 py-2 text-sm hover:bg-gray-50 transition-colors`}
                          >
                            <CgProfile className="text-lg flex-shrink-0" />
                            <span className="truncate">Profile</span>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to={`/userHistory`}
                            className={`${
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700"
                            } flex items-center gap-2 px-3 sm:px-4 py-2 text-sm hover:bg-gray-50 transition-colors`}
                          >
                            <MdHistory className="text-xl flex-shrink-0" />
                            <span className="truncate">My Bookings</span>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to={`/userNotifications`}
                            className={`${
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700"
                            } flex items-center px-3 sm:px-4 py-2 text-sm gap-2 hover:bg-gray-50 transition-colors`}
                          >
                            <div className="relative flex-shrink-0">
                              <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 text-black-600 animate-wiggle"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 21 21"
                              >
                                <path
                                  fill="none"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.585 15.5H5.415A1.65 1.65 0 0 1 4 13a10.526 10.526 0 0 0 1.5-5.415V6.5a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1.085c0 1.907.518 3.78 1.5 5.415a1.65 1.65 0 0 1-1.415 2.5zm1.915-11c-.267-.934-.6-1.6-1-2s-1.066-.733-2-1m-10.912 3c.209-.934.512-1.6.912-2s1.096-.733 2.088-1M13 17c-.667 1-1.5 1.5-2.5 1.5S8.667 18 8 17"
                                />
                              </svg>
                              {notiCounts > 0 && (
                                <div className="px-1 py-[1px] bg-red-500 rounded-full text-center text-white text-[8px] sm:text-[10px] absolute -top-2 -end-2 min-w-[12px] sm:min-w-[14px]">
                                  {notiCounts > 99 ? "99+" : notiCounts}
                                  <div className="absolute top-0 start-0 rounded-full -z-10 animate-ping bg-red-200 w-full h-full"></div>
                                </div>
                              )}
                            </div>
                            <span className="truncate">Notifications</span>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            onClick={() => dispatch(clearData())}
                            className={`${
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700"
                            } flex items-center gap-2 px-3 sm:px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors`}
                          >
                            <CiLogout className="text-xl flex-shrink-0" />
                            <span className="truncate">Logout</span>
                          </div>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <Menu as="div" className="relative inline-block text-left">
                  <div className="">
                    <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-3 sm:px-4 py-2 bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors whitespace-nowrap">
                      Sign in or Join
                    </Menu.Button>
                  </div>
                  <Transition
                    as={React.Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-40 sm:w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to={"/register"}
                            className={`${
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700"
                            } block px-3 sm:px-4 py-2 text-sm hover:bg-gray-50 transition-colors`}
                          >
                            Sign Up
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to={"/login"}
                            className={`${
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700"
                            } block px-3 sm:px-4 py-2 text-sm hover:bg-gray-50 transition-colors`}
                          >
                            Login
                          </Link>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              )}
            </div>
          </>
        )}
      </div>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        className="md:hidden"
      >
        <div
          style={{ width: 250 }}
          className="flex flex-col justify-between h-full bg-white"
        >
          <div className="flex flex-col gap-4 mt-8 ml-4 font-bold">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="w-10 h-10">
                <img className="w-full h-full" src={nobu} alt="Nobu Logo" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            </div>

            <Link
              to={"/"}
              className={`${
                navbarClick === "home"
                  ? "text-violet-900 bg-violet-50"
                  : "text-gray-700 hover:bg-gray-50"
              } p-3 rounded-lg transition-colors`}
              onClick={() => {
                setNavbarClick("home");
                setDrawerOpen(false);
              }}
            >
              <p>Home</p>
            </Link>

            <Link
              to={"/filterHotels"}
              className={`${
                navbarClick === "hotels"
                  ? "text-violet-900 bg-violet-50"
                  : "text-gray-700 hover:bg-gray-50"
              } p-3 rounded-lg transition-colors`}
              onClick={() => {
                setNavbarClick("hotels");
                setDrawerOpen(false);
              }}
            >
              <p>Hotels</p>
            </Link>

            <Link
              to={"/blogs"}
              className={`${
                navbarClick === "blogs"
                  ? "text-violet-900 bg-violet-50"
                  : "text-gray-700 hover:bg-gray-50"
              } p-3 rounded-lg transition-colors`}
              onClick={() => {
                setNavbarClick("blogs");
                setDrawerOpen(false);
              }}
            >
              <p>Blogs</p>
            </Link>

            <Link
              to={"/listYourProperty"}
              className={`${
                navbarClick === "listYourProperty"
                  ? "text-violet-900 bg-violet-50"
                  : "text-gray-700 hover:bg-gray-50"
              } p-3 rounded-lg transition-colors`}
              onClick={() => {
                setNavbarClick("listYourProperty");
                setDrawerOpen(false);
              }}
            >
              <p>List my hotel</p>
            </Link>

            {/* User Profile Section in Mobile Drawer */}
            {id && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <img
                    className="w-10 h-10 rounded-full object-cover border-2 border-violet-200"
                    src={profile_picture}
                    alt="Profile"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{role}</p>
                  </div>
                  {notiCounts > 0 && (
                    <div className="px-2 py-1 bg-red-500 rounded-full text-white text-xs min-w-[20px] text-center">
                      {notiCounts > 99 ? "99+" : notiCounts}
                    </div>
                  )}
                </div>

                {/* Mobile Menu Items */}
                {role === "vendor" && (
                  <Link
                    to={`/vendor/${parsedName}/vendorDashBoard`}
                    className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setDrawerOpen(false)}
                  >
                    <MdDashboard className="text-lg text-violet-600" />
                    <span>Dashboard</span>
                  </Link>
                )}

                {role === "admin" && (
                  <Link
                    to={`/admin/${id}/adminDash`}
                    className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setDrawerOpen(false)}
                  >
                    <MdDashboard className="text-lg text-violet-600" />
                    <span>Dashboard</span>
                  </Link>
                )}

                <Link
                  to={`/profile/${id}`}
                  className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setDrawerOpen(false)}
                >
                  <CgProfile className="text-lg text-violet-600" />
                  <span>Profile</span>
                </Link>

                <Link
                  to={`/userHistory`}
                  className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setDrawerOpen(false)}
                >
                  <MdHistory className="text-lg text-violet-600" />
                  <span>My Bookings</span>
                </Link>

                <Link
                  to={`/userNotifications`}
                  className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setDrawerOpen(false)}
                >
                  <div className="relative">
                    <svg
                      className="w-5 h-5 text-violet-600"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 21 21"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.585 15.5H5.415A1.65 1.65 0 0 1 4 13a10.526 10.526 0 0 0 1.5-5.415V6.5a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1.085c0 1.907.518 3.78 1.5 5.415a1.65 1.65 0 0 1-1.415 2.5zm1.915-11c-.267-.934-.6-1.6-1-2s-1.066-.733-2-1m-10.912 3c.209-.934.512-1.6.912-2s1.096-.733 2.088-1M13 17c-.667 1-1.5 1.5-2.5 1.5S8.667 18 8 17"
                      />
                    </svg>
                    {notiCounts > 0 && (
                      <div className="px-1 py-[1px] bg-red-500 rounded-full text-center text-white text-[8px] absolute -top-2 -end-2 min-w-[12px]">
                        {notiCounts > 99 ? "99+" : notiCounts}
                      </div>
                    )}
                  </div>
                  <span>Notifications</span>
                </Link>
              </div>
            )}

            {/* Auth Links for Non-logged Users */}
            {!id && (
              <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                <Link
                  to={"/login"}
                  className="block w-full text-center bg-violet-950 text-white py-3 rounded-lg font-semibold hover:bg-violet-900 transition-colors"
                  onClick={() => setDrawerOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to={"/register"}
                  className="block w-full text-center border-2 border-violet-950 text-violet-950 py-3 rounded-lg font-semibold hover:bg-violet-50 transition-colors"
                  onClick={() => setDrawerOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Logout Button */}
          {id && (
            <div className="p-4 border-t border-gray-200">
              <button
                className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold"
                onClick={() => {
                  dispatch(clearData());
                  setDrawerOpen(false);
                }}
              >
                <CiLogout className="text-xl" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
}
