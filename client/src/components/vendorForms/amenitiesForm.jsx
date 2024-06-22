import React, { useEffect, useState } from "react";
import { BiCloudUpload, BiCross, BiPlusCircle } from "react-icons/bi";
import { TextField } from "@mui/material";
import { getAmenitiesRegistration } from "../../services/vendor/vendor.service";
import { RxCross1 } from "react-icons/rx";

//TODO: When user tries to input the same amenities then it should not let it happen
export default function PicturesAndAmenities({ formik }) {
  const { values, setFieldValue } = formik;
  const [inputAmenity, setInputAmenity] = useState("");
  const [amen, setAmen] = useState([]);

  const getAmen = async () => {
    const res = await getAmenitiesRegistration();
    setAmen(res.data.data.amenities);
    console.log(res.data);
  };

  useEffect(() => {
    getAmen();
  }, []);

  console.log(amen);

  //For adding inputed amenity
  const addAmenityToList = () => {
    if (inputAmenity.trim() !== "") {
      setFieldValue("amenities", [...values.amenities, inputAmenity]);
      setInputAmenity("");
    }
  };

  const addAmenityList = (amenity) => {
    setFieldValue("amenities", [...values.amenities, amenity]);
  };

  const removeAmenityFromList = (index) => {
    const updatedAmenities = values.amenities.filter((_, i) => i !== index);
    setFieldValue("amenities", updatedAmenities);
  };
  const [mainPicturePreview, setMainPicturePreview] = useState(null);
  const [otherPicturesPreview, setOtherPicturesPreview] = useState(
    values.other_pictures.map((file) => URL.createObjectURL(file)) || []
  );

  const handleMainPictureChange = (event) => {
    const file = event.currentTarget.files[0];
    setFieldValue("main_picture", file);
    setMainPicturePreview(URL.createObjectURL(file));
  };
  console.log(mainPicturePreview);

  const handleOtherPicturesChange = (event) => {
    //Converting the files to array
    const files = Array.from(event.currentTarget.files);

    // Update Formik's values.other_pictures
    setFieldValue("other_pictures", [...values.other_pictures, ...files]);

    // Update otherPicturesPreview
    const previews = files.map((file) => URL.createObjectURL(file));
    setOtherPicturesPreview((prevPreviews) => [...prevPreviews, ...previews]);
  };

  const removePicture = (index) => {
    // Remove the picture from Formik's values.other_pictures
    const updatedPictures = [...values.other_pictures];
    //Splice is basically removing the required data and the , 1 is staring  number of data/element to be removed
    updatedPictures.splice(index, 1);
    setFieldValue("other_pictures", updatedPictures);

    // Remove the picture from otherPicturesPreview
    const updatedPreviews = [...otherPicturesPreview];
    updatedPreviews.splice(index, 1);
    setOtherPicturesPreview(updatedPreviews);
  };

  return (
    <div className="mt-8">
      <div className="text-2xl mb-6 font-semibold">
        Step 2: Amenities and Pictures
      </div>
      <div className=" bg-white flex  gap-10">
        <div className="flex flex-col  gap-6 w-[70rem]">
          <div className="">
            <h1 className="text-xl font-semibold mb-2">Add Amenities:</h1>
            <p className="text-xs ">
              You can select the available amenities or you can add your own if
              you want to:
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              {amen?.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    className="w-4 h-4 cursor-pointer"
                    type="checkbox"
                    id={`amenity${index}`}
                    value={amenity.amenity_name}
                    checked={values.amenities.includes(amenity.amenity_name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        addAmenityList(amenity.amenity_name);
                      } else {
                        removeAmenityFromList(
                          values.amenities.indexOf(amenity.amenity_name)
                        ); // Remove amenity_name from the list
                      }
                    }}
                  />
                  <label className="cursor-pointer" htmlFor={`amenity${index}`}>
                    {amenity.amenity_name}
                  </label>
                  {/* Render amenity_name property */}
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <TextField
              type="text"
              id="amenityInput"
              value={inputAmenity}
              onChange={(e) => setInputAmenity(e.target.value)}
              placeholder="Type an amenity"
            />
            <button
              type="button"
              onClick={addAmenityToList}
              className="bg-violet-950 text-white px-4 rounded-md"
            >
              Add
            </button>
          </div>
          <div>
            <p className="text-red-400">{formik.errors.amenities}</p>

            <p className="font-semibold">Added Amenities:</p>
            <div className="flex flex-wrap gap-4 mt-2 ">
              {/* Display added amenities */}
              {values.amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-200 rounded-md py-2 px-6 relative text-sm"
                >
                  <span>{amenity}</span>
                  <button
                    type="button"
                    onClick={() => removeAmenityFromList(index)}
                    className="ml-2  text-black absolute top-1 right-1 hover:text-red-500  duration-300"
                  >
                    <RxCross1 />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-col gap-2 w-full">
            <h1 className="text-xl font-semibold mb-2 text-center">
              Add Pictures:
            </h1>

            <div className="flex p-2 h-[20rem] bg-white gap-4">
              <label
                htmlFor="main_picture"
                className="mb-2 block w-[7rem] font-semibold"
              >
                Main Picture:
              </label>
              <div className="felx flex-col">
                {values.main_picture ? (
                  <div className="relative rounded-xl">
                    <div className="w-[40rem] h-[18rem] rounded-xl">
                      <img
                        src={
                          mainPicturePreview ||
                          URL.createObjectURL(values.main_picture)
                        }
                        alt="Main Preview"
                        className="w-full h-full rounded-xl object-cover"
                      />
                    </div>
                    <div
                      className=" rounded-full p-1 absolute top-2 right-2 cursor-pointer text-2xl text-white"
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
                      id="main_picture"
                      name="main_picture"
                      accept="image/*"
                      onChange={handleMainPictureChange}
                      onBlur={formik.handleBlur}
                    />
                  </label>
                )}
                <p className="text-red-400">{formik.errors.main_picture}</p>
              </div>
            </div>

            {/* Input for adding other pictures */}
            <div className="flex p-2 bg-white gap-4">
              <p className="w-[8rem]  font-semibold">Other Pictures: </p>
              <div className="flex flex-col w-full">
                <div className="relative rounded-xl w-full bg-neutral-700 ">
                  <div className="grid grid-cols-4 gap-4 auto-rows-[8rem] p-4">
                    {otherPicturesPreview.map((preview, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center relative  rounded-xl"
                      >
                        <img
                          src={
                            preview ||
                            URL.createObjectURL(values.other_pictures[0])
                          }
                          alt={`Preview ${index}`}
                          className="w-44 h-40 object-cover rounded-lg"
                        />
                        <button
                          className="absolute top-1 text-white right-1"
                          type="button"
                          onClick={() => removePicture(index)}
                        >
                          <RxCross1 />
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
                        multiple
                        onChange={handleOtherPicturesChange}
                        onBlur={formik.handleBlur}
                      />
                    </label>
                  </div>
                </div>
                <p className="text-red-400">{formik.errors.other_pictures}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
