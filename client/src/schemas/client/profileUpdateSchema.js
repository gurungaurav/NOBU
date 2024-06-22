import * as Yup from "yup";

export const profileUpdateSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(20, "Name must be at most 20 characters"),
  phone_number: Yup.number()
    .min(1000000000, "Numbers must be exactly 10 digits")
    .max(9999999999, "Numbers must be exactly 10 digits"),
});

export const passwordUpdateSchema = Yup.object({
  currentPassword: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(20, "Name must be at most 20 characters")
    .required(),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one digit")
    .matches(/[\W_]/, "Password must contain at least one special character")
    .required(),
  password: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Password must match")
    .required(),
});
