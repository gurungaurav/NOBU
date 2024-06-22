import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { BiPlusCircle } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import { CircularProgress, MenuItem, Select, TextField } from "@mui/material";
import {
  addHotelRooms,
  getAllBeds,
  getRegisteredAmenitiesHotel,
  getRoomTypesRegistration,
} from "../../services/vendor/vendor.service";
import * as yup from "yup";

//! And the spinner button also to wait for the response
export default function VendorAddRooms() {
  const initialValues = {
    description: "",
    price_per_night: "",
    room_pictures: [],
    amenities: [],
    room_type: "",
    bed_types: [],
    room_no: "",
    floor: "",
  };

  const floorTypes = {
    First: "First",
    Second: "Second",
    Third: "Third",
    Fourth: "Fourth",
    Fifth: "Fifth",
    Sixth: "Sixth",
    Seventh: "Seventh",
    Eighth: "Eighth",
    Ninth: "Ninth",
    Tenth: "Tenth",
  };

  const validationSchema = yup.object().shape({
    description: yup.string().required("Description is required"),
    price_per_night: yup
      .number()
      .typeError("Price per night must be a number")
      .positive("Price per night must be a positive number")
      .required("Price per night is required"),
    room_pictures: yup
      .array()
      .min(4, "At least four room picture is required")
      .required("At least one room picture is required"),
    amenities: yup.array().min(4, "At least four amenity is required"),
    room_type: yup.string().required("Room type is required"),
    bed_types: yup.array().min(1, "At least four bed type is required"),
    floor: yup.string().required("Floor is required"),
    room_no: yup.string().required("Room no. is required"),
  });

  const [otherPicturesPreview, setOtherPicturesPreview] = useState([]);
  const [mainPicturePreview, setMainPicturePreview] = useState(null);
  const [amen, setAmen] = useState([]);
  const [roomTypes, setRoom_Types] = useState([]);
  const { id, role, jwt } = useSelector((state) => state.user);
  const [bedTypes, setBedTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // State to manage loading

  const { hotel_name } = useParams();
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
    validationSchema: validationSchema, // Define your validation schema here
    onSubmit: async () => {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("description", values.description);
      formData.append("price_per_night", values.price_per_night);
      formData.append("room_type", values.room_type);
      formData.append("room_no", values.room_no);
      formData.append("floor", values.floor);

      const amenitiesArray = Array.isArray(values.amenities)
        ? values.amenities
        : [values.amenities];

      amenitiesArray.forEach((amenity, index) => {
        formData.append(`amenities[]`, amenity);
      });

      // Append other_pictures individually
      values.room_pictures.forEach((file, index) => {
        formData.append(`room_pictures`, file); // Append without index
      });

      console.log(values.bed_types, "hehe");

      //? Need to convert the type to array cuz when its not an array like when single is selected then it will not be an array so we should convert it
      // Convert bed_types to an array if it's not already
      const bedTypesArray = Array.isArray(values.bed_types)
        ? values.bed_types
        : [values.bed_types];

      // Append bed_types individually
      bedTypesArray.forEach((bedType, index) => {
        formData.append(`bed_types[]`, bedType); // Append without index
      });

      await addRooms(formData);
    },
  });

  console.log(values);

  //!For getting amenities
  const getAmen = async () => {
    const res = await getRegisteredAmenitiesHotel(hotel_name, jwt);
    setAmen(res.data.data);
    console.log("hehe");
  };

  //!For room typs
  const getRoomTypes = async () => {
    const res = await getRoomTypesRegistration();
    setRoom_Types(res.data.data);
  };

  const getBedType = async () => {
    const res = await getAllBeds();
    setBedTypes(res.data.data);
    console.log(res.data);
  };

  //?Useeffext
  useEffect(() => {
    getAmen();
    getRoomTypes();
    getBedType();
  }, []);

  //!For adding rooms
  const addRooms = async (values) => {
    try {
      const res = await addHotelRooms(values, id, jwt);
      console.log(res.data);
      toast.success(res.data.message);
      resetForm();
      setOtherPicturesPreview([]);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleBedTypesChange = (e) => {
    const { value, checked } = e.target;
    let updatedBedType = [...values.bed_types];

    if (checked) {
      updatedBedType.push(value);
    } else {
      updatedBedType = updatedBedType.filter((bed) => bed !== value);
    }
    setFieldValue("bed_types", updatedBedType);
  };

  const handleAmenitiesChange = (e) => {
    const { value, checked } = e.target;
    let updatedAmenities = [...values.amenities];

    if (checked) {
      updatedAmenities.push(value);
    } else {
      updatedAmenities = updatedAmenities.filter(
        (amenity) => amenity !== value
      );
    }

    setFieldValue("amenities", updatedAmenities);
  };

  const handleRoomTypeChange = (e) => {
    const { value, checked } = e.target;
    let updatedRoomType = "";

    if (checked) {
      updatedRoomType = value;
    }

    setFieldValue("room_type", updatedRoomType);
  };

  const handleOtherPicturesChange = (event) => {
    const files = Array.from(event.currentTarget.files);

    // Display preview of selected images
    const previews = files.map((file) => URL.createObjectURL(file));
    setOtherPicturesPreview((prevPreviews) => [...prevPreviews, ...previews]);

    setFieldValue("room_pictures", [...values.room_pictures, ...files]);
  };

  const removePicture = (index, isMain = false) => {
    if (isMain) {
      setFieldValue("main_picture", null);
      setMainPicturePreview(null);
    } else {
      const updatedPictures = [...values.room_pictures];
      updatedPictures.splice(index, 1);

      const updatedPreviews = [...otherPicturesPreview];
      updatedPreviews.splice(index, 1);

      setFieldValue("room_pictures", updatedPictures);
      setOtherPicturesPreview(updatedPreviews);
    }
  };

  const cancelNavigate = () => {
    navigate(`/vendor/${hotel_name}/roomLists`);
  };

  return (
    <div className=" px-8 py-4  flex flex-col w-full  ">
      <div className=" shadow-md border  bg-white p-6 rounded-lg ">
        <div className=" flex  border-b border-b-gray-200 pb-2 items-center ">
          <div className="text-2xl pl-10">
            <p className="font-bold">Add Rooms</p>
          </div>
        </div>
        <div className="pl-10 pr-10 pt-10">
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="flex w-full justify-between "
          >
            <div className="flex flex-col gap-4">
              <div className="flex gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="room_no" className="font-semibold">
                    Room no:
                  </label>
                  <div className="h-[4rem]">
                    <TextField
                      className="outline-violet-950 p-2 bg-transparent text-black border-b-2 border-b-black"
                      type="text"
                      label="Room no."
                      id="room_no"
                      name="room_no"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.room_no}
                    />
                    {touched.room_no && errors.room_no && (
                      <div className="text-red-600 text-sm">
                        {errors.room_no}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="price_per_night" className="font-semibold">
                    Price Per Night:
                  </label>
                  <div className="h-[4rem]">
                    <TextField
                      className="outline-violet-950 p-2 bg-transparent text-black border-b-2 border-b-black"
                      type="text"
                      label="Price Per Night"
                      id="price_per_night"
                      name="price_per_night"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.price_per_night}
                    />
                    {touched.price_per_night && errors.price_per_night && (
                      <div className="text-red-600 text-sm">
                        {errors.price_per_night}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-fit mt-2">
                <label htmlFor="floor" className="font-semibold">
                  Floor:
                </label>
                <Select
                  className="outline-violet-950 p-2 bg-transparent text-black h-[3rem] mt-2 "
                  id="floor"
                  name="floor"
                  value={values.floor}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <MenuItem value="">Select a floor</MenuItem>
                  {Object.keys(floorTypes).map((floor) => (
                    <MenuItem key={floor} value={floor}>
                      {floorTypes[floor]}
                    </MenuItem>
                  ))}
                </Select>
                {touched.floor && errors.floor && (
                  <div className="text-red-600 text-sm">{errors.floor}</div>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="amenities" className="font-semibold">
                  Amenities:
                </label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {amen.map((amenity, index) => (
                    <div
                      className="flex items-center gap-2 text-sm "
                      key={index}
                    >
                      <input
                        type="checkbox"
                        className="w-5 h-5 cursor-pointer"
                        id={`amenity-${index}`}
                        name={`amenities`}
                        value={amenity}
                        onChange={handleAmenitiesChange}
                        onBlur={handleBlur}
                        checked={values.amenities.some(
                          (item) => item === amenity
                        )}
                      />
                      <label
                        className="cursor-pointer"
                        htmlFor={`amenity-${index}`}
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {touched.amenities && errors.amenities ? (
                <div className="text-red-600 text-sm">{errors.amenities}</div>
              ) : null}
              <div className="flex flex-col">
                <label htmlFor="roomType" className="font-semibold">
                  Room Types:
                </label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {roomTypes.map((roomType, index) => (
                    <div
                      className="flex items-center gap-2 text-sm"
                      key={index}
                    >
                      <input
                        className="w-5 h-5 cursor-pointer"
                        type="checkbox"
                        id={`roomType-${index}`}
                        name={`roomType`}
                        value={roomType.type_name}
                        onChange={handleRoomTypeChange}
                        onBlur={handleBlur}
                        checked={values.room_type === roomType.type_name}
                      />
                      <label
                        className="cursor-pointer"
                        htmlFor={`roomType-${index}`}
                      >
                        {roomType.type_name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {touched.room_type && errors.room_type ? (
                <div className="text-red-600 text-sm">{errors.room_type}</div>
              ) : null}
              <div className="flex flex-col">
                <label htmlFor="bedTypes" className="font-semibold">
                  Bed Types:
                </label>
                <div className="grid grid-cols-3 gap-3 mt-2 text-sm">
                  {bedTypes.map((bedType, index) => (
                    <div className="flex items-center gap-2 " key={index}>
                      <input
                        type="checkbox"
                        className="w-5 h-5 cursor-pointer"
                        id={`bedType-${index}`}
                        name={`bedTypes`}
                        value={bedType.type_name}
                        onChange={handleBedTypesChange}
                        onBlur={handleBlur}
                        checked={values.bed_types.some(
                          (bed) => bed === bedType.type_name
                        )}
                      />
                      <label
                        className="cursor-pointer"
                        htmlFor={`bedType-${index}`}
                      >
                        {bedType.type_name}
                      </label>
                    </div>
                  ))}
                </div>
                {touched.bed_types && errors.bed_types && (
                  <div className="text-red-600 text-sm mt-3">
                    {errors.bed_types}
                  </div>
                )}
              </div>
              <div className="  w-[40rem]">
                <label htmlFor="description" className="font-semibold">
                  Rooms description:
                </label>
                <textarea
                  className=" outline-blue-600 p-2 h-[10rem]  border-2 rounded-md  w-full mt-2"
                  id="description"
                  name="description"
                  placeholder="Description"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.description}
                ></textarea>
                {touched.description && errors.description && (
                  <div className="text-red-600 text-sm">
                    {errors.description}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-between w-[50%]">
              <div>
                <div className="relative rounded-xl w-full bg-neutral-700 ">
                  <div className="grid grid-cols-3 gap-4 auto-rows-[10rem] p-4">
                    {otherPicturesPreview.map((preview, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center relative rounded-xl"
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          className="absolute top-2 right-2 "
                          type="button"
                          onClick={() => removePicture(index)}
                        >
                          <RxCross1 className="text-white font-bold text-xl" />
                        </button>
                      </div>
                    ))}
                    <label className="flex flex-col items-center justify-center cursor-pointer ">
                      <BiPlusCircle className="text-neutral-500 text-4xl" />
                      <p className="text-gray-400 font-bold">Upload Image</p>
                      <input
                        type="file"
                        id="room_pictures"
                        name="room_pictures"
                        style={{ display: "none" }}
                        accept="image/*"
                        onBlur={handleBlur}
                        multiple
                        onChange={handleOtherPicturesChange}
                      />
                    </label>
                  </div>
                </div>
                {touched.room_pictures && errors.room_pictures && (
                  <div className="text-red-600 text-sm">
                    {errors.room_pictures}
                  </div>
                )}
              </div>
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
                  className={`p-3 rounded-3xl pl-7 pr-7 flex gap-2 text-white bg-violet-950 duration-300  ${
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
