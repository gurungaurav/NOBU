import { format } from "date-fns/format";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/free-mode";
import "swiper/css/scrollbar";
import { generateStars } from "../../utils/convertStars";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import { deleteReviewsUser } from "../../services/client/user.service";
import { Link, useParams } from "react-router-dom";
import { Dialog } from "@mui/material";
import PropTypes from "prop-types";

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
      slidesPerView={1}
      spaceBetween={16}
      pagination={{
        clickable: true,
      }}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      breakpoints={{
        640: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: 2,
          spaceBetween: 28,
        },
        1280: {
          slidesPerView: 3,
          spaceBetween: 32,
        },
      }}
      modules={[Pagination, Autoplay]}
      className="w-full max-w-7xl mx-auto"
    >
      {reviews != null ? (
        reviews?.map((review) => (
          <SwiperSlide className="p-2" key={review.index}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 h-full min-h-[280px] sm:min-h-[320px] transition-shadow duration-300 hover:shadow-md">
              <div className="flex flex-col h-full">
                {/* Header with hotel info and delete button */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Link to={`/mainHotel/${review?.hotel?.hotel_id}`}>
                      <img
                        src={review?.hotel?.hotel_picture}
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        alt={`${review?.hotel?.hotel_name} image`}
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                        {review?.hotel?.hotel_name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {format(new Date(review.createdAt), "MMMM dd")}
                      </p>
                    </div>
                  </div>
                  <button
                    className="p-2 hover:bg-red-50 rounded-full transition-colors duration-200 text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteDialog(review?.reviews_id)}
                    aria-label="Delete review"
                  >
                    <RxCross1 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex text-yellow-400">
                    {generateStars(review.ratings)}
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 font-medium">
                    {review.ratings}/5 stars
                  </p>
                </div>

                {/* Review Title */}
                <h1 className="text-purple-900 text-lg sm:text-xl font-semibold mb-3 line-clamp-2">
                  {review.title}
                </h1>

                {/* Review Content */}
                <div className="flex-1 mb-4">
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed line-clamp-4">
                    {review.content}
                  </p>
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
              <div className="flex max-w-sm sm:max-w-lg flex-col items-center rounded-xl border px-4 py-6 sm:px-8 sm:py-10 text-gray-800 shadow-lg bg-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-red-50 p-2 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <p className="mt-4 text-center text-lg sm:text-xl font-bold">
                  Do you want to delete this review?
                </p>
                <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
                  Are you sure you want to delete the review of hotel{" "}
                  <span className="truncate font-medium text-gray-800">
                    {review?.hotel?.hotel_name}
                  </span>
                  ?
                </p>
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    className="whitespace-nowrap rounded-lg bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700 transition-colors duration-200"
                    onClick={deleteReview}
                  >
                    Yes, delete the review
                  </button>
                  <button
                    className="whitespace-nowrap rounded-lg bg-gray-200 px-4 py-3 font-medium hover:bg-gray-300 transition-colors duration-200"
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
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <svg
            className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1l-4 4z"
            />
          </svg>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            No reviews yet
          </h3>
          <p className="text-gray-600 text-sm sm:text-base max-w-md">
            You haven&apos;t written any reviews yet. Book a hotel and share
            your experience with other travelers!
          </p>
        </div>
      )}
    </Swiper>
  );
}

ProfileReviews.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      index: PropTypes.number,
      reviews_id: PropTypes.number,
      hotel: PropTypes.shape({
        hotel_id: PropTypes.number,
        hotel_picture: PropTypes.string,
        hotel_name: PropTypes.string,
      }),
      ratings: PropTypes.number,
      title: PropTypes.string,
      content: PropTypes.string,
      createdAt: PropTypes.string,
    })
  ),
};
