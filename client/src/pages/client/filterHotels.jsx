import React, { useEffect, useState } from "react";
import MainHeaders from "../../components/mainHeaders/mainHeaders";
import HotelsSearchResponsive from "../../features/mainFilters/hotels/hotelsSearchResponsive";
import { getAllHotels } from "../../services/hotels/hotels.service";
import HotelsFilter from "../../features/mainFilters/hotels/hotelsFilter";
import { useLocation, useNavigate } from "react-router-dom";

export default function FilterHotels() {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const location = useLocation();
  console.log(location.search);
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  //This is used cuz when the new page is showed and no data is searched right so this will be invoked and if the data is searched then this wont be used
  const getHotels = async () => {
    try {
      const res = await getAllHotels();
      setHotels(res.data.data);
      setLoading(false);
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getHotels();
    setFilteredHotels(null);
  }, [location.search]);

  const handleFilterChange = (filteredHotels) => {
    console.log(filteredHotels);
    setFilteredHotels(filteredHotels);
  };

  // For storing the filters
  const [ratings, setRatings] = useState(
    parseInt(queryParams.get("ratings")) || 0
  );
  const [amenities, setAmenities] = useState(
    queryParams.getAll("amenities") || []
  );

  const [selectedLocation, setSelectedLocation] = useState(
    queryParams.get("location") || "location"
  );

  // Function to handle the inputted filter type and values
  const handleFilters = (value, type) => {
    console.log(type);
    console.log(value);
    setLoading(true);

    switch (type) {
      case "amenities": {
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
      }
      case "ratings": {
        if (ratings === value) {
          // Uncheck the checkbox
          setRatings(0);
          queryParams.delete("ratings");
        } else {
          // Check the checkbox
          setRatings(value);
          queryParams.set("ratings", value);
        }
        break;
      }
      case "location": {
        setSelectedLocation(value);
        queryParams.set("location", value);
        console.log("ahah");
        break;
      }
      default:
        break;
    }
    navigate(`/filterHotels?${queryParams.toString()}`);
  };

  console.log(queryParams.get("location"));
  console.log(queryParams.get("ratings"));
  console.log(ratings);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <MainHeaders Headers={"Filter Hotels"} />
        </div>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-10">
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full flex items-center justify-center gap-2 bg-violet-950 text-white py-3 px-4 rounded-lg font-semibold hover:bg-violet-800 transition-colors"
            >
              <span>Filters</span>
              <span className="text-sm">({queryParams.size})</span>
            </button>
          </div>

          {/* Filter Sidebar */}
          <div
            className={`
            ${showMobileFilters ? "block" : "hidden"} lg:block
            lg:w-80 xl:w-96 flex-shrink-0
          `}
          >
            <HotelsSearchResponsive
              onFilterChange={handleFilterChange}
              handleFilters={handleFilters}
              ratings={ratings}
              amenities={amenities}
              selectedLocation={selectedLocation}
              onMobileClose={() => setShowMobileFilters(false)}
            />
          </div>

          {/* Results Section */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-4 sm:gap-6">
              <HotelsFilter
                hotels={filteredHotels != null ? filteredHotels : hotels}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
