import { Link, useNavigate, useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { CircularProgress, TextField } from "@mui/material";
import { BiPlusCircle } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";
import {
  getVendorHotelSpecific,
  updateHotelGeneralDetails,
  updateRoomsVendor,
} from "../../services/vendor/vendor.service";
import { toast } from "react-toastify";
import * as yup from "yup";

export default function EditHotel() {
  const { hotel_name, room_id } = useParams();
  const { id, role, jwt } = useSelector((state) => state.user);
  const [hotelDetails, setHotelDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false); // State to manage loading

  const initialValues = {
    hotel_name: hotelDetails?.hotel_name || "",
    location: hotelDetails?.location || 0,
    phone_number: hotelDetails?.phone_number || 0,
    email: hotelDetails?.email || "",
    ratings: hotelDetails?.email || 0,
    description: hotelDetails?.description || "",
  };

  const vendorRegisterValidSchema = yup.object({
    hotel_name: yup
      .string()
      .min(2, "Hotel name must be at least 2 characters")
      .max(50, "Hotel name must be at most 50 characters")
      .required("Please enter the hotel name"),
    phone_number: yup
      .number()
      .min(1000000000, "Numbers must be exactly 10 digits")
      .max(9999999999, "Numbers must be exactly 10 digits")
      .required("Please provide your phone number"),
    description: yup.string().required("Please enter a description"),
    location: yup
      .string()
      .min(2, "Location must be at least 2 characters")
      .required("Please enter the location"),
    ratings: yup
      .number()
      .min(1, "Ratings must be at least 1")
      .max(5, "Ratings must be at most 5")
      .required("Please enter the ratings"),
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Please enter the email"),
  });

  const {
    values,
    handleBlur,
    handleSubmit,
    setFieldValue,
    handleChange,
    touched,
    errors,
    resetForm,
  } = useFormik({
    initialValues: initialValues,
    // Validation schema for room addition form
    validationSchema: vendorRegisterValidSchema, // Define your validation schema here
    onSubmit: async () => {
      setIsLoading(true);

      await updateHotel(values);
    },
  });

  const getHotel = async () => {
    try {
      const res = await getVendorHotelSpecific(hotel_name, jwt);
      console.log(res.data);
      let hotelDetails = res?.data.data;
      setHotelDetails(hotelDetails);
      setFieldValue("description", hotelDetails.description);
      setFieldValue("email", hotelDetails.email);
      setFieldValue("location", hotelDetails.location);
      setFieldValue("hotel_name", hotelDetails.hotel_name);
      setFieldValue("ratings", hotelDetails.ratings);
      setFieldValue("phone_number", hotelDetails.phone_number);
    } catch (e) {
      const errorMessage = e.response.data.message;
      console.log(errorMessage);
      console.log(errorMessage);
    }
  };

  useEffect(() => {
    getHotel();
  }, []);
  const navigate = useNavigate();
  console.log(errors);
  //!For adding rooms
  const updateHotel = async (values) => {
    try {
      console.log(values, "jasja");
      const res = await updateHotelGeneralDetails(values, hotel_name, jwt);
      console.log(res.data);
      toast.success(res.data.message);
      setIsLoading(false);
      navigate(`/vendor/${res.data.data.hotel_name}/settings`);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  const cancelNavigate = () => {
    navigate(`/vendor/${hotel_name}/settings`);
  };

  return (
    <div className="px-8 flex flex-col w-full h-screen ">
      <div className=" shadow-md mt-10 bg-white p-6 border rounded-lg">
        <div className=" flex  border-b border-b-gray-200 pb-2 items-center ">
          <div className="text-2xl pl-10">
            <strong>Edit Hotels General details</strong>
          </div>
        </div>
        <div className="pl-10 pr-10 pt-10">
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="flex w-full justify-between "
          >
            <div className="flex flex-col gap-4 w-[30%]">
              <div className="h-[4rem]">
                <TextField
                  className="outline-violet-950 p-2 bg-transparent w-full text-black border-b-2 border-b-black"
                  type="text"
                  label="Hotel_name"
                  id="hotel_name"
                  name="hotel_name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.hotel_name}
                />
                {touched.hotel_name && errors.hotel_name && (
                  <div className="text-red-600 text-xs">
                    {errors.hotel_name}
                  </div>
                )}
              </div>
              <div className="h-[4rem]">
                <TextField
                  className="outline-violet-950 p-2 bg-transparent w-full text-black border-b-2 border-b-black"
                  type="text"
                  label="Email"
                  id="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                {touched.email && errors.email && (
                  <div className="text-red-600 text-xs">{errors.email}</div>
                )}
              </div>
              <div className="h-[4rem]">
                <TextField
                  className="outline-violet-950 p-2 bg-transparent w-full text-black border-b-2 border-b-black"
                  type="text"
                  label="Location"
                  id="location"
                  name="location"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.location}
                />
                {touched.location && errors.location && (
                  <div className="text-red-600 text-xs">{errors.location}</div>
                )}
              </div>
              <div className="h-[4rem]">
                <TextField
                  className="outline-violet-950 p-2 bg-transparent w-full text-black border-b-2 border-b-black"
                  type="number"
                  label="Phone_number"
                  id="phone_number"
                  name="phone_number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone_number}
                />
                {touched.phone_number && errors.phone_number && (
                  <div className="text-red-600 text-xs">
                    {errors.phone_number}
                  </div>
                )}
              </div>
              <div className="h-[4rem]">
                <TextField
                  className="outline-violet-950 p-2 bg-transparent w-full text-black border-b-2 border-b-black"
                  type="number"
                  label="Ratings"
                  id="ratings"
                  name="ratings"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.ratings}
                />
                {touched.ratings && errors.ratings && (
                  <div className="text-red-600 text-xs">{errors.ratings}</div>
                )}
              </div>
            </div>
            <div className="flex flex-col w-[60%] justify-between ">
              <textarea
                className=" outline-blue-500 p-2 border-2 rounded-md  w-full h-[30rem]"
                id="description"
                name="description"
                placeholder="Description"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.description}
              ></textarea>
              {touched.description && errors.description && (
                <div className="text-red-600 text-xs">{errors.description}</div>
              )}
              <div className="flex justify-end text-sm font-semibold gap-4">
                <button
                  className={`p-3 rounded-3xl pl-7 pr-7 hover:bg-neutral-100 text-black flex items-center gap-2 duration-300   ${
                    isLoading && "cursor-not-allowed"
                  }`}
                  type="button"
                  disabled={isLoading}
                  onClick={!isLoading && cancelNavigate}
                >
                  <RxCross1 className="font-bold" />
                  <p>Cancel</p>
                </button>
                <button
                  type="submit"
                  className={`p-3 rounded-3xl pl-7 pr-7 mt-4 flex gap-2 text-white bg-violet-950 duration-300  ${
                    isLoading
                      ? "cursor-not-allowed opacity-80"
                      : " hover:bg-violet-900 "
                  }`}
                  disabled={isLoading}
                >
                  {isLoading && <CircularProgress color="primary" size={20} />}{" "}
                  <p>Save</p>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
