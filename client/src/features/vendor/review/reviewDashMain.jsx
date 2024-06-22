import PropTypes from "prop-types";
import { useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { generateStars } from "../../../utils/convertStars";
import { useNavigate, useParams } from "react-router-dom";

export default function ReviewDashMain({ reviews }) {
  const [mainReview, setMainReview] = useState(0);
  const navigate = useNavigate();

  const handleMainReview = (index) => {
    setMainReview(index);
  };
  const { hotel_name } = useParams();

  const convertDateTime = (createdAt) => {
    const hehe = parseISO(createdAt);
    return formatDistanceToNow(hehe);
  };
  return (
    <div className="rounded-lg shadow-sm border bg-white mt-6 w-full">
      <div className="flex justify-between items-center  border-b px-6 py-4">
        <h1 className="text-xl font-semibold ">Customer Reviews </h1>
        <p
          className="text-sm hover:underline cursor-pointer font-bold hover:text-blue-500 duration-300"
          onClick={() => navigate(`/vendor/${hotel_name}/reviewsLists`)}
        >
          View All
        </p>
      </div>{" "}
      <div className="flex h-[23rem] ">
        <div className="  overflow-auto custom-scrollbar pt-2 pr-6">
          {reviews?.map((review, index) => (
            <div
              key={review.review_id}
              className="flex gap-4 items-center py-2 px-6 duration-300 rounded-md hover:bg-gray-100 cursor-pointer "
              onClick={() => handleMainReview(index)}
            >
              <img
                className="w-14 h-14 rounded-full object-cover"
                src={review?.user?.profile}
              ></img>
              <div className="flex flex-col gap-1 items-start ">
                <p className="text-xl font-semibold">
                  {review?.user?.user_name}
                </p>
                <p className="text-xs font-semibold text-gray-400">
                  {convertDateTime(review?.createdAt)} ago
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className=" pl-4 border-l pt-4">
          <p className="text-2xl font-semibold mb-2">
            {reviews?.[mainReview]?.title}
          </p>
          <div className="flex text-xl text-yellow-400 gap-1 items-center ">
            {generateStars(reviews?.[mainReview]?.ratings)}
          </div>
          <div className="mt-4 w-[40rem]">
            <p>{reviews?.[mainReview]?.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
ReviewDashMain.propTypes = {
  reviews: PropTypes.array.isRequired,
};
