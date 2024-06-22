import { format } from "date-fns/format";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css/free-mode";
import "swiper/css/scrollbar";
import { generateStars } from "../../utils/convertStars";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import { deleteReviewsUser } from "../../services/client/user.service";
import { Link, useParams } from "react-router-dom";
import { Dialog } from "@mui/material";

export default function ProfileReviews(props) {
  const reviews = props.reviews; // Set initial state as empty array
  console.log(reviews);
  const { user_id } = useParams();
  const [deleteId, setDeleteId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const deleteReview = async () => {
    try {
      const res = await deleteReviewsUser(deleteId, user_id);
      console.log(res.data);
      toast.success(res.data.message);
      // setReviews(reviews.filter((review) => review.reviews_id !== deleteId));

      setOpenDeleteDialog(false);
      setDeleteId(null);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  const handleDeleteDialog = (review_id) => {
    setDeleteId(review_id);
    setOpenDeleteDialog(true);
  };

  return (
    <Swiper
      slidesPerView={3}
      spaceBetween={10}
      pagination={{
        clickable: true,
      }}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      modules={[Pagination, Autoplay]}
      className="w-[65rem] "
    >
      {reviews != null ? (
        reviews?.map((review) => (
          <SwiperSlide className="p-2" key={review.index}>
            <div className="shadow-md rounded-lg p-6 pb-16 border  ">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link to={`/mainHotel/${review?.hotel?.hotel_id}`}>
                      <img
                        src={review?.hotel?.hotel_picture}
                        className="h-[3rem] w-[3rem] rounded-full object-cover cursor-pointer"
                      ></img>
                    </Link>
                    <p className="font-bold text-sm">
                      {review?.hotel?.hotel_name}
                    </p>
                  </div>
                  <div
                    className="cursor-pointer "
                    onClick={() => handleDeleteDialog(review?.reviews_id)}
                  >
                    <RxCross1 className="font-bold text-xl" />
                  </div>
                </div>

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
                  <p className="text-sm font-semibold">
                    {format(new Date(review.createdAt), "MMMM dd")}
                  </p>
                </div>
                <div className="line-clamp-4 h-[6rem] ">
                  <p>{review.content}</p>
                </div>
              </div>
            </div>
            <Dialog
              className="absolute"
              open={openDeleteDialog}
              onClose={() => {
                setOpenDeleteDialog(false);
                setDeleteId(null);
              }}
            >
              <div className=" flex max-w-lg flex-col items-center rounded-md border px-8 py-10 text-gray-800 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 rounded-xl bg-red-50 p-2 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <p className="mt-4 text-center text-xl font-bold">
                  Do you want to delete this review?
                </p>
                <p className="mt-2 text-center text-lg">
                  Are you sure you want to delete the review of hotel{" "}
                  <span className="truncate font-medium">
                    {review?.hotel?.hotel_name}
                  </span>
                  ?
                </p>
                <div className="mt-8 flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                  <button
                    className="whitespace-nowrap rounded-md bg-violet-950 px-4 py-3 font-medium text-white"
                    onClick={deleteReview}
                  >
                    Yes, delete the review
                  </button>
                  <button
                    className="whitespace-nowrap rounded-md bg-gray-200 px-4 py-3 font-medium"
                    onClick={() => {
                      setOpenDeleteDialog(false);
                      setDeleteId(null);
                    }}
                  >
                    Cancel, keep the review
                  </button>
                </div>
              </div>
            </Dialog>
          </SwiperSlide>
        ))
      ) : (
        <div>
          <p>No reviews</p>
        </div>
      )}
    </Swiper>
  );
}
