import { Fragment, useEffect, useRef, useState } from "react";
import { MdStar } from "react-icons/md";
import { getHotelsFilter } from "../../../services/client/user.service";
import { BiCheck } from "react-icons/bi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Listbox, Transition } from "@headlessui/react";
import { LuChevronsUpDown } from "react-icons/lu";
import PropTypes from "prop-types";
import "../../../global/css/scrollbar.css";
import { useLocation, useNavigate } from "react-router-dom";
import { FaFilter, FaTimes } from "react-icons/fa";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import TextField from "@mui/material/TextField";

export default function HotelsSearchResponsive({
  onFilterChange,
  handleFilters,
  ratings,
  amenities,
  selectedLocation,
  onMobileClose,
}) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState(
    queryParams.get("searchName") || ""
  );

  // List of amenities to display
  const amenitiesList = [
    "Swimming Pool",
    "Wi-Fi",
    "TV",
    "Bar",
    "Gym",
    "A/C",
    "Parking",
    "24-Hour Room Service",
    "24-Hour Front Desk",
    "Laundry Services",
    "Pet-Friendly Accommodations",
  ];

  // List of locations
  const locations = [
    { name: "Pokhara" },
    { name: "Chitwan" },
    { name: "Kathmandu" },
    { name: "Butwal" },
  ];

  // Toggle states for filter sections
  const [showAllAmen, setShowAllAmen] = useState(true);
  const [showAllAvailabilty, setShowAllAvailabilty] = useState(true);
  const [showAllRatings, setShowAllRatings] = useState(true);
  const [showAllLocations, setShowAllLocations] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const dialogRef = useRef(null);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Date range handling
  const initialDateRange =
    queryParams.getAll("startDate").length > 0 &&
    queryParams.getAll("endDate").length > 0
      ? {
          startDate: new Date(queryParams.getAll("startDate")),
          endDate: new Date(queryParams.getAll("endDate")),
          key: "selection",
        }
      : {
          startDate: new Date(),
          endDate: tomorrow,
          key: "selection",
        };

  const [dateRange, setDateRange] = useState([initialDateRange]);
  const [dates, setDates] = useState(
    queryParams.getAll("startDate").length > 0 &&
      queryParams.getAll("endDate").length > 0
      ? [dateRange[0].startDate, dateRange[0].endDate]
      : []
  );

  // Search filter handler
  const handleSearchFilter = (e) => {
    setSearchName(e.target.value);
    queryParams.set("searchName", e.target.value);
    navigate(`/filterHotels?${queryParams.toString()}`);
  };

  // Search function
  const search = async () => {
    const params = new URLSearchParams();

    amenities.forEach((amenity) => {
      if (amenity) {
        params.append("amenities", amenity);
      }
    });

    if (ratings) {
      params.append("ratings", ratings);
    }
    if (selectedLocation !== "location") {
      params.append("location", selectedLocation);
    }

    if (dates && dates.length > 0 && dates[0] && dates[1]) {
      params.append("startDate", dates[0].toISOString());
      params.append("endDate", dates[1].toISOString());
    }

    if (searchName !== undefined || searchName !== "") {
      params.append("searchName", searchName);
    }

    try {
      const res = await getHotelsFilter(params);
      onFilterChange(res.data.data);
    } catch (e) {
      onFilterChange([]);
    }
  };

  useEffect(() => {
    if (
      ratings > 0 ||
      amenities.length > 0 ||
      selectedLocation !== "location" ||
      (dates && dates.length > 0 && dates[0] && dates[1]) ||
      searchName !== ""
    ) {
      search();
    }
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setIsDialogOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [amenities, ratings, selectedLocation, dates, searchName]);

  // Date handling functions
  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const handleAddDates = () => {
    if (dateRange.length > 0) {
      const [selectedDateRange] = dateRange;
      setDates([selectedDateRange.startDate, selectedDateRange.endDate]);
      setIsDialogOpen(false);
      queryParams.set("startDate", selectedDateRange.startDate.toISOString());
      queryParams.set("endDate", selectedDateRange.endDate.toISOString());
      navigate(`/filterHotels?${queryParams.toString()}`);
    }
  };

  const clearDates = () => {
    setDateRange([
      {
        startDate: new Date(),
        endDate: tomorrow,
        key: "selection",
      },
    ]);
    queryParams.delete("startDate");
    queryParams.delete("endDate");
    navigate(`/filterHotels?${queryParams.toString()}`);
  };

  const handleLocationFilterDelete = () => {
    queryParams.delete("location");
    navigate(`/filterHotels?${queryParams.toString()}`);
  };

  const clearAllFilters = () => {
    queryParams.forEach((_, key) => queryParams.delete(key));
    setDateRange([
      {
        startDate: new Date(),
        endDate: tomorrow,
        key: "selection",
      },
    ]);
    navigate(`/filterHotels`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 h-fit lg:sticky lg:top-24">
      {/* Header */}
      <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
        <div className="flex gap-2 items-center text-violet-950 font-bold text-lg sm:text-xl lg:text-2xl">
          <FaFilter className="text-lg sm:text-xl" />
          <h2>Filter by:</h2>
        </div>
        <div className="flex items-center gap-3">
          {queryParams.size > 0 && (
            <button
              className="text-violet-950 hover:text-violet-700 cursor-pointer text-sm font-medium border-b border-violet-950 hover:border-violet-700 transition-colors"
              onClick={clearAllFilters}
            >
              Reset All
            </button>
          )}
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="lg:hidden p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            name="search"
            onChange={handleSearchFilter}
            value={searchName}
            className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all text-sm sm:text-base"
            placeholder="Search by hotel name..."
          />
        </div>
      </div>

      {/* Filters Container */}
      <div className="max-h-96 lg:max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
        {/* Availability Section */}
        <div className="border-b border-gray-200">
          <button
            className="w-full p-4 sm:p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
            onClick={() => setShowAllAvailabilty(!showAllAvailabilty)}
          >
            <h3 className="font-bold text-base sm:text-lg text-violet-950">
              Availability
            </h3>
            {showAllAvailabilty ? (
              <IoIosArrowUp className="text-lg text-violet-950" />
            ) : (
              <IoIosArrowDown className="text-lg text-violet-950" />
            )}
          </button>
          {showAllAvailabilty && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div
                className="mb-4 cursor-pointer"
                onClick={() => setIsDialogOpen(true)}
              >
                <TextField
                  variant="outlined"
                  className="w-full cursor-pointer"
                  value={`${dateRange[0].startDate.toDateString()} - ${dateRange[0].endDate.toDateString()}`}
                  size="small"
                />
              </div>
              <div className="flex justify-end">
                {queryParams.getAll("startDate")[0] ? (
                  <button
                    className="px-4 py-2 bg-violet-950 hover:bg-violet-800 text-white text-sm rounded-lg transition-colors"
                    onClick={clearDates}
                  >
                    Clear
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 bg-violet-950 hover:bg-violet-800 text-white text-sm rounded-lg transition-colors"
                    onClick={handleAddDates}
                  >
                    Select
                  </button>
                )}
              </div>
              {isDialogOpen && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 lg:absolute lg:inset-auto lg:bg-transparent lg:p-0 lg:top-full lg:left-0"
                  ref={dialogRef}
                >
                  <div className="bg-white rounded-lg shadow-xl max-w-full overflow-hidden">
                    <DateRange
                      ranges={dateRange}
                      minDate={new Date()}
                      onChange={handleSelect}
                      responsive={true}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Ratings Section */}
        <div className="border-b border-gray-200">
          <button
            className="w-full p-4 sm:p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
            onClick={() => setShowAllRatings(!showAllRatings)}
          >
            <h3 className="font-bold text-base sm:text-lg text-violet-950">
              Property Ratings
            </h3>
            {showAllRatings ? (
              <IoIosArrowUp className="text-lg text-violet-950" />
            ) : (
              <IoIosArrowDown className="text-lg text-violet-950" />
            )}
          </button>
          {showAllRatings && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3">
              {[1, 2, 3, 4, 5].map((rating) => (
                <label
                  key={rating}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <input
                    className="h-4 w-4 cursor-pointer accent-violet-950"
                    type="checkbox"
                    onChange={() => handleFilters(rating, "ratings")}
                    checked={ratings === rating}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{rating}</span>
                    <div className="flex">
                      {Array.from({ length: rating }).map((_, index) => (
                        <MdStar
                          key={index}
                          className="text-yellow-400 text-lg"
                        />
                      ))}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Locations Section */}
        <div className="border-b border-gray-200">
          <button
            className="w-full p-4 sm:p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
            onClick={() => setShowAllLocations(!showAllLocations)}
          >
            <h3 className="font-bold text-base sm:text-lg text-violet-950">
              Locations
            </h3>
            {showAllLocations ? (
              <IoIosArrowUp className="text-lg text-violet-950" />
            ) : (
              <IoIosArrowDown className="text-lg text-violet-950" />
            )}
          </button>
          {showAllLocations && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 relative">
              {selectedLocation !== "location" && (
                <button
                  onClick={handleLocationFilterDelete}
                  className="absolute top-0 right-4 text-violet-950 hover:text-violet-700 font-medium text-sm transition-colors"
                >
                  Clear
                </button>
              )}
              <Listbox
                value={selectedLocation}
                onChange={(value) => handleFilters(value, "location")}
              >
                <div className="relative">
                  <Listbox.Button className="relative cursor-pointer w-full rounded-lg bg-white py-3 pl-3 pr-10 text-left border border-gray-300 shadow-sm hover:border-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all">
                    <span className="block truncate text-sm sm:text-base">
                      {selectedLocation}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <LuChevronsUpDown className="h-5 w-5 text-gray-400" />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200">
                      {locations.map((location) => (
                        <Listbox.Option
                          key={location.name}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${
                              active
                                ? "bg-violet-950 text-white"
                                : "text-gray-900 hover:bg-gray-50"
                            }`
                          }
                          value={location.name}
                        >
                          <span
                            className={`block truncate ${
                              selectedLocation === location.name
                                ? "font-semibold"
                                : "font-normal"
                            }`}
                          >
                            {location.name}
                          </span>
                          {selectedLocation === location.name && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                              <BiCheck className="h-5 w-5" />
                            </span>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          )}
        </div>

        {/* Amenities Section */}
        <div>
          <button
            className="w-full p-4 sm:p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
            onClick={() => setShowAllAmen(!showAllAmen)}
          >
            <h3 className="font-bold text-base sm:text-lg text-violet-950">
              Amenities
            </h3>
            {showAllAmen ? (
              <IoIosArrowUp className="text-lg text-violet-950" />
            ) : (
              <IoIosArrowDown className="text-lg text-violet-950" />
            )}
          </button>
          {showAllAmen && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
              {amenitiesList.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer accent-violet-950"
                    onChange={() => handleFilters(amenity, "amenities")}
                    checked={amenities.includes(amenity)}
                  />
                  <span
                    className={`text-sm font-medium transition-colors ${
                      amenities.includes(amenity)
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {amenity}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

HotelsSearchResponsive.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  handleFilters: PropTypes.func.isRequired,
  ratings: PropTypes.number.isRequired,
  amenities: PropTypes.arrayOf(PropTypes.string),
  selectedLocation: PropTypes.string.isRequired,
  onMobileClose: PropTypes.func,
};
