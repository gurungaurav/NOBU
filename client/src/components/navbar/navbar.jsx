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
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { convertSpacesToUnderscores } from "../../utils/convertURL";
import { getOneHotel } from "../../services/vendor/vendor.service";
import { checkNoti } from "../../services/client/user.service";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hotel_name, setHotel] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false); // State variable for controlling the drawer

  const [notiCounts, setNotiCounts] = useState(0);
  const [navbarClick, setNavbarClick] = useState("home");

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0); // going to set this value on mouse move
  // rotate the tooltip
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
  // translate the tooltip
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );
  const handleMouseMove = (event) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
  };

  const { id, profile_picture, role, name, jwt } = useSelector(
    (state) => state.user
  );

  const [hoveredIndexTabs, setHoveredIndexTabs] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndexTabs(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndexTabs(null);
  };

  const handleScroll = () => {
    const offset = window.scrollY;

    if (offset > 400) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  const handleUpdateStatusClick = () => {
    console.log("jsjsj");
    setDrawerOpen(true); // Open the drawer when "Update Status" is clicked
  };

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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [width] = useWindow();

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

  const checkNotifi = async () => {
    try {
      const res = await checkNoti(id);
      console.log(res.data);
      setNotiCounts(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getSpecificHotel();
    checkNotifi();
    findCurrentPage();
    scrollToTop();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const parsedName = convertSpacesToUnderscores(hotel_name);

  return (
    <>
      <div
        className={`flex px-10  sm:p-4 font-semibold justify-between  sm:justify-around  text-white items-center sticky top-0 z-40  ${
          navbarClick != "home" && "bg-black"
        } `}
        style={{
          backgroundColor:
            navbarClick === "home" && (isScrolled ? "black" : "transparent"),
          transition:
            navbarClick === "home" && "background-color 0.7s ease-in-out",
        }}
      >
        <div className="w-14 h-14 cursor-pointer" onClick={() => navigate("/")}>
          <img className="w-full h-full" src={nobu} />
        </div>
        {width <= 625 ? (
          <div className="text-4xl " onClick={handleUpdateStatusClick}>
            <IoReorderThreeOutline />
          </div>
        ) : (
          <>
            <div className="flex justify-between gap-10">
              <Link
                to={"/"}
                className={`${
                  navbarClick === "home"
                    ? "border-b-2 border-b-violet-900 text-violet-900 "
                    : hoveredIndexTabs === 0
                    ? "link-border link-border-active text-violet-900 "
                    : "link-border"
                } duration-300`}
                onMouseEnter={() => handleMouseEnter(0)}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className="p-1 cursor-pointer "
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
                    : "link-border"
                } duration-300`}
                onMouseEnter={() => handleMouseEnter(1)}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className="p-1 cursor-pointer"
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
                    : "link-border"
                } duration-300`}
                onMouseEnter={() => handleMouseEnter(2)}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className="p-1 cursor-pointer"
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
                    : "link-border"
                } duration-300`}
                onMouseEnter={() => handleMouseEnter(3)}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className="p-1 cursor-pointer"
                  onClick={() => setNavbarClick("listYourProperty")}
                >
                  <p>List my hotel</p>
                </div>
              </Link>
            </div>

            <div className="flex font-semibold items-center gap-4">
              {id ? (
                <Menu as="div" className="relative inline-block text-left">
                  <div
                    onMouseEnter={() => setHoveredIndex(id)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Menu.Button className="rounded-full border border-gray-500 w-12 h-12 flex items-center justify-center relative">
                      <AnimatePresence>
                        {hoveredIndex && (
                          <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.6 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              scale: 1,
                              transition: {
                                type: "spring",
                                stiffness: 260,
                                damping: 10,
                              },
                            }}
                            exit={{ opacity: 0, y: 20, scale: 0.6 }}
                            style={{
                              translateX: translateX,
                              rotate: rotate,
                              whiteSpace: "nowrap",
                            }}
                            className="absolute -top-5 -right-16 transform -translate-x-1/2 flex text-xs flex-col items-center justify-center rounded-md bg-black z-50 shadow-xl px-4 py-2 whitespace-nowrap text-white"
                          >
                            <div className="font-semibold text-white relative z-30 text-xs">
                              <p> {name}</p>
                              {role}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <img
                        onMouseMove={handleMouseMove}
                        className="rounded-full w-full h-full object-cover !m-0 !p-0 object-top border relative transition duration-500 "
                        src={profile_picture}
                        alt="Profile"
                      />
                      {notiCounts > 0 && (
                        <div class="px-2 py-[2px] bg-red-500 rounded-full text-center text-white text-sm absolute -top-2 -end-2">
                          <p>{notiCounts}</p>
                          <div class="absolute top-0 start-0 rounded-full -z-10 animate-ping bg-teal-200 w-full h-full"></div>
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
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {role === "vendor" && (
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to={`/vendor/${parsedName}/vendorDashBoard`}
                              className={`${
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700"
                              } flex items-center gap-2 px-4 py-2 text-sm`}
                            >
                              <MdDashboard className="text-lg" />
                              Dashboard
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
                              } flex items-center gap-2 px-4 py-2 text-sm`}
                            >
                              <MdDashboard className="text-lg" />
                              Dashboard
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
                            } flex items-center gap-2 px-4 py-2 text-sm`}
                          >
                            <CgProfile className="text-lg" />
                            Profile
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
                            } flex items-center gap-2 px-4 py-2 text-sm`}
                          >
                            <MdHistory className="text-xl" />
                            My Bookings
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
                            } flex items-center px-4 py-2 text-sm gap-2`}
                          >
                            <div class="relative">
                              <svg
                                class="w-5 h-5 text-black-600 animate-wiggle"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 21 21"
                              >
                                <path
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M15.585 15.5H5.415A1.65 1.65 0 0 1 4 13a10.526 10.526 0 0 0 1.5-5.415V6.5a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1.085c0 1.907.518 3.78 1.5 5.415a1.65 1.65 0 0 1-1.415 2.5zm1.915-11c-.267-.934-.6-1.6-1-2s-1.066-.733-2-1m-10.912 3c.209-.934.512-1.6.912-2s1.096-.733 2.088-1M13 17c-.667 1-1.5 1.5-2.5 1.5S8.667 18 8 17"
                                />
                              </svg>
                              <div class="px-2 py[2px] bg-red-500 rounded-full text-center text-white text-[10px] absolute -top-3 -end-3">
                                {notiCounts > 0 && notiCounts}
                                <div class="absolute top-0 start-0 rounded-full -z-10 animate-ping bg-red-200 w-full h-full"></div>
                              </div>
                            </div>
                            Notifications
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
                            } flex items-center gap-2  px-4 py-2 text-sm cursor-pointer`}
                          >
                            <CiLogout className="text-xl" />
                            Logout
                          </div>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <Menu as="div" className="relative inline-block text-left ">
                  <div className="">
                    <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
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
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to={"/register"}
                            className={`${
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700"
                            } block px-4 py-2 text-sm`}
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
                            } block px-4 py-2 text-sm`}
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
      >
        <div
          style={{ width: 200 }}
          className="flex flex-col justify-between  h-full"
        >
          <div className="flex flex-col  gap-4 mt-10 ml-2 font-bold">
            <Link
              to={"/"}
              className={`${navbarClick === "home" ? " text-violet-900" : ""} `}
            >
              <div
                className="p-1 cursor-pointer "
                onClick={() => setNavbarClick("home")}
              >
                <p>Home</p>
              </div>
            </Link>
            <Link
              to={"/filterHotels"}
              className={`${
                navbarClick === "hotels" ? " text-violet-900" : ""
              } `}
            >
              <div
                className="p-1 cursor-pointer"
                onClick={() => setNavbarClick("hotels")}
              >
                <p>Hotels</p>
              </div>
            </Link>
            <Link
              to={"/blogs"}
              className={`${
                navbarClick === "blogs" ? " text-violet-900" : ""
              } `}
            >
              <div
                className="p-1 cursor-pointer"
                onClick={() => setNavbarClick("blogs")}
              >
                <p>Blogs</p>
              </div>
            </Link>
            <Link
              to={"/listYourProperty"}
              className={`${
                navbarClick === "listYourProperty" ? " text-violet-900" : ""
              } `}
            >
              <div
                className="p-1 cursor-pointer"
                onClick={() => setNavbarClick("listYourProperty")}
              >
                <p>List my hotel</p>
              </div>
            </Link>
          </div>
          {id && (
            <div
              className="ml-2 font-bold mb-4 cursor-pointer"
              onClick={() => dispatch(clearData())}
            >
              <p>LogOut</p>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
}
