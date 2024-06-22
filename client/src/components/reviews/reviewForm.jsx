import React from "react";
import { MdStar } from "react-icons/md";
import { useParams } from "react-router-dom";
import { postHotelReviews } from "../../services/client/user.service";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { reviewHotelSchema } from "../../schemas/client/reviewSchema";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function ReviewForm() {
  const { hotel_id } = useParams();
  const { id, jwt, role } = useSelector((state) => state.user);

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues: {
      ratings: 0, // Update this line
      title: "",
      content: "",
    },
    validationSchema: reviewHotelSchema,
    onSubmit: async () => {
      await sendReview();
    },
  });

  const handleRatingClick = (selectedRating) => {
    setFieldValue("ratings", selectedRating); // Update Formik state for rating
  };

  const sendReview = async () => {
    try {
      const res = await postHotelReviews(hotel_id, id, values, jwt);

      if (res.data.success) {
        // Display success toast
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: res.data.message,
        });
        resetForm();
      }
    } catch (error) {
      console.error(error.response.data.message);
      // Display generic error toast
      let message = error.response.data.message;
      Swal.fire({
        icon: "error",
        title: "An error occurred",
        text: message,
      });
    }
  };

  return (
    <div className="p-4 rounded-lg flex items-center justify-center">
      <form
        className="flex flex-col items-center justify-center font-semibold"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-center h-[6rem] ">
          <p>Please rate the hotel:</p>
          <div className="flex gap-2 text-4xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button" // Add type="button" here
                key={star}
                className={`cursor-pointer ${
                  star <= values.ratings ? "text-yellow-400" : "text-gray-400"
                }`}
                onClick={() => handleRatingClick(star)}
              >
                <MdStar />
              </button>
            ))}
          </div>
          {touched.ratings && errors.ratings ? (
            <div className="text-red-600">{errors.ratings}</div>
          ) : null}
        </div>
        <div className="flex flex-col mt-2">
          <div className="flex gap-2 items-center">
            <div className="border-2 w-fit rounded-md">
              <input
                name="title"
                value={values.title}
                onBlur={handleBlur}
                onChange={handleChange}
                className="outline-none p-2"
                placeholder="Write the title"
              />
            </div>
            {touched.title && errors.title ? (
              <div className="text-red-600">{errors.title}</div>
            ) : null}
          </div>
          <div className="mt-2">
            <textarea
              name="content"
              value={values.content}
              onBlur={handleBlur}
              onChange={handleChange}
              className="border-2 border-gray-300 p-2 rounded-md outline-none"
              placeholder="Write your review"
              rows="4"
              cols="50"
            />
            {touched.content && errors.content ? (
              <div className="text-red-600">{errors.content}</div>
            ) : null}
          </div>
        </div>
        <button
          type="submit"
          className="rounded-md bg-violet-950 p-2 text-white font-semibold cursor-pointer hover:bg-violet-950"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
