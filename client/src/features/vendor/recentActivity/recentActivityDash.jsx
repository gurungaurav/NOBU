import { formatDistanceToNow, parseISO } from "date-fns";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";

export default function RecentActivityDash({ recentActivity }) {
  const format = (status) => {
    const createdAt = parseISO(status.createdAt);
    const hehe = `${status.status}  ${formatDistanceToNow(createdAt)} ago`;
    return hehe;
  };
  const navigate = useNavigate();

  const { hotel_name } = useParams();

  return (
    <div className="rounded-lg shadow-sm border bg-white mt-6  w-[30%]">
      <div className="flex justify-between items-center mb-2 border-b px-6 py-4">
        <h1 className="text-xl font-semibold ">Recent Activities</h1>
        <p
          className="text-sm hover:underline cursor-pointer font-bold hover:text-blue-500 duration-300"
          onClick={() => navigate(`/vendor/${hotel_name}/bookingLists`)}
        >
          View All
        </p>
      </div>
      <div className="flex flex-col gap-4 px-6 py-2">
        {recentActivity &&
          recentActivity?.map((hehe) => (
            <div className="flex items-center gap-2" key={hehe?.booking_id}>
              <img
                src={hehe?.user?.picture}
                className="w-14 object-cover h-14 rounded-full"
              ></img>
              <div className="flex flex-col gap-1">
                <p className="font-semibold">{hehe?.user?.user_name}</p>
                <p className="text-gray-400 text-xs font-semibold ">
                  {format({ status: hehe?.status, createdAt: hehe?.createdAt })}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

RecentActivityDash.propTypes = {
  recentActivity: PropTypes.array.isRequired,
};
