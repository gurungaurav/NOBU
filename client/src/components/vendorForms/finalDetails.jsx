import React from "react";

function FinalDetails({ formik, hotelDetails }) {
  const values = hotelDetails ? hotelDetails : formik?.values;

  return (
    <div className="mx-24 mt-10">
      <h2 className="text-2xl font-semibold mb-4">Final Details:</h2>
      <div className="mt-8 grid grid-cols-2  gap-20 ">
        <div className="  flex flex-col ">
          <div className="mb-4">
            <h4 className="text-lg font-semibold">Hotel Name:</h4>
            <p className="text-gray-700">{values?.hotel_name}</p>
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-semibold">Phone Number:</h4>
            <p className="text-gray-700">{values?.phone_number}</p>
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-semibold">Description:</h4>
            <p className="text-gray-700">{values?.description}</p>
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-semibold">Location:</h4>
            <p className="text-gray-700">{values?.location}</p>
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-semibold">Ratings:</h4>
            <p className="text-gray-700">{values?.ratings}</p>
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-semibold">Email:</h4>
            <p className="text-gray-700">{values?.email}</p>
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-semibold">Amenities:</h4>
            <ul className="list-disc pl-5">
              {values.amenities
                ? values.amenities.map((amenity, index) => (
                    <li key={index} className="text-gray-700">
                      {amenity}
                    </li>
                  ))
                : values?.hotel_amenities?.map((amenity, index) => (
                    <li key={index} className="text-gray-700">
                      {amenity}
                    </li>
                  ))}
            </ul>
          </div>
        </div>
        <div className="w-full">
          <div className="mb-4">
            <h4 className="text-lg font-semibold">Main Picture:</h4>
            <img
              src={
                hotelDetails
                  ? values?.main_picture
                  : URL.createObjectURL(values?.main_picture)
              }
              alt="Main Preview"
              className="w-[38rem] h-[20rem] rounded-lg"
            />
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-semibold">Other Pictures:</h4>
            <div className="flex flex-wrap gap-4 mt-2">
              {values?.other_pictures?.map((picture, index) => (
                <img
                  key={index}
                  src={
                    hotelDetails
                      ? picture?.hotel_picture
                      : URL.createObjectURL(picture)
                  }
                  alt={`Preview ${index}`}
                  className="w-[286px] h-auto  rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinalDetails;
