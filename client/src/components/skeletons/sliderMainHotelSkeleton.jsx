import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import MainSkeletonTheme from "./mainSkeletonTheme";

export default function SliderMainHotelSkeleton() {
  return (
    <div>
      <MainSkeletonTheme>
        <Skeleton borderRadius={15} width={1530} height={478}></Skeleton>
      </MainSkeletonTheme>
    </div>
  );
}
