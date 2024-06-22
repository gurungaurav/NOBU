import * as Yup from "yup";

export const hotelFormSchema = Yup.object({
  hotel_name: Yup.string()
    .min(2, "Hotel name must be at least 2 characters")
    .max(50, "Hotel name must be at most 50 characters")
    .required("Please enter the hotel name"),
  phone_number: Yup.string().required("Please enter the phone number"),
  description: Yup.string()
    // .max(400, "Description must be at most 400 characters")
    .required("Please enter a description"),
  location: Yup.string()
    .min(5, "Location must be at least 5 characters")
    .required("Please enter the location"),
  ratings: Yup.number()
    .min(1, "Ratings must be at least 1")
    .max(5, "Ratings must be at most 5")
    .required("Please enter the ratings"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Please enter the email"),
  main_picture: Yup.string()
    .required("Please provide a picture for your hotel"),
  other_pictures: Yup.array()
    .min(1, "Please upload at least one picture")
    .required("Please provide picture"),
  amenities: Yup.array()
    .min(1, "Please select at least one amenity")
    .required("Please select amenities"),
  agreedToTerms: Yup.boolean()
    .oneOf([true], "Please agree to the terms and conditions")
    .required("Please agree to the terms and conditions"),
});
