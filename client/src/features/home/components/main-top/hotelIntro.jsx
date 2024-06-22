import { Fragment, useEffect, useRef, useState } from "react";
import { DateRange } from "react-date-range";
import { CiLocationOn } from "react-icons/ci";
import { MdDateRange } from "react-icons/md";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css";
import { useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { GrLocation } from "react-icons/gr";
import { IoCalendarOutline } from "react-icons/io5";

export default function HotelIntro() {
  const [showAnimation, setShowAnimation] = useState(false);
  const [openDates, setOpenDates] = useState(false);
  const dialogRef = useRef(null);
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState("Pokhara"); // Default location

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: tomorrow, // Change this to the current date
      key: "selection",
    },
  ]);

  useEffect(() => {
    // Delay the animation for a short period to ensure the page has rendered
    setTimeout(() => {
      setShowAnimation(true);
    }, 1000);
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setOpenDates(false); // Close the dialog if it's open
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOpenDates = () => {
    setOpenDates(true);
  };

  const handleSelectDates = (ranges) => {
    setDates([ranges.selection]);
  };

  const handleSubmit = () => {
    const params = new URLSearchParams();
    params.append("startDate", dates[0].startDate.toISOString());
    params.append("endDate", dates[0].endDate.toISOString());
    params.append("location", selectedLocation);
    navigate(`/filterHotels?${params.toString()}`);
  };

  const locations = ["Pokhara", "Kathmandu", "Lumbini", "Chitwan"];

  return (
    <div
      className={`flex flex-col justify-center items-center transition-opacity duration-1000 ease-in-out ${
        showAnimation ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className=" text-white  flex flex-col gap-2 justify-center items-center ">
        <p className="text-2xl sm:text-5xl font-bold">Best Hotels in Nepal</p>
        <p className="text-sm sm:text-md mt-1 ">
          Experiencing pure serinity and luxury in this enchantinge hotel room
        </p>
      </div>
      <div className="relative flex  justify-center gap-1 mt-3  rounded-md text-[12px] sm:text-xl ">
        <Menu as="div" className="relative w-[10rem]">
          <div>
            <Menu.Button className=" h-[72px] flex flex-col items-center justify-center  cursor-pointer w-full rounded-md   bg-white  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <div className="flex gap-2 items-center ">
                <GrLocation className="text-2xl" />
                <div className="flex flex-col">
                  <p>Location</p>
                  <p className="font-bold text-[16px]">{selectedLocation}</p>
                </div>
              </div>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {locations.map((location, index) => (
                <Menu.Item key={index}>
                  {({ active }) => (
                    <div
                      className={`${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      } block px-4 py-2 text-sm flex gap-2 items-center`}
                      onClick={() => setSelectedLocation(location)}
                    >
                      <CiLocationOn />
                      {location}
                    </div>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>

        <div
          className="p-2 flex items-center  gap-4 bg-white rounded-md cursor-pointer w-[380px]"
          onClick={handleOpenDates}
        >
          <div className="flex gap-2 items-center ">
            <IoCalendarOutline className="text-2xl" />
            <div className="flex flex-col">
              <p> Check-in-date</p>
              <p className="font-bold text-[16px]">
                {dates[0].startDate.toDateString()}
              </p>
            </div>
          </div>
          <span className="border-t-2 border-t-black px-[10px]"></span>
          <div className="flex items-center">
            {/* <MdDateRange /> */}
            <div className="flex flex-col">
              <p> Check-out-date</p>
              <p className="font-bold text-[16px]">
                {dates[0].endDate.toDateString()}
              </p>
            </div>
          </div>
        </div>

        {openDates && (
          <div
            className="absolute   right-[185px] top-[75px] z-30 "
            ref={dialogRef}
          >
            <DateRange
              ranges={dates}
              onChange={handleSelectDates}
              className="rounded-lg border-2 w-full"
              minDate={new Date()}
            />
          </div>
        )}

        {/* <div className="p-2 sm:pr-10 bg-white rounded-md ">
            <div className="flex gap-2 items-center">
              <BiBed />
              <div className="flex flex-col">
                <p>Guests & Rooms</p>
                <p className="font-bold">2 Guests, 1 Room</p>
              </div>
            </div>
          </div> */}
        <div
          className="p-3 bg-violet-950 text-white justify-center w-[10rem] rounded-md flex  items-center font-bold cursor-pointer hover:bg-opacity-70 duration-300"
          onClick={handleSubmit}
        >
          <p>Search</p>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}
