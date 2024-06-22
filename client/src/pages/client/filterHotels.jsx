import React, { useEffect, useState } from "react";
import MainHeaders from "../../components/mainHeaders/mainHeaders";
import HotelsSearch from "../../features/mainFilters/hotels/hotelsSearch";
import { getAllHotels } from "../../services/hotels/hotels.service";
import HotelsFilter from "../../features/mainFilters/hotels/hotelsFilter";
import { useLocation, useNavigate } from "react-router-dom";

export default function FilterHotels() {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);

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

      case "ratings":
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
      case "location":
        setSelectedLocation(value);
        queryParams.set("location", value);
        console.log("ahah");
        break;
      default:
        break;
    }
    navigate(`/filterHotels?${queryParams.toString()}`);
  };

  console.log(queryParams.get("location"));
  console.log(queryParams.get("ratings"));
  console.log(ratings);

  return (
    <div className="p-6">
      <div className="px-8 ">
        <MainHeaders Headers={"Filter Hotels"} />
        <div className="flex gap-10 mt-6">
          <HotelsSearch
            onFilterChange={handleFilterChange}
            handleFilters={handleFilters}
            ratings={ratings}
            amenities={amenities}
            // roomTypes={roomTypes}
            // priceRange={priceRange}
            selectedLocation={selectedLocation}
          />
          <div className="w-full">
            <div className="flex flex-col gap-4">
              {
                //!If no filter is done then the hotels which is fetched are shown
              }
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
