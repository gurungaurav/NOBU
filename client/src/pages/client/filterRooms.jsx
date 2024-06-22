import React, { useEffect, useState } from "react";
import MainHeaders from "../../components/mainHeaders/mainHeaders";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import RoomsSearch from "../../features/mainFilters/rooms/roomsSearch";
import RoomsFilter from "../../features/mainFilters/rooms/roomsFilter";
import { FaRegTrashAlt } from "react-icons/fa";
import { getRoomFilter } from "../../services/client/user.service";

//TODO: When i try to swipe back then it should be redirected to the old filtered pages it should be redirected to the other main pages
//! And need to fix the clear buttons
export default function FilterRooms() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const { hotel_id } = useParams();
  const [loading, setLoading] = useState(true);

  //! For filtering purposes like location is used to take out the url of the page like to know on which page the browser is currently on
  const location = useLocation();
  //!Then query params is used to search the params
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  const getRooms = async () => {
    try {
      const res = await getRoomFilter(hotel_id);
      setRooms(res.data.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getRooms();
    setFilteredRooms(null);
  }, [location.search]);

  const handleFilterChange = (filteredRooms) => {
    console.log(filteredRooms);
    setFilteredRooms(filteredRooms);
  };
  // console.log(filteredRooms);
  // console.log(rooms, "dhfdhf");

  const [amenities, setAmenities] = useState(
    queryParams.getAll("amenities") || []
  );
  const [roomTypes, setRoomTypes] = useState(
    queryParams.getAll("roomTypes").map((item) => parseInt(item)) || []
  );
  const [capacity, setCapacity] = useState(
    parseInt(queryParams.get("capacity")) || 0
  );
  const [bedTypes, setBedTypes] = useState(
    queryParams.getAll("bedTypes").map((item) => parseInt(item)) || []
  );
  //   //!This is used for displaying
  //   // Initialize dateRange state with query parameters
  // const initialDateRange = queryParams.getAll("startDate").length > 0 && queryParams.getAll("endDate").length > 0
  // ? {
  //     startDate: new Date(queryParams.getAll("startDate")[0]),
  //     endDate: new Date(queryParams.getAll("endDate")[0]),
  //     key: "selection",
  //   }
  // : {
  //     startDate: new Date(),
  //     endDate: new Date(),
  //     key: "selection",
  //   };

  // const [dateRange, setDateRange] = useState([initialDateRange]);

  //   //!This will be used for submitting the dates
  //   const[dates, setDates] = useState([])

  // const [selectedFilters, setSelectedFilters] = useState([]);

  // Function to handle the inputted filter type and values
  const handleFilters = (value, type) => {
    setLoading(true);
    switch (type) {
      case "amenities":
        const updatedAmenities = amenities.includes(value)
          ? amenities.filter((a) => a !== value)
          : [...amenities, value];
        setAmenities(updatedAmenities);
        if (updatedAmenities.length > 0) {
          queryParams.set("amenities", updatedAmenities);
        } else {
          queryParams.delete("amenities");
        }
        break;
      case "roomTypes":
        const updatedRoomTypes = roomTypes.includes(value)
          ? roomTypes.filter((a) => a !== value)
          : [...roomTypes, value];
        setRoomTypes(updatedRoomTypes);
        if (updatedRoomTypes.length > 0) {
          queryParams.set("roomTypes", updatedRoomTypes);
        } else {
          queryParams.delete("roomTypes");
        }
        break;
      case "capacity":
        if (value !== "" && !isNaN(value)) {
          if (capacity === value) {
            setCapacity(0);
            queryParams.delete("capacity");
          } else {
            setCapacity(value);
            queryParams.set("capacity", value);
          }
        } else {
          setCapacity(0);
          queryParams.delete("capacity");
        }
        break;

      case "bedTypes":
        const updatedBedTypes = bedTypes.includes(value)
          ? bedTypes.filter((a) => a !== value)
          : [...bedTypes, value];
        setBedTypes(updatedBedTypes);
        if (updatedBedTypes.length > 0) {
          queryParams.set("bedTypes", updatedBedTypes);
        } else {
          queryParams.delete("bedTypes");
        }
        break;
      default:
        break;
    }
    navigate(`/mainHotel/${hotel_id}/filterRooms?${queryParams.toString()}`);
    // setSelectedFilters([...selectedFilters, { value, type }]);
  };
  // console.log(queryParams.getAll("roomTypes"));

  const clearFiltersHandler = (value, type) => {
    // Update corresponding state and URL parameter
    switch (type) {
      case "amenities":
        setAmenities([]);
        queryParams.delete("amenities");
        break;
      case "roomTypes":
        setRoomTypes([]);
        queryParams.delete("roomTypes");
        break;
      case "capacity":
        setCapacity(0);
        queryParams.delete("capacity");
        break;
      case "bedTypes":
        setBedTypes([]);
        queryParams.delete("bedTypes");
        break;
      default:
        break;
    }
    navigate(`/mainHotel/${hotel_id}/filterRooms?${queryParams.toString()}`);
    // setSelectedFilters(selectedFilters.filter((filter) => filter.value !== value || filter.type !== type));
  };

  const clearAllFilters = () => {
    setAmenities([]);
    queryParams.delete("amenities");
    setRoomTypes([]);
    queryParams.delete("roomTypes");
    setCapacity(0);
    queryParams.delete("capacity");
    setBedTypes([]);
    queryParams.delete("bedTypes");
    navigate(`/mainHotel/${hotel_id}/filterRooms?${queryParams.toString()}`);
    // setSelectedFilters([]);
  };

  // console.log(queryParams);

  return (
    <div className="pt-6 pb-10">
      <div className="pr-16 pl-10">
        <MainHeaders Headers={"Filter Rooms"} />
        <div className="flex gap-8 mt-5">
          <RoomsSearch
            onFilterChange={handleFilterChange}
            handleFilters={handleFilters}
            // priceRange={priceRange}
            amenities={amenities}
            roomTypes={roomTypes}
            capacity={capacity}
            bedTypes={bedTypes}
          />
          <div className="w-full ">
            <div className="flex flex-col gap-4">
              {/* {selectedFilters.length > 0 && (
                <div className="flex items-center gap-2">
                  <p>Selected Filters:</p>
                  {selectedFilters.map((filter, index) => (
                    <div key={index} className="p-1 cursor-pointer rounded-sm shadow-lg flex items-center gap-2 hover:text-violet-950 font-semibold text-sm">
                      <p>{filter.value}</p>
                      <RxCross1 onClick={() => clearFiltersHandler(filter.value, filter.type)} />
                    </div>
                  ))}
                </div>
              )} */}
              <RoomsFilter
                rooms={filteredRooms != null ? filteredRooms : rooms}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
