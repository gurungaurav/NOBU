const yup = require("yup");

const vendorRegisterValidSchema = yup.object({
  body: yup.object({
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
    // main_picture: yup.string()
    //   .max(1, "Please provide a single picture only")
    //   .required("Please provide a picture for your hotel"),
    // other_pictures: yup.array()
    //   .min(1, "Please upload at least one picture")
    //   .required("Please provide picture"),
    amenities: yup
      .array()
      .min(1, "Please select at least one amenity")
      .required("Please select amenities"),
  }),
  params: yup.object({
    user_id: yup
      .number("User id must be number!")
      .required("Please provide your user id"),
  }),
});

const roomRegistrationValidSchema = yup.object({
  body: yup.object({
    // description: yup
    //   .string("Description must be on string format!")
    //   .required("Please enter your description for the room"),
    price_per_night: yup
      .string("Price must be on string format!")
      .required("Please enter your Price for the room"),
    amenities: yup.array().required("Please enter your hotel amenities !"),
    room_type: yup
      .string("Room type must be on string format")
      .required("Please provide a room types!"),
    bed_types: yup.array().required("Please enter your rooms bed types !"),
  }),
  params: yup.object({
    vendor_id: yup
      .number("Hotel id must be number!")
      .required("Please provide a hotel to add the rooms!"),
  }),
});

module.exports = { vendorRegisterValidSchema, roomRegistrationValidSchema };
