import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/free-mode";
import "swiper/css/scrollbar";
import { RxCross1 } from "react-icons/rx";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog } from "@mui/material";
import { deleteBlogsUser } from "../../services/client/user.service";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

export default function ProfileBlogs(props) {
  const blogs = props.blogs;
  console.log(blogs);

  const [deleteId, setDeleteId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { user_id } = useParams();

  const navigate = useNavigate();

  const handleRedirect = (blog_id) => {
    navigate(`/blogs/${blog_id}`);
  };

  const deleteReview = async () => {
    try {
      const res = await deleteBlogsUser(deleteId, user_id);
      console.log(res.data);
      toast.success(res.data.message);
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
      className="w-full max-w-7xl mx-auto h-64 sm:h-72 lg:h-80"
    >
      {blogs != null ? (
        blogs?.map((blog) => (
          <SwiperSlide key={blog?.blog_id}>
            <div className="relative h-full overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div
                onClick={() => handleRedirect(blog?.blog_id)}
                className="hover:scale-105 duration-500 rounded-xl h-full cursor-pointer group"
              >
                <img
                  alt={blog?.title || "Blog image"}
                  className="h-full w-full rounded-xl object-cover"
                  src={blog?.picture}
                />

                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-xl" />

                {/* Blog content */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 text-white">
                  <h3 className="font-semibold text-sm sm:text-base mb-2 line-clamp-2">
                    {blog?.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-200 line-clamp-3 leading-relaxed">
                    {blog?.content}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2">
                <button
                  onClick={() =>
                    navigate(`/blogs/updateBlogs/${blog?.blog_id}`)
                  }
                  className="px-3 py-1 text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors duration-200 font-medium"
                  aria-label="Edit blog"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteDialog(blog?.blog_id)}
                  className="p-2 bg-black/20 hover:bg-red-500 rounded-full transition-colors duration-200"
                  aria-label="Delete blog"
                >
                  <RxCross1 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            <Dialog
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
                  Delete this blog?
                </p>
                <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
                  Are you sure you want to permanently delete this blog post?
                  This action cannot be undone.
                </p>
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    className="whitespace-nowrap rounded-lg bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700 transition-colors duration-200"
                    onClick={deleteReview}
                  >
                    Yes, delete blog
                  </button>
                  <button
                    className="whitespace-nowrap rounded-lg bg-gray-200 px-4 py-3 font-medium hover:bg-gray-300 transition-colors duration-200"
                    onClick={() => {
                      setOpenDeleteDialog(false);
                      setDeleteId(null);
                    }}
                  >
                    Cancel, keep blog
                  </button>
                </div>
              </div>
            </Dialog>
          </SwiperSlide>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center h-full">
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
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            No blog posts yet
          </h3>
          <p className="text-gray-600 text-sm sm:text-base max-w-md">
            You haven&apos;t written any blog posts yet. Start sharing your
            travel experiences and stories with the community!
          </p>
        </div>
      )}
    </Swiper>
  );
}

ProfileBlogs.propTypes = {
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      blog_id: PropTypes.number,
      title: PropTypes.string,
      content: PropTypes.string,
      picture: PropTypes.string,
    })
  ),
};
