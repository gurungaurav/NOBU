import { useNavigate, useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { CircularProgress, MenuItem, Select, TextField } from "@mui/material";
import { BiPlusCircle } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";
import {
  addHotelRooms,
  getAllBeds,
  getRegisteredAmenitiesHotel,
  getRoomTypesRegistration,
  getSpecificRoomByName,
  updateRoomsVendor,
} from "../../services/vendor/vendor.service";
import { toast } from "react-toastify";
import * as yup from "yup";

export default function EditRooms() {
  const { hotel_name, room_id } = useParams();
  const [otherPicturesPreview, setOtherPicturesPreview] = useState([]);
  const [mainPicturePreview, setMainPicturePreview] = useState(null);
  const [amen, setAmen] = useState([]);
  const [roomTypes, setRoom_Types] = useState([]);
  const { id, role, jwt } = useSelector((state) => state.user);
  const [bedTypes, setBedTypes] = useState([]);
  const [roomDetails, setRoomDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    description: roomDetails?.description || "",
    price_per_night: roomDetails?.price_per_night || 0,
    room_pictures: roomDetails?.other_pictures || [],
    amenities: roomDetails?.room_amenities || [],
    room_type: roomDetails?.roomType || "",
    bed_types: roomDetails?.room_beds || [],
    floor: "",
    room_no: "",
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
    validationSchema: validationSchema, // Define your validation schema here
    onSubmit: async () => {
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

      // Only the bed type id is sent as the object will be sent
      bedTypesArray.forEach((bedType, index) => {
        formData.append(`bed_types[]`, bedType.bed_types_id); // Append without index
      });

      console.log(values, "jajaj");
      setIsLoading(true);

      await updateRoom(formData);
    },
  });

  console.log(values.room_pictures);
  //!For getting amenities
  const getAmen = async () => {
    const res = await getRegisteredAmenitiesHotel(hotel_name, jwt);
    setAmen(res.data.data);
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

  const getRoom = async () => {
    try {
      const res = await getSpecificRoomByName(hotel_name, room_id, jwt);
      console.log(res.data);
      let roomDetails = res?.data.data.roomDetails;
      setRoomDetails(roomDetails);
      setFieldValue("description", roomDetails.description);
      setFieldValue("price_per_night", roomDetails.price_per_night);

      const pictureFiles = await Promise.all(
        roomDetails.other_pictures.map(async (picture) => {
          const response = await fetch(picture.room_picture);
          const blob = await response.blob();
          return new File([blob], `image_${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
        })
      );

      setFieldValue("room_pictures", pictureFiles);
      setFieldValue("room_no", roomDetails.room_no);
      setFieldValue("amenities", roomDetails.room_amenities);
      setFieldValue("room_type", roomDetails.roomType.type_name);
      setFieldValue("bed_types", roomDetails.room_beds);
      setFieldValue("floor", roomDetails.floor);

      setOtherPicturesPreview(
        roomDetails.other_pictures.map((picture) => picture.room_picture)
      );
    } catch (e) {
      const errorMessage = e.response.data.message;
      console.log(errorMessage);
      console.log(errorMessage);
    }
  };

  console.log(roomDetails);

  useEffect(() => {
    getAmen();
    getRoom();
    getRoomTypes();
    getBedType();
  }, []);

  //!For adding rooms
  const updateRoom = async (values) => {
    try {
      console.log(values, "jasja");
      const res = await updateRoomsVendor(values, hotel_name, room_id, jwt);
      console.log(res.data);
      toast.success(res.data.message);
      setIsLoading(false);
      navigate(`/vendor/${hotel_name}/roomLists`);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  const handleBedTypesChange = (e) => {
    const { value, checked } = e.target;
    let updatedBedType = [...values.bed_types];

    // Find the bed type object corresponding to the value
    const bedTypeObject = bedTypes.find(
      (bedType) => bedType.type_name === value
    );

    if (checked) {
      updatedBedType.push(bedTypeObject); // Push the entire bed type object
    } else {
      updatedBedType = updatedBedType.filter((bed) => bed.type_name !== value);
    }

    console.log("Updated Bed Types:", updatedBedType); // Log updated bed types
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
  const navigate = useNavigate();

  const cancelNavigate = () => {
    navigate(`/vendor/${hotel_name}/roomLists`);
  };

  return (
    <div className="px-8 flex flex-col w-full   ">
      <div className=" shadow-md mt-4 border bg-white p-6 rounded-lg">
        <div className=" flex  border-b border-b-gray-200 pb-2 items-center ">
          <div className="text-2xl pl-10">
            <strong>Edit Rooms</strong>
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
                <div className="grid grid-cols-2 gap-2">
                  {amen.map((amenity, index) => (
                    <div className="flex items-center gap-2" key={index}>
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        id={`amenity-${index}`}
                        name={`amenities`}
                        value={amenity}
                        onChange={handleAmenitiesChange}
                        onBlur={handleBlur}
                        checked={values?.amenities?.some(
                          (item) => item === amenity
                        )}
                      />
                      <label htmlFor={`amenity-${index}`}>{amenity}</label>
                    </div>
                  ))}
                </div>
              </div>
              {touched.amenities && errors.amenities ? (
                <div className="text-red-600">{errors.amenities}</div>
              ) : null}
              <div className="flex flex-col">
                <label htmlFor="roomType" className="font-semibold">
                  Room Types:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {roomTypes?.map((roomType, index) => (
                    <div className="flex items-center gap-2" key={index}>
                      <input
                        className="w-4 h-4"
                        type="checkbox"
                        id={`roomType-${index}`}
                        name={`roomType`}
                        value={roomType.type_name}
                        onChange={handleRoomTypeChange}
                        onBlur={handleBlur}
                        checked={values.room_type === roomType.type_name}
                      />
                      <label htmlFor={`roomType-${index}`}>
                        {roomType.type_name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {touched.room_type && errors.room_type ? (
                <div className="text-red-600">{errors.room_type}</div>
              ) : null}
              <div className="flex flex-col">
                <label htmlFor="bedTypes" className="font-semibold">
                  Bed Types:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {bedTypes?.map((bedType, index) => (
                    <div className="flex items-center gap-2" key={index}>
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        id={`bedType-${index}`}
                        name={`bedTypes`}
                        value={bedType.type_name}
                        onChange={handleBedTypesChange}
                        onBlur={handleBlur}
                        checked={(values?.bed_types).some(
                          (bed) => bed.type_name === bedType.type_name
                        )}
                      />
                      <label htmlFor={`bedType-${index}`}>
                        {bedType.type_name}
                      </label>
                    </div>
                  ))}
                </div>
                {touched.bed_types && errors.bed_types && (
                  <div className="text-red-600">{errors.bed_types}</div>
                )}
              </div>
              <div className=" h-fit w-[40rem]">
                <textarea
                  className=" outline-blue-600 p-2 border-2 rounded-md  w-full h-[10rem]"
                  id="description"
                  name="description"
                  placeholder="Description"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.description}
                ></textarea>
                {touched.description && errors.description && (
                  <div className="text-red-600">{errors.description}</div>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-between w-[50%]">
              <div className="relative rounded-xl w-full bg-neutral-700 ">
                <div className="grid grid-cols-3 gap-4 auto-rows-[10rem] p-4">
                  {otherPicturesPreview?.map((preview, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center relative  rounded-xl"
                    >
                      {console.log(preview, "jajaj")}
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
                        <RxCross1 className="text-white text-xl font-bold" />
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
                <div className="text-red-600">{errors.room_pictures}</div>
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
