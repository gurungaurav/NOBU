import React, { useState } from "react";
import { MdStar, MdStarHalf } from "react-icons/md";
import ReviewForm from "./reviewForm";
import { Dialog, Button } from "@mui/material";
import { IoMdClose } from "react-icons/io";

export default function ReviewTop(props) {
  const [showForm, setShowForm] = useState(false);

  const generateStars = (ratings) => {
    // Round ratings to the nearest half
    const roundedRatings = Math.round(ratings * 2) / 2;

    const filledStars = Math.floor(roundedRatings);
    const hasHalfStar = roundedRatings % 1 !== 0;

    const starArray = [];

    // Add filled stars
    for (let i = 0; i < filledStars; i++) {
      starArray.push(<MdStar key={i} />);
    }

    // Add half star if applicable
    if (hasHalfStar) {
      starArray.push(<MdStarHalf key="half" className="text-yellow-400" />);
    }

    // Add empty stars to fill the remaining space
    for (let i = starArray.length; i < 5; i++) {
      starArray.push(<MdStar key={`empty${i}`} className="text-gray-400" />);
    }

    return starArray;
  };

  return (
    <div className="bg-violet-950 w-full  text-white flex items-center justify-center">
      <div className="p-10 flex flex-col gap-10">
        <div className="flex items-center justify-center">
          <h6 className=" text-5xl font-serif">REVIEWS</h6>
        </div>
        <div className="flex items-center justify-around gap-x-48">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p className="text-xl">{props.averageRatings}/5 stars </p>
              <div className="flex text-xl text-yellow-400 ">
                {generateStars(props.averageRatings)}
              </div>
            </div>
            <div className="text-sm font-semibold">
              <p>Average rating based on {props.totalReviews} reviews</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <div className="shadow-lg text-white rounded-lg p-4 bg-violet-950 text-sm cursor-pointer hover:bg-violet-950">
              <p>Post your review</p>
            </div>
          </Button>
          <Dialog open={showForm} onClose={() => setShowForm(false)}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color: "#888",
                }}
              >
                <IoMdClose className="mr-2 mt-2 text-4xl" />
              </button>
            </div>
            <ReviewForm />
          </Dialog>
        </div>
      </div>
    </div>
  );
}
