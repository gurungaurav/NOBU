import React from "react";
import format from "date-fns/format";
import { generateStars } from "../../utils/convertStars";

export default function ReviewsCard(props) {
  return (
    <>
      {props.reviews?.length > 0 ? (
        props.reviews.map((review) => (
          <div
            className="shadow-md border rounded-lg p-6 pb-16 w-[50%] "
            key={review.index}
          >
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 items-center">
                <div className="flex text-xl text-yellow-400">
                  {generateStars(review.ratings)}
                </div>
                <p>{review.ratings}/5 stars</p>
              </div>
              <div className="flex gap-4 items-center ">
                <h1 className="text-violet-950 text-2xl font-semibold">
                  {review.title}
                </h1>
                <div className="text-sm">
                  <p>
                    <strong>{review.user.user_name}, </strong>
                    {format(new Date(review.createdAt), "MMMM dd")}
                  </p>
                </div>
              </div>
              <div className="">
                <p>{review.content}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>No reviews for this hotel</div>
      )}
    </>
  );
}
