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
      className={`flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 transition-opacity duration-1000 ease-in-out ${
        showAnimation ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="text-white flex flex-col gap-3 sm:gap-4 justify-center items-center text-center">
        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
          Best Hotels in Nepal
        </p>
        <p className="text-sm sm:text-base md:text-lg mt-1 max-w-2xl">
          Experiencing pure serenity and luxury in this enchanting hotel room
        </p>
      </div>
      <div className="relative flex flex-col md:flex-row justify-center items-center gap-2 sm:gap-3 mt-6 sm:mt-8 w-full max-w-4xl">
        <Menu as="div" className="relative w-full md:w-auto">
          <div>
            <Menu.Button className="h-16 sm:h-[72px] flex flex-col items-center justify-center cursor-pointer w-full md:w-[10rem] lg:w-[12rem] rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
              <div className="flex gap-2 items-center px-3">
                <GrLocation className="text-lg sm:text-2xl flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">Location</p>
                  <p className="font-bold text-sm sm:text-base text-black truncate">
                    {selectedLocation}
                  </p>
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
            <Menu.Items className="absolute left-0 md:right-0 mt-2 w-full md:w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-40 max-h-60 overflow-y-auto">
              {locations.map((location, index) => (
                <Menu.Item key={index}>
                  {({ active }) => (
                    <div
                      className={`${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      } block px-4 py-3 text-sm flex gap-2 items-center cursor-pointer hover:bg-gray-50 transition-colors min-h-[44px]`}
                      onClick={() => setSelectedLocation(location)}
                    >
                      <CiLocationOn className="flex-shrink-0 text-lg" />
                      <span className="truncate">{location}</span>
                    </div>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>

        <div
          className="p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-white rounded-md cursor-pointer w-full md:flex-1 md:max-w-md lg:max-w-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={handleOpenDates}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleOpenDates()}
        >
          <div className="flex gap-2 items-center flex-1 min-w-0 w-full sm:w-auto">
            <IoCalendarOutline className="text-lg sm:text-2xl flex-shrink-0 text-gray-600" />
            <div className="flex flex-col min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Check-in date</p>
              <p className="font-bold text-sm sm:text-base text-black truncate">
                {dates[0].startDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="hidden sm:block border-l-2 border-gray-300 h-8"></div>
          <div className="w-full h-px bg-gray-300 sm:hidden"></div>
          <div className="flex items-center flex-1 min-w-0 w-full sm:w-auto">
            <div className="flex flex-col min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Check-out date</p>
              <p className="font-bold text-sm sm:text-base text-black truncate">
                {dates[0].endDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {openDates && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 md:absolute md:inset-auto md:bg-transparent md:p-0 md:top-[75px] md:right-0 md:left-auto"
            ref={dialogRef}
          >
            <div className="bg-white rounded-lg shadow-xl border p-2 max-w-full overflow-hidden">
              <DateRange
                ranges={dates}
                onChange={handleSelectDates}
                className="rounded-lg w-full"
                minDate={new Date()}
                responsive={true}
                showMonthAndYearPickers={false}
              />
            </div>
          </div>
        )}

        <div
          className="p-3 sm:p-4 bg-violet-950 text-white justify-center w-full md:w-auto md:min-w-[8rem] lg:min-w-[10rem] rounded-md flex items-center font-bold cursor-pointer hover:bg-opacity-80 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 active:scale-95"
          onClick={handleSubmit}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        >
          <p className="text-sm sm:text-base">Search</p>
        </div>
      </div>
    </div>
  );
}
