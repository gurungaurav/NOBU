import React from "react";
import noFound from "../../../assets/billNotFound.jpg";
import { MdStar } from "react-icons/md";
import { Link } from "react-router-dom";
import RoomCardSkeleton from "../../../components/skeletons/roomCardSkeleton";

export default function HotelsFilter({ hotels, loading }) {
  return (
    <>
      {loading ? (
        <div className=" flex flex-col gap-6">
          {[1, 2, 3, 4].map(() => (
            <RoomCardSkeleton />
          ))}
        </div>
      ) : (
        <>
          {hotels?.length > 0 ? (
            hotels?.map((hotel) => (
              <Link
                to={`/mainHotel/${hotel.hotel_id}`}
                className=" rounded-lg shadow-md flex gap-6 cursor-pointer border"
                key={hotel.hotel_id}
              >
                <div className="rounded-l-lg  w-[30%] h-[195px]">
                  <img
                    className="rounded-l-lg h-full w-full object-cover "
                    src={hotel.main_picture}
                    alt="hehe"
                  ></img>
                </div>
                <div className="w-[50%]  m-4">
                  <div className=" ">
                    <div className="">
                      <h1 className="text-2xl text-violet-950 font-bold">
                        {hotel.hotel_name}
                      </h1>
                      {/* <p className="font-semibold text-sm">{hotel.hotel_reviews_ratings}/5 Excellent({hotel.hotel_reviews.length} reviews)</p> */}
                    </div>
                    <div className="text-[12px] font-semibold text-gray-400 ">
                      <p>
                        {hotel.hotel_reviews_ratings}/5 - Excellent (
                        {hotel.hotel_reviews.length} reviews)
                      </p>
                      <div className="flex gap-1 items-center">
                        <MdStar className="text-xl text-yellow-400" />
                        <p>{hotel.ratings}</p>
                      </div>
                    </div>
                    <div className="text-sm mt-2 text-gray-500 font-semibold overflow-hidden line-clamp-4">
                      <p>{hotel.description}</p>
                    </div>
                  </div>
                </div>
                <div className=" flex items-center justify-center pr-4 m-4 w-[20%]">
                  <div className="border-2 border-green-400 p-4 text-sm font-semibold rounded-lg w-full">
                    <h2 className="text-xl text-violet-950 font-bold">Price</h2>
                    <p>Starting from </p>
                    <div className="">
                      <p>
                        NPR{hotel.leastPrice} - NPR{hotel.mostExpensivePrice}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-black text-3xl flex flex-col items-center justify-center ">
              <img alt="billie" className=" " src={noFound}></img>
              <div className=" ">
                <p>No hotels found</p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
