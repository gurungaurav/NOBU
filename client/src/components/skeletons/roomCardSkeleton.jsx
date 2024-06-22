import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import MainSkeletonTheme from "./mainSkeletonTheme";

const RoomCardSkeleton = () => {
  return (
    <div className=" rounded-lg shadow-md border flex gap-6 cursor-pointer">
      <div className="h-[13rem] w-[30rem]">
        <MainSkeletonTheme>
          <Skeleton height={205} />
        </MainSkeletonTheme>
      </div>
      <div className="w-[50%] m-4">
        <MainSkeletonTheme baseColor="#e2e8f0" highlightColor="#cbd5e1">
          <div>
            <Skeleton width="50%" height={30} />
          </div>
          <div className="text-sm mt-2 text-gray-500 font-semibold overflow-hidden">
            <Skeleton count={3} />
          </div>
          <div className="flex gap-4 mt-4 font-semibold">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex gap-1 items-center">
                <Skeleton circle={true} width={20} height={20} />
                <Skeleton width={100} />
              </div>
            ))}
          </div>
        </MainSkeletonTheme>
      </div>
      <div className=" flex items-center justify-center pr-4 m-4 w-[20%]">
        <MainSkeletonTheme baseColor="#e2e8f0" highlightColor="#cbd5e1">
          <div className="border-2 border-green-400 p-4 text-sm font-semibold rounded-lg w-full">
            <Skeleton width={80} height={20} />
            <Skeleton className="mt-2" width={120} height={20} />
          </div>
        </MainSkeletonTheme>
      </div>
    </div>
  );
};

export default RoomCardSkeleton;
