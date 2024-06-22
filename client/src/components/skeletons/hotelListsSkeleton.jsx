import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import MainSkeletonTheme from "./mainSkeletonTheme";

const HotelSkeleton = () => {
  return (
    <div className=" rounded-md flex flex-col shadow-md cursor-pointer ">
      <MainSkeletonTheme>
        <Skeleton
          containerClassName="w-full bg-transparent rounded-t-md overflow-hidden group/card relative "
          height={415}
        />
      </MainSkeletonTheme>
      <div className="pr-5 pl-5 pt-5 pb-10 ">
        <MainSkeletonTheme baseColor="#e2e8f0" highlightColor="#cbd5e1">
          <div className=" rounded-md w-fit font-semibold flex gap-4 items-center">
            <Skeleton circle={true} width={30} height={30} />
            <Skeleton width={100} />
          </div>
          <div className="flex flex-col mt-2">
            <div className="flex flex-col">
              <Skeleton width={200} height={30} />
              <Skeleton width={150} height={10} />
            </div>
            <div className="flex gap-6">
              {[1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  className="flex text-sm font-semibold mt-4 justify-between "
                >
                  <div className="flex gap-1 items-center">
                    <Skeleton circle={true} width={20} height={20} />
                    <Skeleton width={100} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MainSkeletonTheme>
      </div>
    </div>
  );
};

export default HotelSkeleton;
