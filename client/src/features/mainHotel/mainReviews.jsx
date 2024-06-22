import React, { useEffect } from "react";
import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";
import { format } from "date-fns/format";
import { MdStar } from "react-icons/md";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import MainHeaders from "../../components/mainHeaders/mainHeaders";
import { useNavigate, useParams } from "react-router-dom";

export default function MainReviews({ reviews }) {
  // Initialize Glide.js slider using useEffect
  useEffect(() => {
    const glide = new Glide(".glide", {
      type: "carousel",
      startAt: 0,
      perView: 3, // Number of slides to show at once
      breakpoints: {
        800: {
          perView: 1,
        },
        600: {
          perView: 1,
        },
      },
    });

    glide.mount();
  }, [reviews]); // Dependency array ensures the effect runs when reviews change

  const navigate = useNavigate();

  const generateStars = (ratings) => {
    const filledStars = Math.floor(ratings);
    const hasHalfStar = ratings % 1 !== 0;

    const starArray = [];

    // Add filled stars
    for (let i = 0; i < filledStars; i++) {
      starArray.push(<MdStar key={i} />);
    }

    // Add half star if applicable
    if (hasHalfStar) {
      starArray.push(<MdStar key="half" className="text-yellow-400" />);
    }

    // Add empty stars to fill the remaining space
    for (let i = starArray.length; i < 5; i++) {
      starArray.push(<MdStar key={`empty${i}`} className="text-gray-400" />);
    }

    return starArray;
  };

  const { hotel_id } = useParams();

  const reviewList = reviews?.length >= 5 ? reviews.slice(0, 5) : reviews;
  console.log(reviewList?.length);
  return (
    <div className="flex flex-col gap-8">
      <MainHeaders Headers={"Guest Reviews"} />

      <div className="glide ">
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides ">
            {reviewList?.map((review, index) => (
              <div key={index} className="glide__slide ">
                <div className="hover:shadow-lg ease-in duration-700 rounded-lg p-6 pb-16 border-b-4 h-[20rem]">
                  <div className="flex flex-col gap-4 ">
                    <div className="flex gap-3 items-center">
                      <div className="flex text-xl text-yellow-400">
                        {generateStars(review.ratings)}
                      </div>
                      <p className="">{review.ratings}/5 stars</p>
                    </div>
                    <div className="flex gap-4 items-center">
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
              </div>
            ))}
          </ul>
        </div>
        <div className="glide__arrows" data-glide-el="controls">
          <button
            className="glide__arrow glide__arrow--left"
            data-glide-dir="<"
          >
            <IoIosArrowDropleftCircle className="text-violet-950 text-2xl" />
          </button>
          <button
            className="glide__arrow glide__arrow--right"
            data-glide-dir=">"
          >
            <IoIosArrowDroprightCircle className="text-violet-950 text-2xl" />
          </button>
        </div>
      </div>
      <div
        className="flex justify-center items-center cursor-pointer "
        onClick={() => navigate(`/mainHotel/${hotel_id}/reviews`)}
      >
        <div className="p-2 bg-violet-950 text-white font-semibold transform hover:scale-105 transition-transform duration-300 ease-in">
          <p>Load more</p>
        </div>
      </div>
    </div>
  );
}
