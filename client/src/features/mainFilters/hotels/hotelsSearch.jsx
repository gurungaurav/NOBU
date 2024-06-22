import React, { Fragment, useEffect, useRef, useState } from "react";
import { MdStar } from "react-icons/md";
import { getHotelsFilter } from "../../../services/client/user.service";
import { BiCheck } from "react-icons/bi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import "rc-slider/assets/index.css"; // Import the CSS directly
import { Listbox, Transition } from "@headlessui/react";
import { LuChevronsUpDown } from "react-icons/lu";
import PropTypes from "prop-types";
import "../../../global/css/scrollbar.css";
import { useLocation, useNavigate } from "react-router-dom";
import { FaFilter } from "react-icons/fa6";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css";
import TextField from "@mui/material/TextField";

export default function HotelsSearch({
  onFilterChange,
  handleFilters,
  ratings,
  amenities,
  selectedLocation,
}) {
  const location = useLocation();
  //!Then query params is used to search the params
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

  const [additionalServices, setAdditionalServices] = useState([]);

  // //!It will store id of the particular additional services
  // const [selectedAdditionalServices, setSelectedAdditionalServices] = useState(
  //   () => {
  //     const servicesString = queryParams.get("additionalServices") || "";
  //     const servicesArray = servicesString
  //       .split(",")
  //       .map((item) => parseInt(item));
  //     return servicesArray.filter((item) => !isNaN(item));
  //   }
  // );

  //? List of locations
  const locations = [
    { name: "Pokhara" },
    { name: "Chitwan" },
    { name: "Kathmandu" },
    { name: "Butwal" },
  ];
  // To toggle the  buttons
  const [showAllAmen, setShowAllAmen] = useState(true);
  const [showAllAvailabilty, setShowAllAvailabilty] = useState(true);
  const [showAllPrices, setShowAllPrices] = useState(true);
  const [showAllRatings, setShowAllRatings] = useState(true);
  const [showAllLocations, setShowAllLocations] = useState(true);
  const [showAllAdditionalServices, setShowAllAdditionalServices] =
    useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog

  const dialogRef = useRef(null);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  //!This is used for displaying
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

  //!This will be used for submitting the dates
  const [dates, setDates] = useState(
    queryParams.getAll("startDate").length > 0 &&
      queryParams.getAll("endDate").length > 0
      ? [dateRange[0].startDate, dateRange[0].endDate]
      : []
  );

  //! For displaying the price ranges
  const [priceRange, setPriceRange] = useState([
    parseInt(queryParams.get("minPrice")) || 0,
    parseInt(queryParams.get("maxPrice")) || 10000,
  ]);

  //!For submitting the price ranges for filtering
  const [priceRanges, setPriceRanges] = useState(
    queryParams.get("minPrice") && queryParams.get("maxPrice")
      ? [priceRange[0], priceRange[1]]
      : []
  );

  // Function to handle search filter change
  const handleSearchFilter = (e) => {
    setSearchName(e.target.value);
    console.log(searchName);
    queryParams.set("searchName", e.target.value);
    navigate(`/filterHotels?${queryParams.toString()}`);
  };

  useEffect(() => {
    if (
      ratings > 0 ||
      amenities.length > 0 ||
      selectedLocation !== "location" ||
      (dates && dates.length > 0 && dates[0] && dates[1]) ||
      priceRanges.length > 0 ||
      // selectedAdditionalServices.length > 0 ||
      searchName !== ""
    ) {
      search();
    }
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setIsDialogOpen(false); // Close the dialog if it's open
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [amenities, ratings, selectedLocation, dates, priceRanges, searchName]);

  const search = async () => {
    const params = new URLSearchParams();

    // Loop through amenities and append if it exists
    amenities.forEach((amenity) => {
      if (amenity) {
        params.append("amenities", amenity);
      }
    });

    if (
      priceRanges &&
      priceRanges.length === 2 &&
      priceRanges[0] &&
      priceRanges[1]
    ) {
      params.append("minPrice", priceRanges[0]);
      params.append("maxPrice", priceRanges[1]);
    }

    if (ratings) {
      params.append("ratings", ratings);
    }
    if (selectedLocation != "location") {
      params.append("location", selectedLocation);
    }

    // // Loop through selected additional services and append if they exist
    // selectedAdditionalServices.forEach((service) => {
    //   params.append("additionalServices", service);
    // });

    // Append start date and end date if they exist
    if (dates && dates.length > 0 && dates[0] && dates[1]) {
      params.append("startDate", dates[0].toISOString());
      params.append("endDate", dates[1].toISOString());
    }

    if (searchName !== undefined || searchName !== "") {
      params.append("searchName", searchName);
    }

    try {
      const res = await getHotelsFilter(params);
      console.log("heeh");
      console.log(params, "haha");
      onFilterChange(res.data.data);
    } catch (e) {
      onFilterChange([]);
    }
  };

  // const getAllAdditionalServices = async () => {
  //   try {
  //     const res = await getAllAdditionalServiceFilter();
  //     setAdditionalServices(res.data.data);
  //     console.log(res.data);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // Function to handle additional services selection
  // const handleAdditionalServicesSelection = (value) => {
  //   console.log(value);
  //   const updatedAdditionalServices = selectedAdditionalServices.includes(value)
  //     ? selectedAdditionalServices.filter((a) => a !== value)
  //     : [...selectedAdditionalServices, value];
  //   setSelectedAdditionalServices(updatedAdditionalServices);
  //   if (updatedAdditionalServices.length > 0) {
  //     queryParams.set("additionalServices", updatedAdditionalServices);
  //     navigate(`/filterHotels?${queryParams.toString()}`);
  //   } else {
  //     queryParams.delete("additionalServices");
  //     navigate(`/filterHotels?${queryParams.toString()}`);
  //   }
  // };

  // Function to trigger the show all amenities
  const toggleShowAllAmen = () => {
    setShowAllAmen(!showAllAmen);
  };

  // const toggleShowAllAdditionalServices = () => {
  //   setShowAllAdditionalServices(!showAllAdditionalServices);
  // };

  const toggleShowAllLocations = () => {
    setShowAllLocations(!showAllLocations);
  };

  const toggleShowAvailability = () => {
    setShowAllAvailabilty(!showAllAvailabilty);
  };
  const toggleShowPrices = () => {
    setShowAllPrices(!showAllPrices);
  };

  const toggleShowRatings = () => {
    setShowAllRatings(!showAllRatings);
  };

  //!To display the selected dates
  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
  };

  //!To submit the selected dates
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

  //!To display the selected price range
  const handleSelectPrice = (ranges) => {
    setPriceRange(ranges);
  };

  //!To submit the selected price range
  const handleSubmitPriceRanges = () => {
    setPriceRanges(priceRange);
    // setIsDialogOpen(false);
    queryParams.set("minPrice", priceRange[0]);
    queryParams.set("maxPrice", priceRange[1]);
    navigate(`/filterHotels?${queryParams.toString()}`);
  };

  const clearPrice = () => {
    setPriceRanges([0, 10000]);
    setPriceRange([0, 10000]);

    queryParams.delete("maxPrice");
    queryParams.delete("minPrice");
    navigate(`/filterHotels?${queryParams.toString()}`);
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
    setPriceRanges([0, 10000]);

    navigate(`/filterHotels`);
  };

  console.log(queryParams.size);

  return (
    <div className="custom-scrollbar rounded-md  shadow-inner w-[30%] flex flex-col gap-4 h-[41rem] sticky top-36 pr-4 overflow-hidden ">
      <div className="flex justify-between items-center sticky h-fit top-0 bg-white pb-2 z-30 px-4">
        <div className=" flex gap-2 items-center text-violet-950 font-bold text-2xl pl-2">
          <FaFilter />
          <h1>Filter by:</h1>
        </div>
        {queryParams.size > 0 && (
          <div
            className="text-violet-950 cursor-pointer"
            onClick={clearAllFilters}
          >
            <p className="border-b border-b-violet-950 text-sm">Reset Filter</p>
          </div>
        )}
      </div>
      <div class="relative ml-4 border flex items-center justify-between rounded-full mt-2 mb-4">
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
          onChange={(e) => handleSearchFilter(e)}
          value={searchName}
          class="h-10 w-full cursor-text rounded-full border bg-slate-200 py-2 pr-40 pl-12  outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          placeholder="Search by name"
        />
      </div>
      <div className="flex-col border-b-2 border-b-gray-200">
        <div
          className=" p-2  flex justify-between hover:bg-gray-100 pl-6  cursor-pointer"
          onClick={toggleShowAvailability}
        >
          <h1 className="font-bold text-lg text-violet-950">Availability</h1>
          <button className="text-violet-950 font-semibold p-1">
            {showAllAvailabilty ? (
              <div className="flex gap-1 items-center">
                <IoIosArrowUp className="text-lg" />
              </div>
            ) : (
              <div className="flex gap-1 items-center">
                <IoIosArrowDown className="text-lg" />
              </div>
            )}
          </button>
        </div>
        {showAllAvailabilty && (
          <div className="">
            <div
              className="flex items-center gap-2 pl-4 mt-2"
              onClick={() => setIsDialogOpen(true)}
            >
              <TextField
                variant="outlined"
                className="w-full cursor-pointer"
                value={`${dateRange[0].startDate.toDateString()} - ${dateRange[0].endDate.toDateString()}`}
              />
            </div>
            <div className="items-end flex justify-end broder-2 mt-2 mb-2">
              {queryParams.getAll("startDate")[0] ? (
                <div
                  className="p-2 bg-violet-950 w-fit rounded-md text-white text-sm cursor-pointer"
                  onClick={clearDates}
                >
                  <p>Clear</p>
                </div>
              ) : (
                <div
                  className="p-2 bg-violet-950 w-fit rounded-md text-white text-sm cursor-pointer"
                  onClick={handleAddDates}
                >
                  <p>Select</p>
                </div>
              )}
            </div>
            {isDialogOpen && (
              <div className="z-50 absolute right-5 " ref={dialogRef}>
                <DateRange
                  ranges={dateRange}
                  minDate={new Date()}
                  onChange={handleSelect}
                />
              </div>
            )}
          </div>
        )}
      </div>
      {/* <div className="flex-col border-b-2 border-b-gray-200 ">
        <div
          className=" p-2 cursor-pointer  flex justify-between pl-6 hover:bg-gray-100 "
          onClick={toggleShowPrices}
        >
          <h1 className="font-bold text-lg text-violet-950">
            Select Price Range
          </h1>
          <button className="text-violet-950 font-semibold rounded-md p-1">
            {showAllPrices ? (
              <div className="flex gap-1 items-center">
                <IoIosArrowUp className="text-lg" />
              </div>
            ) : (
              <div className="flex gap-1 items-center">
                <IoIosArrowDown className="text-lg" />
              </div>
            )}
          </button>
        </div>
        {showAllPrices && (
          <div className="p-4 pl-6 pr-6">
            <div className="flex items-center justify-between">
              <label className="font-semibold">Min: NPR{priceRange[0]}</label>
              <label className="font-semibold">Max: NPR{priceRange[1]}</label>
            </div>
            <Slider
              min={0}
              max={10000}
              step={500}
              value={priceRange}
              onChange={(value) => handleSelectPrice(value)}
              trackStyle={[{ backgroundColor: "purple" }]}
              range
            />
            <p className="mt-4 font-semibold text-sm">
              Selected Price Range: NPR{priceRange[0]} - NPR{priceRange[1]}
            </p>
            <div className="items-end flex justify-end broder-2 mt-2 mb-2">
              {queryParams.get("minPrice") ? (
                <div
                  className="p-2 bg-violet-950 w-fit rounded-md text-white text-sm cursor-pointer"
                  onClick={clearPrice}
                >
                  <p>Clear</p>
                </div>
              ) : (
                <div
                  className="p-2 bg-violet-950 w-fit rounded-md text-white text-sm cursor-pointer"
                  onClick={handleSubmitPriceRanges}
                >
                  <p>Select</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div> */}
      <div
        className={`flex-col border-b-2 border-b-gray-200 ${
          showAllRatings && "pb-4"
        } `}
      >
        <div
          className=" p-2 pl-6 cursor-pointer  flex justify-between hover:bg-gray-100 "
          onClick={toggleShowRatings}
        >
          <h1 className="font-bold text-lg text-violet-950">
            Property ratings
          </h1>
          <button
            // onClick={toggleShowRatings}
            className="text-violet-950 font-semibold  p-1"
          >
            {showAllRatings ? (
              <div className="flex gap-1 items-center">
                <IoIosArrowUp className="text-lg" />
              </div>
            ) : (
              <div className="flex gap-1 items-center">
                <IoIosArrowDown className="text-lg" />
              </div>
            )}
          </button>
        </div>
        {showAllRatings && (
          <div
            className={`p-4 pl-6 pr-6  
        flex flex-col gap-1 overflow-auto custom-scrollbar`}
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <div key={rating} className="flex gap-2 items-center ">
                <input
                  className="h-4 w-4 cursor-pointer accent-violet-950"
                  id={`${rating}star`}
                  type="checkbox"
                  onChange={() => handleFilters(rating, "ratings")}
                  checked={ratings === rating}
                />
                <label htmlFor={`${rating}star`}>{rating}</label>
                {Array.from({ length: rating }).map((_, index) => (
                  <MdStar key={index} className="text-yellow-400 text-xl" />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        className={`flex-col border-b-2 border-b-gray-200 ${
          showAllLocations && "pb-4"
        } `}
      >
        <div
          className=" p-2 pl-6 cursor-pointer  flex justify-between hover:bg-gray-100 "
          onClick={toggleShowAllLocations}
        >
          <h1 className="font-bold text-lg text-violet-950">Locations</h1>
          <button className="text-violet-950 font-semibold  p-1">
            {showAllLocations ? (
              <div className="flex gap-1 items-center">
                <IoIosArrowUp className="text-lg" />
              </div>
            ) : (
              <div className="flex gap-1 items-center">
                <IoIosArrowDown className="text-lg" />
              </div>
            )}
          </button>
        </div>
        {showAllLocations && (
          <div className="p-4  flex flex-col pl-6 pr-6 relative">
            {/* <label
              htmlFor="dropdown"
              className="font-bold mb-2 text-violet-950 "
            >
              Select an Location:
            </label> */}
            {selectedLocation != "location" && (
              <div
                role="button"
                onClick={handleLocationFilterDelete}
                className="absolute -top-2 cursor-pointer hover:text-violet-800 text-violet-950 font-bold text-sm hover:underline border-black right-4 z-30"
              >
                <p>Clear</p>
              </div>
            )}
            <Listbox
              value={selectedLocation}
              onChange={(value) => handleFilters(value, "location")}
            >
              <div className="relative mt-1">
                <Listbox.Button className="relative cursor-pointer w-full  rounded-lg bg-white py-2 pl-3 pr-10 text-left  border shadow-sm focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">{selectedLocation}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <LuChevronsUpDown
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                    {locations.map((location) => (
                      <Listbox.Option
                        key={location.name}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                            active ? "bg-violet-950 text-white" : "text-black"
                          }`
                        }
                        value={location.name}
                      >
                        <div className="flex">
                          <span
                            className={`block truncate ${
                              selectedLocation === location.name
                                ? "font-medium"
                                : "font-normal"
                            }`}
                          >
                            {location.name}
                          </span>
                          {selectedLocation === location.name ? (
                            <span
                              className={`absolute inset-y-0 left-0 top-2  items-center pl-3 `}
                            >
                              <BiCheck className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </div>
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        )}
      </div>

      {/* <div
        className={`flex-col border-b-2 border-b-gray-200 ${
          showAllAdditionalServices && "pb-4"
        }`}
      >
        <div
          className="p-2 pl-6 cursor-pointer flex items-center justify-between hover:bg-gray-100"
          onClick={toggleShowAllAdditionalServices}
        >
          <h1 className="font-bold text-lg text-violet-950">
            Additional Services
          </h1>
          <button className="text-violet-950 font-semibold p-1">
            {showAllAdditionalServices ? (
              <div className="flex gap-1 items-center">
                <IoIosArrowUp className="text-lg" />
              </div>
            ) : (
              <div className="flex gap-1 items-center">
                <IoIosArrowDown className="text-lg" />
              </div>
            )}
          </button>
        </div>
        {showAllAdditionalServices && (
          <div
            className={`p-4 pl-6 pr-6 ${
              showAllAdditionalServices && "h-[113px]"
            } flex flex-col gap-1 overflow-auto custom-scrollbar`}
          >
            {additionalServices.map((service) => (
              <div
                key={service?.additional_services_id}
                className="flex gap-3 items-center "
              >
                <input
                  id={`${service?.additional_services_id}`}
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer accent-violet-950 "
                  onChange={() =>
                    handleAdditionalServicesSelection(
                      service.additional_services_id
                    )
                  }
                  checked={selectedAdditionalServices.includes(
                    service.additional_services_id
                  )}
                />
                <label
                  className={`text-sm font-semibold cursor-pointer ${
                    selectedAdditionalServices.includes(
                      service.additional_services_id
                    )
                      ? "text-black"
                      : "text-gray-400"
                  }`}
                  htmlFor={`${service?.additional_services_id}`}
                >
                  {service?.service_name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div> */}

      <div
        className={`flex-col border-b-2 border-b-gray-200 ${
          showAllAmen && "pb-4"
        } `}
      >
        <div
          className="p-2 pl-6 cursor-pointer flex items-center justify-between hover:bg-gray-100"
          onClick={toggleShowAllAmen}
        >
          <h1 className="font-bold text-lg text-violet-950">Amenities</h1>
          <button className="text-violet-950 font-semibold p-1">
            {showAllAmen ? (
              <div className="flex gap-1 items-center">
                <IoIosArrowUp className="text-lg" />
              </div>
            ) : (
              <div className="flex gap-1 items-center">
                <IoIosArrowDown className="text-lg" />
              </div>
            )}
          </button>
        </div>
        {showAllAmen && (
          <div
            className={`p-4 pl-6 pr-6  ${
              showAllAmen && "h-[113px]"
            }  flex flex-col gap-1 overflow-auto custom-scrollbar`}
          >
            {amenitiesList.map((amenity) => (
              <div key={amenity} className="flex gap-3 items-center ">
                <input
                  id={`${amenity.toLowerCase()}`}
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer accent-violet-950 "
                  onChange={() => handleFilters(amenity, "amenities")}
                  checked={amenities.includes(amenity)}
                />
                <label
                  className={` text-sm font-semibold ${
                    amenities.includes(amenity) ? "text-black" : "text-gray-400"
                  }`}
                  htmlFor={`${amenity.toLowerCase()}`}
                >
                  {amenity}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

HotelsSearch.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  handleFilters: PropTypes.func.isRequired,
  ratings: PropTypes.number.isRequired,
  amenities: PropTypes.arrayOf(PropTypes.string),
  roomTypes: PropTypes.arrayOf(PropTypes.number),
  priceRange: PropTypes.shape({
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
  }),
  selectedLocation: PropTypes.string.isRequired,
};
