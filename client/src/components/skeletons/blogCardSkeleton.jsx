import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import MainSkeletonTheme from "./mainSkeletonTheme";

const BlogCardSkeleton = () => {
  return (
    <MainSkeletonTheme>
      <div className="flex flex-col border shadow-lg cursor-pointer transition-transform duration-300 transform-gpu hover:shadow-md hover:-translate-y-1">
        <div className="h-[15rem] border">
          <Skeleton height={235} />
        </div>
        <div className="flex flex-col pl-5 pr-5 pt-2 pb-8 h-[12rem]">
          <p className="text-violet-950 font-semibold text-xl">
            <Skeleton width={100} />
          </p>
          <div className="">
            <p className="items-center font-bold text-xl line-clamp-3 tracking-wide uppercase">
              <Skeleton width={200} />
            </p>
            <div className="text-neutral-500 font-semibold overflow-hidden line-clamp-2 text-xs font-serif mt-3">
              <Skeleton count={2} />
            </div>
          </div>
        </div>
      </div>
    </MainSkeletonTheme>
  );
};

export default BlogCardSkeleton;
