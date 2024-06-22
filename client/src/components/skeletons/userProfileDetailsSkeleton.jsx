import Skeleton from "react-loading-skeleton";
import MainSkeletonTheme from "./mainSkeletonTheme";

export default function UserProfileDetailsSkeleton() {
  return (
    <>
      {[1, 2, 3].map(() => (
        <MainSkeletonTheme>
          <div className="flex flex-col gap-2">
            <div className=" w-fit font-semibold cursor-pointer">
              <Skeleton height={20} width={100}></Skeleton>
            </div>
            <div className="flex gap-1 items-center ">
              <Skeleton height={20} width={60}></Skeleton>
            </div>
          </div>
          <div className=" flex gap-6">
            {[1, 2, 3].map(() => (
              <Skeleton
                height={300}
                width={330}
                className="rounded-lg my-4"
              ></Skeleton>
            ))}
          </div>
        </MainSkeletonTheme>
      ))}
    </>
  );
}
