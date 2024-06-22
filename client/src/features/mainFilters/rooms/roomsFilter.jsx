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
          <h1 className=" font-semibold">{rooms?.length} rooms found</h1>
          {rooms?.length > 0 ? (
            rooms?.map((room) => (
              <Link
                to={`/mainHotel/${room.hotel_id}/room/${room.room_id}`}
                key={room.room_id}
              >
                <div className=" rounded-lg shadow-md border flex gap-6 cursor-pointer ">
                  <div className="rounded-l-lg w-[35%] h-[180px]">
                    <img
                      className="rounded-l-lg h-full w-full object-cover "
                      src={room.other_pictures[0].room_picture}
                      alt="hehe"
                    ></img>
                  </div>
                  <div className="w-[50%]  m-4">
                    <div className=" ">
                      <div className="">
                        <h1 className="text-2xl text-violet-950 font-bold">
                          {room.room_type}
                        </h1>
                        {/* <p className="font-semibold text-sm">{hotel.hotel_reviews_ratings}/5 Excellent({hotel.hotel_reviews.length} reviews)</p> */}
                      </div>
                      {/* <div className="text-[12px] font-semibold text-gray-400">
            <p>
              {hotel.hotel_reviews_ratings}/5 - Excellent (
              {hotel.hotel_reviews.length} reviews)
            </p>
            <div className="flex gap-1 items-center">
              <MdStar className="text-xl text-yellow-400"/>
              <p>{hotel.ratings}</p>
            </div>
          </div> */}
                      <div className="text-sm mt-1 text-gray-500 font-semibold overflow-hidden line-clamp-4 h-[82px]">
                        <p>{room.description}</p>
                      </div>
                      <div className="flex gap-4 mt-1 font-semibold text-sm">
                        {room.room_amenities?.slice(0, 5).map((amen) => (
                          <span className="flex gap-1 items-center" key={amen}>
                            {amenityIcons[amen]} {amen}
                          </span>
                        ))}
                        {room.room_amenities.length > 5 && (
                          <div className=" rounded-full p-1 bg-gray-100 text-xs ">
                            <p className="font-semibold">
                              +{room?.room_amenities?.length - 5}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className=" flex items-center justify-center pr-4 m-4 w-[20%]">
                    <div className="border-2 border-green-400 p-4 text-sm font-semibold rounded-lg w-full">
                      <h2 className="text-xl text-violet-950 font-bold">
                        Price
                      </h2>
                      <p>Starting from NPR {room.price_per_night} </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-black text-3xl flex flex-col items-center justify-center ">
              <img alt="billie" className=" " src={noFound}></img>
              <div className=" ">
                <p>No Rooms found</p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
