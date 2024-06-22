import * as Yup from "yup"

export const contactUsValidationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phoneNumber: Yup.number("Phone Number must be on number").required("Phone Number is required"),
    message: Yup.string().required("Message is required"),
  });