import { Link, useNavigate, useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { CircularProgress, TextField } from "@mui/material";
import { BiPlusCircle } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";
import {
  getVendorHotelSpecific,
  updateHotelPicturesDetails,
  updateRoomsVendor,
} from "../../services/vendor/vendor.service";
import {
  fetchAndCreateFile,
  fetchAndCreateFiles,
} from "../../utils/convertURLtoFile";
import { toast } from "react-toastify";

export default function EditHotelPictures() {
  const { hotel_name, room_id } = useParams();
  const [otherPicturesPreview, setOtherPicturesPreview] = useState([]);
  const [roomTypes, setRoom_Types] = useState([]);
  const { id, role, jwt } = useSelector((state) => state.user);
  const [hotelDetails, setHotelDetails] = useState({});
  const [viewFile, setViewFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State to manage loading

  const initialValues = {
    main_picture: hotelDetails?.main_picture || "",
    other_pictures: hotelDetails?.other_pictures || [],
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setViewFile(URL.createObjectURL(file));
    setFieldValue("main_picture", file);
  };

  const handleRemovePicture = () => {
    setViewFile(null);
    setFieldValue("main_picture", null);
  };
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
    onSubmit: async () => {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("main_picture", values.main_picture);

      values.other_pictures.forEach((file, index) => {
        formData.append(`other_pictures`, file); // Append without index
      });

      console.log(values);
      await updateHotel(formData);
    },
  });

  const getHotel = async () => {
    try {
      const res = await getVendorHotelSpecific(hotel_name, jwt);
      console.log(res.data);
      let hotelDetails = res?.data.data;
      setHotelDetails(hotelDetails);
      // Fetch and create main picture file
      const mainPictureFile = await fetchAndCreateFile(
        hotelDetails.main_picture
      );
      setViewFile(hotelDetails.main_picture);

      const otherPictures = await Promise.all(
        hotelDetails.other_pictures.map(async (picture) => {
          const response = await fetch(picture.room_picture);
          const blob = await response.blob();
          // Manually specify the MIME type as image/jpeg
          return new File([blob], `image_${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
        })
      );

      setOtherPicturesPreview(
        hotelDetails.other_pictures.map((picture) => picture.room_picture)
      );
      setFieldValue("main_picture", mainPictureFile);
      setFieldValue("other_pictures", otherPictures);
    } catch (e) {
      const errorMessage = e.response.data.message;
      console.log(errorMessage);
      console.log(errorMessage);
    }
  };

  console.log(values, "aah");
  useEffect(() => {
    getHotel();
  }, []);

  //!For adding rooms
  const updateHotel = async (values) => {
    try {
      console.log(values, "jasja");
      const res = await updateHotelPicturesDetails(values, hotel_name, jwt);
      console.log(res.data);
      toast.success(res.data.message);

      setIsLoading(false);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  const handleOtherPicturesChange = (event) => {
    const files = Array.from(event.currentTarget.files);

    // Display preview of selected images
    const previews = files.map((file) => URL.createObjectURL(file));
    setOtherPicturesPreview((prevPreviews) => [...prevPreviews, ...previews]);

    setFieldValue("other_pictures", [...values.other_pictures, ...files]);
  };

  const removePicture = (index, isMain = false) => {
    if (isMain) {
      setFieldValue("other_pictures", null);
      setMainPicturePreview(null);
    } else {
      const updatedPictures = [...values.other_pictures];
      updatedPictures.splice(index, 1);

      const updatedPreviews = [...otherPicturesPreview];
      updatedPreviews.splice(index, 1);

      setFieldValue("other_pictures", updatedPictures);
      setOtherPicturesPreview(updatedPreviews);
    }
  };

  const navigate = useNavigate();

  const cancelNavigate = () => {
    navigate(`/vendor/${hotel_name}/settings`);
  };

  //!Converting the pictures from the backend to the file so that i can send the file again for updation
  return (
    <div className="px-8 flex flex-col w-full h-full ">
      <div className=" shadow-xl mt-10 bg-white p-6 rounded-lg h-full">
        <div className=" flex  border-b border-b-gray-200 pb-2 items-center ">
          <div className="text-2xl pl-10">
            <strong>Edit Hotel's Pictures</strong>
          </div>
        </div>
        <div className="pl-10 pr-10 pt-10">
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="flex w-full gap-10"
          >
            <div className="flex justify-center w-[80%]">
              {viewFile ? (
                <div className="relative rounded-lg w-full h-[30rem]">
                  <div className="rounded-lg h-full">
                    <img
                      src={viewFile}
                      className="w-full h-full rounded-lg object-cover"
                      alt="Preview"
                    />
                  </div>
                  <div
                    className="text-white text-xl rounded-full p-2 absolute top-4 right-4 cursor-pointer hover:bg-gray-400"
                    onClick={handleRemovePicture}
                  >
                    <RxCross1 />
                  </div>
                </div>
              ) : (
                <>
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-[30rem] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
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
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      onBlur={handleBlur}
                      accept="image/*"
                      required="true"
                    />
                  </label>
                  {errors.profile_picture && touched.profile_picture && (
                    <p className="text-red-600">{errors.profile_picture}</p>
                  )}
                </>
              )}
            </div>
            <div className="w-full flex flex-col justify-between ">
              <div className="relative rounded-xl  bg-neutral-700 ">
                <div className="grid grid-cols-3 gap-4 auto-rows-[10rem] p-4">
                  {otherPicturesPreview?.map((preview, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center relative  rounded-xl"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        className="absolute top-2 right-2"
                        type="button"
                        onClick={() => removePicture(index)}
                      >
                        <RxCross1 className="text-white font-bold" />
                      </button>
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center cursor-pointer ">
                    <BiPlusCircle className="text-neutral-500 text-4xl" />
                    <p className="text-gray-400 font-bold">Upload Image</p>
                    <input
                      type="file"
                      id="other_pictures"
                      name="other_pictures"
                      style={{ display: "none" }}
                      accept="image/*"
                      onBlur={handleBlur}
                      multiple
                      onChange={handleOtherPicturesChange}
                    />
                  </label>
                </div>
              </div>
              {touched.other_pictures && errors.other_pictures && (
                <div className="text-red-600">{errors.other_pictures}</div>
              )}
              <div className="flex justify-end text-sm font-semibold gap-4 mt-4">
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
                  className={`p-3 rounded-3xl pl-7 pr-7 flex gap-2 text-white bg-violet-950 duration-300  ${
                    isLoading
                      ? "cursor-not-allowed opacity-80"
                      : " hover:bg-violet-900 "
                  }`}
                  disabled={isLoading}
                >
                  {isLoading && <CircularProgress color="primary" size={20} />}
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
