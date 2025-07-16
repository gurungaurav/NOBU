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
      <div className="px-4 sm:px-6 lg:px-8">
        {loading ? (
          <MainSkeletonTheme>
            <Skeleton width={200} height={30}></Skeleton>
            <div className="flex gap-4 items-center mt-1">
              <Skeleton circle={true} width={30} height={30}></Skeleton>
              <Skeleton width={100} height={20}></Skeleton>
            </div>
          </MainSkeletonTheme>
        ) : (
          <div className="flex flex-col gap-2 sm:gap-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-violet-950 leading-tight">
              {hotelDetails?.hotel_name}
            </h1>
            <div className="flex gap-2 sm:gap-3 lg:gap-4 items-center">
              <BiTargetLock className="text-2xl sm:text-3xl lg:text-4xl text-violet-950 flex-shrink-0" />
              <div className="flex flex-col font-semibold min-w-0">
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 truncate">
                  {hotelDetails?.location}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {loading ? (
        <SliderMainHotelSkeleton />
      ) : (
        <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] xl:h-[30rem] mt-4 sm:mt-6">
          <SliderMain pictures={hotelDetails?.other_pictures} />
        </div>
      )}
      <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="pt-4 sm:pt-6">
          {loading ? (
            <MainSkeletonTheme>
              <Skeleton width="100%" height={20}></Skeleton>
              <Skeleton width="95%" height={20}></Skeleton>
              <Skeleton width="98%" height={20}></Skeleton>
              <Skeleton width="92%" height={20}></Skeleton>
              <Skeleton width="85%" height={20}></Skeleton>
            </MainSkeletonTheme>
          ) : (
            <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700">
              {hotelDetails?.description}
            </p>
          )}
        </div>

        <div className="border-t border-t-violet-950 pt-4 sm:pt-6 lg:pt-8 flex flex-col gap-4 sm:gap-6 lg:gap-8">
          {loading ? (
            <MainSkeletonTheme>
              <Skeleton width={150} height={30}></Skeleton>
              <Skeleton className="mt-6" width={100} height={20}></Skeleton>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 max-w-2xl">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="flex gap-2 items-center mt-4">
                    <Skeleton circle={true} width={20} height={20}></Skeleton>
                    <Skeleton width={50} height={15}></Skeleton>
                  </div>
                ))}
              </div>
              <Skeleton className="mt-6" width={100} height={20}></Skeleton>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 max-w-2xl">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="flex gap-2 items-center mt-4">
                    <Skeleton circle={true} width={20} height={20}></Skeleton>
                    <Skeleton width={50} height={15}></Skeleton>
                  </div>
                ))}
              </div>
            </MainSkeletonTheme>
          ) : (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-violet-950">
                At Hotel
              </h2>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="font-semibold text-lg sm:text-xl text-violet-950 mb-3 sm:mb-4">
                    Amenities:
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 ">
                    {hotelDetails?.hotel_amenities &&
                      hotelDetails.hotel_amenities.map((amen, index) => (
                        <div
                          key={index}
                          className="flex gap-2 sm:gap-3 items-center bg-gray-50 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-violet-600 text-lg sm:text-xl flex-shrink-0">
                            {amenityIcons[amen]}
                          </span>
                          <span className="text-sm sm:text-base text-gray-700 font-medium">
                            {amen}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg sm:text-xl text-violet-950 mb-3 sm:mb-4">
                    Additional Services:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 max-w-none sm:max-w-2xl lg:max-w-4xl">
                    {hotelDetails?.additionalServices &&
                      hotelDetails.additionalServices.map((service, index) => (
                        <div
                          key={index}
                          className="flex gap-2 sm:gap-3 items-center bg-gray-50 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-violet-600 text-lg sm:text-xl flex-shrink-0">
                            {amenityIcons[service.service_name]}
                          </span>
                          <span className="text-sm sm:text-base text-gray-700 font-medium">
                            {service.service_name}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
