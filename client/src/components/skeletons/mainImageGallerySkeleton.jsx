import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import MainSkeletonTheme from "./mainSkeletonTheme";

const RoomImagesSkeleton = () => {
  return (
    <div className="flex gap-2 rounded-xl max-h-[30rem] relative">
      <div className="">
        <MainSkeletonTheme>
          <Skeleton
            height={470}
            width={892}
            borderRadius={10}
            className="rounded-l-xl"
          />
        </MainSkeletonTheme>
      </div>
      <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-r-xl">
        {[1, 2, 3, 4].map((_, index) => (
          <div key={index} className="">
            <MainSkeletonTheme>
              <Skeleton height={228} width={310} />
            </MainSkeletonTheme>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomImagesSkeleton;
