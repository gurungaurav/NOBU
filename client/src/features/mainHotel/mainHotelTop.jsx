import React, { useState } from "react";
import { BiTargetLock } from "react-icons/bi";

import SliderMain from "../../components/slider/swiperMain";
import { amenityIcons } from "../../icons/amenitiesIcons";
import SliderMainHotelSkeleton from "../../components/skeletons/sliderMainHotelSkeleton";
import Skeleton from "react-loading-skeleton";
import MainSkeletonTheme from "../../components/skeletons/mainSkeletonTheme";

export default function MainHotelTop(props) {
  const hotelDetails = props?.hotelDetails;
  const roomDetails = props?.roomDetails;
  const loading = props?.loading;

  console.log(hotelDetails);
  return (
    <>
      <div className="">
        {loading ? (
          <MainSkeletonTheme>
            <Skeleton width={200} height={30}></Skeleton>
            <div className="flex gap-4 items-center mt-1">
              <Skeleton circle={true} width={30} height={30}></Skeleton>
              <Skeleton width={100} height={20}></Skeleton>
            </div>
          </MainSkeletonTheme>
        ) : (
          <div className="flex flex-col">
            <p className="text-4xl font-bold text-violet-950">
              {hotelDetails?.hotel_name}
            </p>
            <div className="flex gap-4 items-center">
              <BiTargetLock className="text-4xl font-bold" />
              <div className="flex flex-col font-semibold">
                <p>{hotelDetails?.location}</p>
              </div>
            </div>
          </div>
        )}
        {/* <div className="flex items-center">
          <BiBookmark className="text-3xl" />
          <div className="p-3 border-black border-2 ">
            <p className="text-xl">Book</p> 
          </div>
        </div> */}
      </div>
      {loading ? (
        <SliderMainHotelSkeleton />
      ) : (
        <div className="w-full h-[30rem] ">
          <SliderMain pictures={hotelDetails?.other_pictures} />
          {/* <img className="w-full h-full object-cover" src={bill}></img> */}
        </div>
      )}
      <div className="flex flex-col gap-4 pl-40 pr-40">
        <div className="pt-2 ">
          {loading ? (
            <MainSkeletonTheme>
              <Skeleton width={1200} height={20}></Skeleton>
              <Skeleton width={1100} height={20}></Skeleton>
              <Skeleton width={1180} height={20}></Skeleton>
              <Skeleton width={1190} height={20}></Skeleton>
              <Skeleton width={1000} height={20}></Skeleton>
            </MainSkeletonTheme>
          ) : (
            <p>{hotelDetails?.description}</p>
          )}
        </div>

        <div className=" border-t border-t-violet-950  pt-4 flex flex-col gap-4">
          {loading ? (
            <MainSkeletonTheme>
              <Skeleton width={150} height={30}></Skeleton>
              <Skeleton className="mt-6" width={100} height={20}></Skeleton>
              <div className="grid grid-cols-2 w-[25rem]">
                {[1, 2, 3, 4, 5, 6].map(() => (
                  <div className="flex gap-2 items-center mt-4">
                    <Skeleton circle={true} width={20} height={20}></Skeleton>
                    <Skeleton width={50} height={15}></Skeleton>
                  </div>
                ))}
              </div>
              <Skeleton className="mt-6" width={100} height={20}></Skeleton>
              <div className="grid grid-cols-2 w-[25rem]">
                {[1, 2, 3, 4, 5, 6].map(() => (
                  <div className="flex gap-2 items-center mt-4">
                    <Skeleton circle={true} width={20} height={20}></Skeleton>
                    <Skeleton width={50} height={15}></Skeleton>
                  </div>
                ))}
              </div>
            </MainSkeletonTheme>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-violet-950">At Hotel</h1>
              <div>
                <p className="font-semibold text-xl">Amenities:</p>
                <div className="grid grid-cols-2 gap-2 w-[30rem] mt-2">
                  {hotelDetails?.hotel_amenities &&
                    hotelDetails.hotel_amenities.map((amen, index) => (
                      <ul key={index}>
                        <li className="flex gap-1 items-center">
                          {amenityIcons[amen]} {amen}
                        </li>
                      </ul>
                    ))}
                </div>
              </div>
              <div>
                <p className="font-semibold text-xl">Additional Services:</p>
                <div className="grid grid-cols-2 w-[25rem] mt-2">
                  {hotelDetails?.additionalServices &&
                    hotelDetails.additionalServices.map((service, index) => (
                      <ul key={index}>
                        <li className="flex gap-1 items-center">
                          {amenityIcons[service.service_name]}{" "}
                          {service.service_name}
                        </li>
                      </ul>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
