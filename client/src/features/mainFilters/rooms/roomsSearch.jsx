import React, { useEffect, useRef, useState } from "react";
import {
  getBedTypess,
  getRoomFilter,
} from "../../../services/client/user.service";
import { IoIosArrowDown, IoIosArrowUp, IoMdClose } from "react-icons/io";
import Slider from "rc-slider";
import "rc-slider/assets/index.css"; // Import the CSS directly
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaFilter, FaPerson } from "react-icons/fa6";
import PropTypes from "prop-types";
import "../../../global/css/scrollbar.css";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css";
import TextField from "@mui/material/TextField";
import { getRoomTypesRegistration } from "../../../services/vendor/vendor.service";
import { MenuItem, Select } from "@mui/material";

export default function RoomsSearch({
  onFilterChange,
  handleFilters,
  amenities,
  roomTypes,
  capacity,
  bedTypes,
}) {
  const location = useLocation();
  //!Then query params is used to search the params
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

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
  //!Setting the end date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // List of amenities to display
  const amenitiesList = [
    "Wi-Fi",
    "TV",
    "A/C",
    "24-Hour Room Service",
    "Laundry Services",
    "Pet-Friendly Accommodations",
    "Bathroom",
    "Toiletries",
    "Hairdryer",
  ];

  const [bedTypesList, setBedTypesList] = useState([]);
  const [roomTypesList, setRoomTypesList] = useState([]);

  // To toggle the  buttons
  const [showAllAmen, setShowAllAmen] = useState(true);
  const [showAllRoomTypes, setShowAllRoomTypes] = useState(true);
  const [showAllCapacity, setShowAllCapacity] = useState(true);
  const [showAllBedTypes, setShowAllBedTypes] = useState(true);
  const [showAllAvailabilty, setShowAllAvailabilty] = useState(true);
  const [showAllPrices, setShowAllPrices] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog
  const [showFloorTypes, setShowFloorTypes] = useState(true);
  const [selectedRoomFloor, setSelectedRoomFloor] = useState(
    queryParams.get("floor") || ""
  );

  const dialogRef = useRef(null);
  //!This is used for displaying
  const initialDateRange =
    queryParams.getAll("startDate").length > 0 &&
    queryParams.getAll("endDate").length > 0
      ? {
          startDate: new Date(queryParams.getAll("startDate")[0]),
          endDate: new Date(queryParams.getAll("endDate")[0]),
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
    queryParams.get("minPrice") && queryParams.get("endDate")
      ? [priceRange[0], priceRange[1]]
      : [0, 10000]
  );

  console.log(priceRanges);

  const { hotel_id } = useParams();

  // Fetch room types and bed types
  useEffect(() => {
    getRoomTypes();
    getBedTypes();
    if (
      amenities.length > 0 ||
      roomTypes.length > 0 ||
      capacity > 0 ||
      bedTypes.length > 0 ||
      (dates && dates.length > 0 && dates[0] && dates[1]) ||
      selectedRoomFloor !== "" ||
      priceRanges.length > 0
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
  }, [
    amenities,
    roomTypes,
    capacity,
    bedTypes,
    dates,
    priceRanges,
    selectedRoomFloor,
  ]);

  // Function to fetch rooms based on filters
  const search = async () => {
    const params = new URLSearchParams();

    // Loop through amenities and append if it exists
    amenities.forEach((amenity) => {
      if (amenity) {
        params.append("amenities", amenity);
      }
    });

    // Loop through roomTypes and append if it exists
    roomTypes.forEach((roomType) => {
      if (roomType) {
        params.append("roomTypes", roomType);
      }
    });

    // // Append price range if available
    if (
      priceRanges &&
      priceRanges.length === 2 &&
      priceRanges[0] &&
      priceRanges[1]
    ) {
      console.log("pass");
      params.append("minPrice", priceRanges[0]);
      params.append("maxPrice", priceRanges[1]);
    }

    // Append capacity if available
    if (capacity > 0) {
      params.append("capacity", capacity);
    }

    // Loop through bedTypes and append if it exists
    bedTypes.forEach((bedType) => {
      if (bedType) {
        params.append("bedTypes", bedType);
      }
    });
    // Append start date and end date if they exist
    if (dates && dates.length > 0 && dates[0] && dates[1]) {
      params.append("startDate", dates[0].toISOString());
      params.append("endDate", dates[1].toISOString());
    }

    if (selectedRoomFloor !== "" && selectedRoomFloor !== undefined) {
      console.log("hah");
      params.append("floor", selectedRoomFloor);
    }

    try {
      const res = await getRoomFilter(hotel_id, params);
      console.log(params, "haha");
      onFilterChange(res.data.data);
    } catch (e) {
      onFilterChange([]);
    }
  };
  console.log(priceRanges, "sfhfh");

  // Fetch room types
  const getRoomTypes = async () => {
    try {
      const res = await getRoomTypesRegistration();
      setRoomTypesList(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  // Fetch bed types
  const getBedTypes = async () => {
    try {
      const res = await getBedTypess();
      setBedTypesList(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  // Function to trigger the show all amenities
  const toggleShowAllAmen = () => {
    setShowAllAmen(!showAllAmen);
  };

  // Function to trigger the show all room types
  const toggleShowAllRoomTypes = () => {
    setShowAllRoomTypes(!showAllRoomTypes);
  };

  // Function to trigger the show all capacities
  const toggleShowAllCapacity = () => {
    setShowAllCapacity(!showAllCapacity);
  };

  // Function to trigger the show all bed types
  const toggleShowAllBeds = () => {
    setShowAllBedTypes(!showAllBedTypes);
  };

  const toggleShowAvailability = () => {
    setShowAllAvailabilty(!showAllAvailabilty);
  };
  const toggleShowPrices = () => {
    setShowAllPrices(!showAllPrices);
  };

  const toggleShowFloor = () => {
    setShowFloorTypes(!showFloorTypes);
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
      navigate(`/mainHotel/${hotel_id}/filterRooms?${queryParams.toString()}`);
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
    queryParams.set("minPrice", priceRanges[0]);
    queryParams.set("maxPrice", priceRanges[1]);
    navigate(`/mainHotel/${hotel_id}/filterRooms?${queryParams.toString()}`);
  };

  const clearPrice = () => {
    setPriceRanges([0, 10000]);
    queryParams.delete("maxPrice");
    queryParams.delete("minPrice");
    navigate(`/mainHotel/${hotel_id}/filterRooms?${queryParams.toString()}`);
  };

  const clearDates = () => {
    setDateRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    queryParams.delete("startDate");
    queryParams.delete("endDate");
    navigate(`/mainHotel/${hotel_id}/filterRooms?${queryParams.toString()}`);
  };

  const clearAllFilters = () => {
    queryParams.forEach((_, key) => queryParams.delete(key));
    navigate(`/mainHotel/${hotel_id}/filterRooms`);
  };

  const handleFilterFloorTypes = (e) => {
    setSelectedRoomFloor(e.target.value);
    if (queryParams.get("floor")) {
      queryParams.delete("floor");
    }
    queryParams.append("floor", e.target.value);
    navigate(`/mainHotel/${hotel_id}/filterRooms?${queryParams.toString()}`);
  };

  return (
    <div className="custom-scrollbar rounded-md  shadow-inner w-[30%] flex flex-col gap-4 h-[41rem] sticky top-36 pr-4 overflow-hidden ">
      <div className="flex justify-between items-center sticky h-fit top-0 bg-white pb-2 z-30 px-4">
        <div className=" flex gap-2 items-center text-violet-950 font-bold text-2xl pl-2">
          <FaFilter />
          <h1>Filter by:</h1>
        </div>
        {queryParams.size > 0 && (
          <div
            className="text-violet-950 cursor-pointer text-sm"
            onClick={clearAllFilters}
          >
            <p className="border-b border-b-violet-950">Reset Filter</p>
          </div>
        )}
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
              className="flex items-center gap-2 pl-4 mt-2  "
              onClick={() => setIsDialogOpen(true)}
            >
              <TextField
                variant="outlined"
                className="w-full cursor-pointer"
                value={`${dateRange[0].startDate.toDateString()} - ${dateRange[0].endDate.toDateString()}`}
              />

              {/* <TextField
                variant="outlined"
                value={dateRange[0].endDate.toDateString()} // Assuming date is shown in string format
              /> */}
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
              <div className="z-50 absolute right-5 border " ref={dialogRef}>
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
      <div className="flex-col border-b-2 border-b-gray-200 ">
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
          <div className="pt-4 pl-6">
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
      </div>
      <div
        className={`flex-col border-b-2 border-b-gray-200 ${
          showAllCapacity && "pb-4"
        } `}
      >
        <div
          className=" p-2 pl-6 cursor-pointer  flex justify-between hover:bg-gray-100 "
          onClick={toggleShowAllCapacity}
        >
          <h1 className="font-bold text-lg text-violet-950">Capacity</h1>
          <button
            onClick={toggleShowAllCapacity}
            className="text-violet-950 font-semibold  p-1"
          >
            {showAllCapacity ? (
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
        {showAllCapacity && (
          <div
            className={`p-4 pl-6 pr-6  ${
              showAllCapacity && "h-[80px]"
            }  flex flex-col gap-1 overflow-auto custom-scrollbar`}
          >
            <input
              min={1}
              max={8}
              value={capacity !== 0 ? capacity : ""}
              type="text" // Change the type to text
              onChange={(e) => {
                const newValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                handleFilters(
                  newValue !== "" ? parseInt(newValue) : "",
                  "capacity"
                );
              }}
              placeholder="Enter capacity"
              className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />

            {/* {capacities.map((capacit) => (
              <div key={capacit} className="flex gap-3 items-center ">
                <input
                  id={`${capacit}`}
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer "
                  onChange={() => handleFilters(capacit, "capacity")}
                  checked={capacity === capacit}
                />
                <label
                  className={`text-sm font-semibold ${
                    capacity === capacit ? "text-black" : "text-gray-400"
                  }`}
                  htmlFor={`${capacit}`}
                >
                  {capacit}
                </label>
                {Array.from({ length: capacit }).map((_, index) => (
                  <FaPerson key={index} className=" text-xl" />
                ))}
              </div>
            ))} */}
          </div>
        )}
      </div>
      <div
        className={`flex-col border-b-2 border-b-gray-200 ${
          showAllRoomTypes && "pb-4"
        } `}
      >
        <div
          className="p-2 pl-6 cursor-pointer flex items-center justify-between hover:bg-gray-100"
          onClick={toggleShowAllRoomTypes}
        >
          <h1 className="font-bold text-lg text-violet-950">Room Types</h1>
          <button className="text-violet-950 font-semibold p-1">
            {showAllRoomTypes ? (
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
        {showAllRoomTypes || roomTypes.length > 0 ? (
          <div
            className={`p-4 pl-6 pr-6  ${
              showAllRoomTypes ? "h-[115px]" : "h-[115px]"
            }  flex flex-col gap-1 overflow-auto custom-scrollbar`}
          >
            {roomTypesList.map((roomType) => (
              <div
                key={roomType.room_type_id}
                className="flex gap-3 items-center "
              >
                <input
                  id={`${roomType?.type_name.toLowerCase()}`}
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer accent-violet-950 "
                  onChange={() =>
                    handleFilters(roomType?.room_type_id, "roomTypes")
                  }
                  checked={roomTypes?.includes(
                    parseInt(roomType?.room_type_id)
                  )}
                />
                <label
                  className={`text-sm font-semibold cursor-pointer ${
                    roomTypes?.includes(parseInt(roomType?.room_type_id))
                      ? "text-black"
                      : "text-gray-400"
                  }`}
                  htmlFor={`${roomType.type_name.toLowerCase()}`}
                >
                  {roomType.type_name}
                </label>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div
        className={`flex-col border-b-2 border-b-gray-200 ${
          showFloorTypes && "pb-4"
        } `}
      >
        <div
          className="p-2 pl-6 cursor-pointer flex items-center justify-between hover:bg-gray-100"
          onClick={toggleShowFloor}
        >
          <h1 className="font-bold text-lg text-violet-950">Floor Types</h1>
          <button className="text-violet-950 font-semibold p-1">
            {showFloorTypes ? (
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
        {showFloorTypes && (
          <div
            className={`p-4 pl-6 pr-6  ${
              showFloorTypes && "h-[80px]"
            }  flex flex-col gap-1 overflow-auto custom-scrollbar`}
          >
            <Select
              value={selectedRoomFloor || ""}
              onChange={(e) => handleFilterFloorTypes(e)}
              className="p-2 rounded-lg border text-xs h-[3rem] w-full "
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
          </div>
        )}
      </div>

      <div
        className={`flex-col border-b-2 border-b-gray-200 ${
          showAllBedTypes && "pb-4"
        } `}
      >
        <div
          className="p-2 pl-6 cursor-pointer flex items-center justify-between hover:bg-gray-100"
          onClick={toggleShowAllBeds}
        >
          <h1 className="font-bold text-lg text-violet-950">Bed Types</h1>
          <button className="text-violet-950 font-semibold p-1">
            {showAllBedTypes ? (
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
        {showAllBedTypes && (
          <div
            className={`p-4 pl-6 pr-6  ${
              showAllBedTypes && "h-[115px]"
            }  flex flex-col gap-1 overflow-auto custom-scrollbar`}
          >
            {bedTypesList.map((beds) => (
              <div key={beds} className="flex gap-3 items-center ">
                <input
                  id={`${beds.type_name.toLowerCase()}`}
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer accent-violet-950 "
                  onChange={() => handleFilters(beds.bed_types_id, "bedTypes")}
                  checked={bedTypes.includes(beds.bed_types_id)}
                />
                <label
                  className={`text-sm font-semibold cursor-pointer ${
                    bedTypes.includes(beds.bed_types_id)
                      ? "text-black"
                      : "text-gray-400"
                  }`}
                  htmlFor={`${beds.type_name.toLowerCase()}`}
                >
                  {beds.type_name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        className={`flex-col border-b-2 border-b-gray-200 ${
          showAllAmen && "pb-4"
        } `}
      >
        <div
          className="p-2 pl-6 cursor-pointer flex items-center justify-between hover:bg-gray-100"
          onClick={toggleShowAllAmen}
        >
          <h1 className="font-bold text-lg text-violet-950">Room Amenities</h1>
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
                  className={` text-sm font-semibold cursor-pointer ${
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

RoomsSearch.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  handleFilters: PropTypes.func.isRequired,
  priceRange: PropTypes.shape({
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
  }),
  amenities: PropTypes.arrayOf(PropTypes.string),
  roomTypes: PropTypes.arrayOf(PropTypes.string),
  capacity: PropTypes.number.isRequired,
  bedTypes: PropTypes.arrayOf(PropTypes.string.isRequired),
};
