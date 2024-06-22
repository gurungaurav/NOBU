import * as Yup from "yup";

export const signUpValiSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(20, "Name must be at most 20 characters")
    .required("Please enter your name"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Please enter your email"),
  phone_number: Yup.number()
    .min(1000000000, "Numbers must be exactly 10 digits")
    .max(9999999999, "Numbers must be exactly 10 digits")
    .required("Please provide your phone number"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one digit")
    .matches(/[\W_]/, "Password must contain at least one special character")
    .required("Please enter your password"),
  confirmPassword: Yup.string()
    .required("Please enter your confirm password")
    .oneOf([Yup.ref("password"), null], "Password must match"),
});
