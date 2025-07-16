import React, { useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { registerAccount } from "../../services/auth/loginResgiter.service";
import fomBg from "../../assets/login.jpg";
import { RxCross1 } from "react-icons/rx";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { AiOutlineLock, AiOutlineMail } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { signUpValiSchema } from "../../schemas/client/signUpSchema";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination } from "swiper/modules";
import { FiPhone } from "react-icons/fi";
import { CircularProgress } from "@mui/material";
// import PasswordStrengthBar from "react-password-strength-bar";

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone_number: "",
  profile_picture: null,
};

export default function RegistrationForm() {
  const [viewFile, setViewFile] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    handleBlur,
    handleChange,
    touched,
    values,
    errors,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: signUpValiSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("confirmPassword", values.confirmPassword);
      formData.append("profile_picture", values.profile_picture);
      formData.append("phone_number", values.phone_number);
      await submitRegister(formData);
    },
  });

  const handleFileChange = (event) => {
    console.log(event);
    const file = event.target.files[0];
    setFieldValue("profile_picture", file);

    //!This is for image view of the form
    //Generating downloadable files using the URL.createObjectURL() method to create a URL for the Blob(Binary Large Object_).
    const fileURL = URL.createObjectURL(file);
    setViewFile(fileURL);
  };

  const submitRegister = async (formData) => {
    try {
      const res = await registerAccount(formData);
      const message = res.data.message;
      setLoading(false);
      toast.success(message);
      navigate("/login");
    } catch (error) {
      const errorMessage = error.response.data.message;
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-violet-100 ">
      <form
        className="flex flex-col lg:flex-row  bg-center bg-white items-center rounded-xl h-fit shadow-xl w-full max-w-7xl overflow-hidden"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="flex flex-col px-6 sm:px-12 py-8 lg:py-0 w-full ">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex flex-col h-[90px] w-full">
              <div className="rounded-md border-2 p-3 sm:p-4 flex items-center gap-2">
                <MdDriveFileRenameOutline className="text-neutral-500 text-xl flex-shrink-0" />
                <input
                  className="outline-none w-full min-w-0"
                  placeholder="Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></input>
              </div>
              {errors.name && touched.name ? (
                <p className="text-red-600 text-xs">{errors.name}</p>
              ) : null}
            </div>
            <div className="flex flex-col h-[90px] w-full">
              <div className="rounded-md border-2 p-3 sm:p-4 flex items-center gap-2">
                <FiPhone className="text-neutral-500 text-xl flex-shrink-0" />
                <input
                  className="outline-none w-full min-w-0"
                  placeholder="Phone"
                  type="number"
                  name="phone_number"
                  value={values.phone_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></input>
              </div>
              {errors.phone_number && touched.phone_number ? (
                <p className="text-red-600 text-xs">{errors.phone_number}</p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col h-[90px] w-full">
            <div className="rounded-md border-2 p-3 sm:p-4 flex items-center gap-2">
              <AiOutlineMail className="text-neutral-500 text-xl flex-shrink-0" />
              <input
                className="outline-none w-full min-w-0"
                placeholder="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              ></input>
            </div>
            {errors.email && touched.email ? (
              <p className="text-red-600 text-xs">{errors.email}</p>
            ) : null}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex flex-col h-[90px] w-full">
              <div className="rounded-md border-2 p-3 sm:p-4 flex items-center gap-2">
                <AiOutlineLock className="text-neutral-500 text-xl flex-shrink-0" />
                <input
                  className="outline-none w-full min-w-0"
                  placeholder="Password"
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></input>
              </div>
              {errors.password && touched.password ? (
                <p className="text-red-600 text-xs">{errors.password}</p>
              ) : null}
            </div>
            <div className="flex flex-col h-[90px] w-full">
              <div className="rounded-md border-2 p-3 sm:p-4 flex items-center gap-2">
                <AiOutlineLock className="text-neutral-500 text-xl flex-shrink-0" />
                <input
                  className="outline-none w-full min-w-0"
                  placeholder="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></input>
              </div>
              {errors.confirmPassword && touched.confirmPassword ? (
                <p className="text-red-600 text-xs">{errors.confirmPassword}</p>
              ) : null}
            </div>
          </div>
          <p className="text-red-600 text-sm mb-1">*Optional</p>
          {viewFile ? (
            <div className="relative rounded-xl">
              <div className="w-full h-40 sm:h-52 rounded-xl">
                <img
                  src={viewFile}
                  className="w-full h-full rounded-xl object-cover"
                  alt="Profile preview"
                ></img>
              </div>
              <div
                className="p-1 absolute top-2 right-2 cursor-pointer bg-black bg-opacity-50 rounded-full text-white text-xl sm:text-2xl hover:bg-opacity-70 transition-all"
                onClick={() => {
                  setViewFile(null);
                  setFieldValue("profile_picture", null);
                }}
              >
                <RxCross1 />
              </div>
            </div>
          ) : (
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-40 sm:h-52 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 mb-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-xs sm:text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span>
                </p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG</p>
              </div>
              <input
                className="cursor-pointer"
                style={{ display: "none" }}
                type="file"
                id="dropzone-file"
                name="profile_picture"
                accept="image/*"
                onChange={handleFileChange}
                onBlur={handleBlur}
              ></input>
            </label>
          )}
          <button
            className={`transition ease-in-out delay-150 flex gap-2 items-center justify-center bg-violet-950 text-white font-semibold hover:bg-opacity-90 duration-300 p-3 rounded-md mt-6 w-full ${
              loading && "cursor-not-allowed bg-opacity-90  bg-violet-950/70"
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <div className="flex flex-wrap gap-1 text-sm mt-2 items-center justify-center text-center">
            <p>Already have an account? You can go to </p>
            <Link to="/login">
              <p className="font-semibold hover:underline text-violet-950">
                Login
              </p>
            </Link>
            <p>page now</p>
          </div>
        </div>
        <div className="hidden lg:block  w-full lg:w-full h-[40rem] lg:h-[700px] relative">
          <img
            className="w-full  h-full object-cover rounded-r-lg"
            src={fomBg}
            alt="Registration background"
          ></img>
          <div className="absolute top-[8rem] lg:top-[12rem] text-white w-full flex flex-col items-center justify-center">
            <div className="backdrop-blur-sm bg-white bg-opacity-20 rounded-md py-6 lg:py-10 px-6 lg:px-8 w-[18rem] lg:w-[20rem]">
              <h1 className="text-2xl lg:text-3xl font-semibold tracking-wider">
                Welcome!
              </h1>
              <p className="text-base lg:text-lg font-semibold mt-1 tracking-wider">
                Please register to continue
              </p>
              <p className="mt-6 lg:mt-10 text-xs tracking-wider">
                Explore exclusive hotel deals and book your dream stay with
                ease.
              </p>
            </div>
            <div className="w-[12rem] lg:w-[15rem] mt-8 lg:mt-14 text-xs lg:text-sm">
              <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                modules={[Autoplay, Pagination]}
                className="mySwiper text-center"
              >
                <SwiperSlide className="mb-6 lg:mb-10">
                  <div className="text-center">
                    <p className="">
                      Explore our wide range of destinations and find your
                      perfect getaway.
                    </p>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="mb-6 lg:mb-10">
                  <div className="text-center">
                    <p className="">
                      Unlock exclusive deals and discounts on luxury hotels
                      worldwide.
                    </p>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="mb-6 lg:mb-10">
                  <div className="text-center">
                    <p className="">
                      Tailor your travel experience with our personalized
                      recommendations and amenities.
                    </p>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="mb-6 lg:mb-10">
                  <div className="text-center">
                    <p className="">
                      Enjoy a hassle-free booking process and secure your dream
                      stay in just a few clicks.
                    </p>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
