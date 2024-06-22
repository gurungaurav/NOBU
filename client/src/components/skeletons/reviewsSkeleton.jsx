import Skeleton from "react-loading-skeleton";
import MainSkeletonTheme from "./mainSkeletonTheme";

const ReviewSkeleton = () => {
  return (
    <div className="shadow-md border rounded-lg p-6 pb-16 w-[50%]">
      <MainSkeletonTheme>
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 items-center">
            <div className="flex text-xl text-yellow-400">
              <Skeleton count={1} width={120} />
            </div>
            <p>
              <Skeleton width={80} />
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <h1 className="text-violet-950 text-2xl font-semibold">
              <Skeleton width={200} />
            </h1>
            <div className="text-sm">
              <p>
                <strong>
                  <Skeleton width={100} />
                </strong>
                <Skeleton width={100} />
              </p>
            </div>
          </div>
          <div className="">
            <p>
              <Skeleton count={3} />
            </p>
          </div>
        </div>
      </MainSkeletonTheme>
    </div>
  );
};

export default ReviewSkeleton;
