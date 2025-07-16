import MainHeaders from "../../components/mainHeaders/mainHeaders";
import { Link, useNavigate, useParams } from "react-router-dom";
import { amenityIcons } from "../../icons/amenitiesIcons";
import RoomCardSkeleton from "../../components/skeletons/roomCardSkeleton";

export default function MainHotelRooms(props) {
  const navigate = useNavigate();

  const { hotel_id } = useParams();

  const rooms = props.rooms;

  const loading = props?.loading;

  const roomLists = rooms?.length >= 4 ? rooms?.slice(0, 4) : rooms;

  return (
    <div className="flex flex-col">
      <MainHeaders Headers={"Rooms & Prices"} />
      <div className="flex flex-col px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-6 sm:pt-8 lg:pt-10 gap-4 sm:gap-6">
        {loading
          ? [1, 2, 3, 4].map((item) => <RoomCardSkeleton key={item} />)
          : roomLists?.map((room) => (
              <div
                className="rounded-lg shadow-md border flex flex-col lg:flex-row gap-4 sm:gap-6 cursor-pointer hover:shadow-lg transition-shadow duration-300 bg-white overflow-hidden"
                key={room.room_id}
              >
                {/* Image Section */}
                <div className="h-48 sm:h-56 lg:h-64 w-full lg:w-80 xl:w-96 flex-shrink-0">
                  <img
                    className="rounded-t-lg lg:rounded-l-lg lg:rounded-t-none h-full w-full object-cover"
                    src={room?.other_pictures[0]?.room_picture}
                    alt={`${room?.room_type.type_name} room`}
                  />
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 sm:p-5 lg:p-6">
                  {/* Room Details */}
                  <Link
                    className="flex-1 min-w-0"
                    to={`/mainHotel/${room.hotel_id}/room/${room.room_id}`}
                  >
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl text-violet-950 font-bold leading-tight">
                          {room?.room_type.type_name}
                        </h2>
                      </div>
                      <div className="text-sm sm:text-base text-gray-600 font-medium">
                        <p className="line-clamp-2 sm:line-clamp-3 lg:line-clamp-4 leading-relaxed">
                          {room.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 font-medium">
                        {room.room_amenities?.slice(0, 4).map((amen) => (
                          <span
                            className="flex gap-1.5 items-center bg-gray-50 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            key={amen}
                          >
                            <span className="text-violet-600">
                              {amenityIcons[amen]}
                            </span>
                            <span className="hidden sm:inline">{amen}</span>
                          </span>
                        ))}
                        {room.room_amenities.length > 4 && (
                          <div className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-gray-600">
                            +{room?.room_amenities?.length - 4} more
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* Price Section */}
                  <div className="flex items-center justify-center lg:justify-end">
                    <div className="border-2 border-green-400 bg-green-50 hover:bg-green-100 transition-colors p-4 sm:p-5 lg:p-6 text-sm sm:text-base font-semibold rounded-lg w-full sm:w-auto lg:w-48 xl:w-56">
                      <h3 className="text-lg sm:text-xl lg:text-2xl text-violet-950 font-bold mb-1 sm:mb-2">
                        Price
                      </h3>
                      <p className="text-gray-700 text-sm sm:text-base">
                        Starting from
                        <span className="block sm:inline text-lg sm:text-xl font-bold text-green-600 mt-1 sm:mt-0 sm:ml-1">
                          NPR {room.price_per_night}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>
      {roomLists?.length === 4 && (
        <div className="flex justify-center items-center mt-6 sm:mt-8 lg:mt-10 px-4">
          <button
            className="inline-flex items-center gap-2 bg-violet-950 hover:bg-violet-800 text-white font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-lg transform hover:scale-105 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
            onClick={() => navigate(`/mainHotel/${hotel_id}/filterRooms`)}
          >
            <span className="text-sm sm:text-base">View All Rooms</span>
          </button>
        </div>
      )}
    </div>
  );
}
