import * as Yup from "yup";

export const passwordResetValidSchema = Yup.object({
  code: Yup.number("Input must be a number").required(
    "Please enter your code!"
  ),
  newPassword: Yup.string("Input must be a string")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one digit")
    .matches(/[\W_]/, "Password must contain at least one special character")
    .required("Please enter your newPassword!"),
  confirmPassword: Yup.string("Input must be a string")
    .oneOf([Yup.ref("newPassword"), null], "Password must be matched!")
    .required("Please enter your confrimPassword!"),
});
