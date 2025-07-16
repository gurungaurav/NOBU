import React, { useEffect, useState } from "react";
import MainHeaders from "../../../../components/mainHeaders/mainHeaders";
import { getAllHotels } from "../../../../services/hotels/hotels.service";
import { Link } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import { FaStar } from "react-icons/fa";
import { amenityIcons } from "../../../../icons/amenitiesIcons";
import HotelSkeleton from "../../../../components/skeletons/hotelListsSkeleton";

export default function MainHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  Aos.init();

  const getHotels = async () => {
    try {
      const res = await getAllHotels();
      setHotels(res.data.data);
      console.log(res.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getHotels();
  }, []);

  return (
    <div className="">
      <div className="flex justify-center mt-6 sm:mt-8 lg:mt-10">
        <MainHeaders Headers={"Our Hotels & Restaurants"} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 pt-8 sm:pt-10 lg:pt-12 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto">
        {loading ? (
          [1, 2, 3, 4].map((item) => <HotelSkeleton key={item} />)
        ) : hotels ? (
          hotels.slice(0, 4).map((hotel) => (
            <Link to={`/mainHotel/${hotel.hotel_id}`} key={hotel.hotel_id}>
              <div className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group">
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <img
                    alt={hotel.hotel_name}
                    className="h-48 sm:h-56 lg:h-80 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={hotel?.main_picture}
                  />
                  {/* Price Overlay */}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md">
                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-800">
                      <span className="text-xs text-gray-600">NPR</span>
                      <span>{hotel.leastPrice}</span>
                      <span className="text-gray-400">-</span>
                      <span>{hotel.mostExpensivePrice}</span>
                    </div>
                  </div>
                  {/* Location Badge */}
                  <div className="absolute top-3 right-3 bg-violet-950/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                    {hotel.location}
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-4 sm:p-5 lg:p-6">
                  {/* Rating Badge */}
                  <div className="inline-flex items-center gap-1.5 border border-violet-200 bg-violet-50 text-violet-900 font-semibold px-3 py-1.5 rounded-lg text-sm mb-3">
                    <FaStar className="text-yellow-400 text-xs" />
                    <span>{hotel.ratings} star hotel</span>
                  </div>

                  {/* Hotel Name and Reviews */}
                  <div className="mb-4">
                    <h3 className="text-violet-950 text-xl sm:text-2xl font-bold mb-2 line-clamp-1">
                      {hotel.hotel_name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">
                        {hotel.hotel_reviews_ratings}/5
                      </span>
                      <span>•</span>
                      <span>Excellent</span>
                      <span>•</span>
                      <span>({hotel.hotel_reviews.length} reviews)</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {hotel.hotel_amenities?.slice(0, 4).map((amen, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1.5 bg-gray-50 text-gray-700 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium"
                      >
                        <span className="text-violet-600">
                          {amenityIcons[amen]}
                        </span>
                        <span className="hidden sm:inline">{amen}</span>
                      </div>
                    ))}
                    {hotel.hotel_amenities?.length > 4 && (
                      <div className="flex items-center justify-center bg-gray-100 text-gray-600 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium">
                        +{hotel.hotel_amenities.length - 4} more
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 text-lg">No hotels found</p>
          </div>
        )}
      </div>
      {hotels?.length > 4 && (
        <div className="flex justify-center items-center mt-8 sm:mt-10 lg:mt-12">
          <Link
            to={`/filterHotels`}
            className="inline-flex items-center gap-2 bg-violet-950 hover:bg-violet-800 text-white font-semibold px-6 py-3 rounded-lg transform hover:scale-105 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
          >
            <span>View All Hotels</span>
          </Link>
        </div>
      )}
    </div>
  );
}
