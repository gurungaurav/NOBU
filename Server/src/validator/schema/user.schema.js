const yup = require("yup");

//!So validation will be done with yup, all the login and registration need to be redone again because
//!I have performed validator as the middleware and as controller need to fix this tommorrow
const userRegisterValidSchema = yup.object({
  body: yup.object({
    name: yup
      .string("Name must be string")
      .min(2, "Name must be at least 2 characters")
      .max(20, "Name must be at most 20 characters")
      .required("Please enter your name"),
    email: yup
      .string("Email must be string")
      .email("Please enter a valid email address")
      .required("Please enter your email"),
    phone_number: yup
      .number()
      .min(1000000000, "Numbers must be exactly 10 digits")
      .max(9999999999, "Numbers must be exactly 10 digits")
      .required("Please provide your phone number"),
    password: yup
      .string("Password must be string")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/\d/, "Password must contain at least one digit")
      .matches(/[\W_]/, "Password must contain at least one special character")
      .required("Please enter your password"),
    confirmPassword: yup
      .string("Confirm password must be string")
      .required("Please enter your confirm password")
      .oneOf([yup.ref("password"), null], "Password must match"),
  }),
});

const userLoginValidSchema = yup.object({
  body: yup.object({
    email: yup
      .string("Email must be string")
      .email("Please enter a valid email address")
      .required("Please enter your email address"),
    password: yup
      .string("Password must be string")
      .required("Please enter your password"),
  }),
});

const resetPasswordValidSchema = yup.object({
  body: yup.object({
    code: yup
      .number("Code must be number")
      .required("Please enter your verification code"),
    newPassword: yup
      .string("New password must be string")
      .min(8, "New password must be at least 8 characters")
      .matches(
        /[A-Z]/,
        "New password must contain at least one uppercase letter"
      )
      .matches(
        /[a-z]/,
        "New password must contain at least one lowercase letter"
      )
      .matches(/\d/, "New password must contain at least one digit")
      .matches(
        /[\W_]/,
        "New password must contain at least one special character"
      )
      .required("Please enter your new password"),
    confirmPassword: yup
      .string("Confirm password must be string")
      .required("Please enter your confirm password")
      .oneOf([yup.ref("newPassword"), null], "Password must match"),
  }),
});

const userBookmarksValidSchema = yup.object({
  params: yup.object({
    room_id: yup
      .number("Room id must be on integer format!")
      .required("Please provide a room"),
    hotel_id: yup
      .number("Hotel id must be on integer format!")
      .required("Please provide a hotel"),
    user_id: yup
      .number("User id must be on integer format!")
      .required("Please provide a user"),
  }),
});

const userHotelReviewValidSchema = yup.object({
  body: yup.object({
    ratings: yup
      .string("Room review star must be on integer data types!")
      .min(0, "Ratings can't be 0")
      .max(5, "Ratings max value is 5!")
      .required("Please provide ratings!"),
    content: yup
      .string("Content should be on string data types!")
      .required("Please provide a content for your review!!"),
    title: yup
      .string("Title must be on string data types!")
      .required("Please provide a title for your review!"),
  }),
  params: yup.object({
    hotel_id: yup
      .number("Hotel id must be on integer format!")
      .required("Please provide a hotel"),
    user_id: yup
      .number("User id must be on integer format!")
      .required("Please provide a user"),
  }),
});

module.exports = {
  userRegisterValidSchema,
  userLoginValidSchema,
  resetPasswordValidSchema,
  userBookmarksValidSchema,
  userHotelReviewValidSchema,
};
