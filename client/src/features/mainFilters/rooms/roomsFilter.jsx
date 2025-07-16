import React, { useEffect } from "react";
import noFound from "../../../assets/billNotFound.jpg";
import { Link, useLocation } from "react-router-dom";

import { amenityIcons } from "../../../icons/amenitiesIcons";
import RoomCardSkeleton from "../../../components/skeletons/roomCardSkeleton";

export default function RoomsFilter({ rooms, clearAllFilters, loading }) {
  console.log(loading);
  return (
    <>
      {loading ? (
        <div className="mt-10 flex flex-col gap-6">
          {[1, 2, 3, 4].map(() => (
            <RoomCardSkeleton />
          ))}
        </div>
      ) : (
        <>
          <h1 className="font-semibold mb-4">{rooms?.length} rooms found</h1>
          {rooms?.length > 0 ? (
            rooms?.map((room) => (
              <Link
                to={`/mainHotel/${room.hotel_id}/room/${room.room_id}`}
                key={room.room_id}
              >
                <div className="rounded-lg shadow-md border flex flex-col md:flex-row gap-4 md:gap-6 cursor-pointer mb-6 md:mb-4 transition-all hover:shadow-lg">
                  <div className="rounded-t-lg md:rounded-l-lg md:rounded-tr-none w-full md:w-[35%] h-full overflow-hidden">
                    <img
                      className="rounded-t-lg md:rounded-l-lg md:rounded-tr-none h-full w-full object-cover"
                      src={room.other_pictures[0].room_picture}
                      alt="Room"
                    />
                  </div>
                  <div className="w-full md:w-[50%] m-4 flex flex-col justify-between">
                    <div>
                      <h1 className="text-lg md:text-2xl text-violet-950 font-bold line-clamp-1">
                        {room.room_type}
                      </h1>
                      <div className="text-sm mt-1 text-gray-500 font-semibold overflow-hidden line-clamp-3 md:line-clamp-4 h-[60px] md:h-[82px]">
                        <p>{room.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 md:gap-4 mt-1 font-semibold text-xs md:text-sm">
                        {room.room_amenities?.slice(0, 5).map((amen) => (
                          <span className="flex gap-1 items-center" key={amen}>
                            {amenityIcons[amen]} {amen}
                          </span>
                        ))}
                        {room.room_amenities.length > 5 && (
                          <div className="rounded-full p-1 bg-gray-100 text-xs">
                            <p className="font-semibold">
                              +{room?.room_amenities?.length - 5}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center md:pr-4 md:m-4 w-full md:w-[20%]">
                    <div className="border-2 border-green-400 p-3 md:p-4 text-xs md:text-sm font-semibold rounded-lg w-full text-center">
                      <h2 className="text-lg md:text-xl text-violet-950 font-bold">
                        Price
                      </h2>
                      <p>Starting from NPR {room.price_per_night}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-black text-xl md:text-3xl flex flex-col items-center justify-center ">
              <img alt="billie" className="w-40 md:w-60" src={noFound}></img>
              <div>
                <p>No Rooms found</p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
