import React, { useEffect, useState } from "react";
import { hotelFormSchema } from "../../schemas/vendor/signupSchema";
import {
  getAllBeds,
  getAmenitiesRegistration,
  vendorRegistration,
} from "../../services/hotels/hotels.service";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { RxCross1 } from "react-icons/rx";
import { BiCloudUpload, BiPlusCircle } from "react-icons/bi";
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function VendorRegistrationForm() {
  const [amen, setAmen] = useState([]);
  const [otherPicturesPreview, setOtherPicturesPreview] = useState([]);
  const [mainPicturePreview, setMainPicturePreview] = useState(null);
  const [inputAmenity, setInputAmenity] = useState(""); // State to store the input amenity
  const [amenitiesList, setAmenitiesList] = useState([]); // State to store the list of amenities

  // Function to add an amenity to the list
  const addAmenityToList = () => {
    if (inputAmenity.trim() !== "") {
      setAmenitiesList([...amenitiesList, inputAmenity.trim()]);
      setInputAmenity(""); // Clear the input field after adding amenity
    }
  };

  // Function to remove an amenity from the list
  const removeAmenityFromList = (index) => {
    const updatedAmenities = [...amenitiesList];
    updatedAmenities.splice(index, 1);
    setAmenitiesList(updatedAmenities);
  };

  const initialValues = {
    hotel_name: "",
    phone_number: "",
    description: "",
    main_picture: null,
    other_pictures: [],
    location: "",
    ratings: "",
    email: "",
    amenities: [],
    agreedToTerms: false,
  };

  const { id, name, role, jwt } = useSelector((state) => state.user);

  const {
    values,
    handleBlur,
    handleSubmit,
    setFieldValue,
    handleChange,
    touched,
    errors,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: hotelFormSchema,
    onSubmit: async () => {
      const formData = new FormData();
      formData.append("hotel_name", values.hotel_name);
      formData.append("phone_number", values.phone_number);
      formData.append("description", values.description);
      formData.append("main_picture", values.main_picture);
      formData.append("location", values.location);
      formData.append("ratings", values.ratings);
      formData.append("email", values.email);
      values.amenities.forEach((amenity, index) => {
        formData.append(`amenities`, amenity);
      });

      // Append other_pictures individually
      values.other_pictures.forEach((file, index) => {
        formData.append(`other_pictures`, file); // Append without index
      });

      await registerVendor(formData);
    },
  });

  useEffect(() => {
    setFieldValue('amenities', amenitiesList); // Update the Formik values when amenitiesList changes
  }, [amenitiesList, setFieldValue]);

  console.log(values.amenities);


  const getAmen = async () => {
    const res = await getAmenitiesRegistration();
    setAmen(res.data.data.amenities);
  };

 
  useEffect(() => {
    getAmen();
  }, []);

  const registerVendor = async (values) => {
    try {
      const res = await vendorRegistration(values, 4, jwt);
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };

 

  const handleOtherPicturesChange = (event) => {
    const files = Array.from(event.currentTarget.files);

    // Display preview of selected images
    const previews = files.map((file) => URL.createObjectURL(file));
    setOtherPicturesPreview((prevPreviews) => [...prevPreviews, ...previews]);

    setFieldValue("other_pictures", [...values.other_pictures, ...files]);
  };

  // Function to remove a selected picture
  const removePicture = (index) => {
    const updatedPictures = [...values.other_pictures];
    updatedPictures.splice(index, 1);

    const updatedPreviews = [...otherPicturesPreview];
    updatedPreviews.splice(index, 1);

    setFieldValue("other_pictures", updatedPictures);
    setOtherPicturesPreview(updatedPreviews);
  };

  console.log(values);
  //!For photos there will be two sections one for the main photo to represent hotel
  //!and others will be normal types
  return (
    <div className="flex flex-col  bg-slate-100">
      <form
        className="p-10"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <div className="flex flex-col rounded-lg shadow-lg p-2 h-[6rem] bg-white ">
              <FloatingLabel
                controlId="floatingInput"
                label="Hotel Name"
                // htmlFor="hotel_name"
                className=""
              >
                <Form.Control
                  type="text"
                  id="hotel_name"
                  name="hotel_name"
                  placeholder="Hotel name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.hotel_name}
                />
              </FloatingLabel>
              {touched.hotel_name && errors.hotel_name ? (
                <div className="text-red-600">{errors.hotel_name}</div>
              ) : null}
            </div>
            <div className="flex flex-col rounded-lg shadow-lg p-2 h-[6rem] bg-white mt-2 ">
              <FloatingLabel
                controlId="floatingInput"
                label="Email"
                htmlFor="email"
              >
                <Form.Control
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className="border-b-2 outline-none w-[50%]"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
              </FloatingLabel>
              {touched.email && errors.email ? (
                <div className="text-red-600">{errors.email}</div>
              ) : null}
            </div>

            <div className="flex flex-col rounded-lg shadow-lg p-2 h-[6rem] bg-white mt-2 ">
              <FloatingLabel
                controlId="floatingInput"
                label="Phone Number"
                htmlFor="phone_number"
              >
                <Form.Control
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  placeholder="Phone Number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone_number}
                />
              </FloatingLabel>

              {touched.phone_number && errors.phone_number ? (
                <div className="text-red-600">{errors.phone_number}</div>
              ) : null}
            </div>

            <div className="flex flex-col rounded-lg shadow-lg p-2 h-[6rem] bg-white mt-2 ">
              <FloatingLabel controlId="floatingInput" label="Description">
                <Form.Control
                  id="description"
                  name="description"
                  placeholder="Description"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.description}
                ></Form.Control>
              </FloatingLabel>
              {touched.description && errors.description ? (
                <div className="text-red-600">{errors.description}</div>
              ) : null}
            </div>

            <div className="flex flex-col rounded-lg shadow-lg p-2 h-[6rem] bg-white mt-2 ">
              <label htmlFor="ratings">Ratings:</label>
              <input
                type="number"
                id="ratings"
                name="ratings"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.ratings}
              />
              {touched.ratings && errors.ratings ? (
                <div className="text-red-600">{errors.ratings}</div>
              ) : null}
            </div>
            <div className="flex flex-col rounded-lg shadow-lg p-2 h-[6rem] bg-white mt-2 ">
              <FloatingLabel controlId="floatingInput" label="Location">
                <Form.Control
                  type="location"
                  id="location"
                  name="location"
                  placeholder="Location"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.location}
                />
              </FloatingLabel>
              {touched.location && errors.location ? (
                <div className="text-red-600">{errors.location}</div>
              ) : null}
            </div>
            <div className="flex flex-col rounded-lg shadow-lg p-2  bg-white mt-2 ">
              <label htmlFor="amenityInput">Amenities:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="amenityInput"
                  value={inputAmenity}
                  onChange={(e) => setInputAmenity(e.target.value)}
                  placeholder="Type an amenity"
                />
                <button
                  type="button"
                  onClick={addAmenityToList}
                  className="bg-blue-500 text-white px-2 rounded-md"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 w-full h-full">
                {/* Display added amenities */}
                {amenitiesList.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-200 rounded-md px-2"
                  >
                    <span>{amenity}</span>
                    <button
                      type="button"
                      onClick={() => removeAmenityFromList(index)}
                      className="ml-2 text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex rounded-lg shadow-lg p-2 h-[20rem] bg-white gap-4">
              <label htmlFor="main_picture" className="mb-2 block">
                Main Picture:
              </label>
              {values.main_picture ? (
                <div className="relative rounded-xl">
                  <div className="w-[40rem] h-[18rem] rounded-xl">
                    <img
                      src={
                        mainPicturePreview ||
                        URL.createObjectURL(values.main_picture)
                      }
                      alt="Main Preview"
                      className="w-full h-full rounded-xl"
                    />
                  </div>
                  <div
                    className="border-4 border-white rounded-full p-1 absolute top-2 right-2 cursor-pointer text-white"
                    onClick={() => {
                      setFieldValue("main_picture", null);
                      setMainPicturePreview(null);
                    }}
                  >
                    <RxCross1 />
                  </div>
                </div>
              ) : (
                <label className="relative rounded-xl w-[40rem] h-[18rem] bg-neutral-700 flex flex-col items-center justify-center ">
                  <div className="text-neutral-500">
                    <BiCloudUpload className="text-4xl" />
                  </div>
                  <p>Upload Image</p>
                  <input
                    className="cursor-pointer"
                    style={{ display: "none" }}
                    type="file"
                    name="main_picture"
                    accept="image/*"
                    onBlur={handleBlur}
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      setFieldValue("main_picture", file);
                      setMainPicturePreview(URL.createObjectURL(file));
                    }}
                  />
                </label>
              )}
            </div>

            {/* Input for adding other pictures */}
            <div className="flex rounded-lg shadow-lg p-2  bg-white gap-4">
              <p>Other Pictures: </p>
              <div className="relative rounded-xl w-full bg-neutral-700 ">
                <div className="grid grid-cols-4 gap-4 auto-rows-[8rem] p-4">
                  {otherPicturesPreview.map((preview, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center relative  rounded-xl"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <button
                        className="absolute top-1 right-1"
                        type="button"
                        onClick={() => removePicture(index)}
                      >
                        <RxCross1 className="text-white font-bold" />
                      </button>
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center cursor-pointer">
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
            </div>
          </div>
        </div>
        {/* Submit Button */}
        <div className="flex items-center gap-6 rounded-lg shadow-xl  p-2  sticky bottom-0 bg-white ">
          <div className="bg-blue-600 p-3 text-xl text-white font-bold rounded-md">
            <button type="submit">Submit</button>
          </div>
          <div className="bg-red-600 p-3 text-xl text-white font-bold rounded-md">
            <button type="submit">Cancel</button>
          </div>
          <div className="flex">
            <label htmlFor="agreedToTerms">
              <input
                type="checkbox"
                id="agreedToTerms"
                name="agreedToTerms"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                checked={values.agreedToTerms}
              />
            </label>
            <p className="text-black"> I agree to the terms and conditions</p>
            {touched.agreedToTerms && errors.agreedToTerms ? (
              <div className="text-red-600">{errors.agreedToTerms}</div>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
}
