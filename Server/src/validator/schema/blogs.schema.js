const yup = require("yup");

const postBlogSchema = yup.object({
  body: yup.object({
    title: yup
      .string("Input must be string")
      .min(6, "Title must be at least 6 letters")
      .max(100, "Title must be below 100 letters")
      .required("Please provide a title."),
    content: yup
      .string("Input must be string")
      .required("Please provide a content"),
      blogTag: yup
      .string("Input must be string")
      .required("Please select a blogTag!"),
  }),
  params: yup.object({
    authorId: yup
      .number("Input must be number")
      .required("Please provide a author Id"),
  }),
});

const postCategoriesSchema = yup.object({
  body: yup.object({
    name: yup
      .string("Input must be string")
      .required("Please provide a name for blog tag!"),
    description: yup
      .string("Input must be string")
      .required("Please provide a description about the blog tag!"),
  }),
});

const postCommentsSchema = yup.object({
  body: yup.object({
    text: yup
      .string("Input must be string")
      .required("Please provide a comment!"),
  }),
  params: yup.object({
    user_id: yup
      .number("User id must be on number format!")
      .required("Please provide a user to post the comments!"),
    blog_id: yup
      .number("Blog id must be on number format")
      .required("Please provide a blog to post comments on it!"),
  }),
});

const blogPostLikeSchema = yup.object({
  params: yup.object({
    user_id: yup
      .number("User id must be on number format!")
      .required("Please provide a user to like the blog!"),
    blog_id: yup
      .number("Blog id must be on number format")
      .required("Please provide a blog to like on it!"),
  }),
});

module.exports = {
  postBlogSchema,
  postCategoriesSchema,
  postCommentsSchema,
  blogPostLikeSchema,
};
