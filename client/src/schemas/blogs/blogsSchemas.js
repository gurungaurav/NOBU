import * as Yup from "yup";

export const blogsPostSchema = Yup.object({
  title: Yup.string()
    .min(6, "Title must be at least 6 letters")
    .max(100, "Title must be below 100 letters")
    .required(),
  content: Yup.string().required(),
  picture: Yup.string().required(),
});
