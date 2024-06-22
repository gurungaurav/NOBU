const express = require("express");
const uploadCloudImage = require("../../middleware/upload/uploadCloudImage");
const roleAuth = require("../../middleware/auth/roleAuth");
const {
  postBlogSchema,
  postCategoriesSchema,
  postCommentsSchema,
  blogPostLikeSchema,
} = require("../../validator/schema/blogs.schema");
const blogController = require("../../controller/blog-controllers");
const { blogAdminMidd } = require("../../middleware/admin/admin.midd");
const blogValidatior = require("../../validator/blogs/blogs.validator");
const getBlogRoutes = require("./blogGet.routes");
const { userBlogMidd } = require("../../middleware/client/user.midd");
const multer = require("multer");
const upload = multer();
const blogRoutes = express.Router();

//!Cloud folder
const blogImageFolder = "blogPost";

//?http://localhost:1000/api/nobu/blog/postBlogs/:authorId
blogRoutes.post(
  "/postBlogs/:authorId",
  uploadCloudImage.uploadBlogImage(blogImageFolder),
  // roleAuth.UserAuthorizeRole(),
  blogValidatior.validateBlogPost(postBlogSchema),
  userBlogMidd.userAddBlogMidd,
  blogController.postUserBlogs
);

//?http://localhost:1000/api/nobu/blog/blogCategories
blogRoutes.post(
  "/blogCategories",
  roleAuth.AdminAuthorizeRole(),
  blogValidatior.validateBlogCategories(postCategoriesSchema),
  blogAdminMidd.blogCategoriesMidd,
  blogController.addBlogCategories
);

//?http://localhost:1000/api/nobu/blog/postBlogComments/:userId/:blogId
blogRoutes.post(
  "/postBlogComments/:user_id/:blog_id",
  // roleAuth.UserAuthorizeRole(),
  blogValidatior.validateBlogComments(postCommentsSchema),
  userBlogMidd.postBlogCommentsMidd,
  blogController.postBlogComments
);

//?http://localhost:1000/api/nobu/blog/likeBlogPosts/:user_id/:blog_id
blogRoutes.post(
  "/likeBlogPosts/:user_id/:blog_id",
  blogValidatior.validateBlogLikes(blogPostLikeSchema),
  userBlogMidd.blogLikesMidd,
  blogController.likeBlogPost
);

//?http://localhost:1000/api/nobu/blog/postBlogs/:authorId
blogRoutes.put(
  "/updateBlogs/:authorId/:blogId",
  uploadCloudImage.uploadBlogImage(blogImageFolder),
  blogController.updateBlogs
);

//!Get blog routes
blogRoutes.use("/getBlogs", getBlogRoutes);

module.exports = blogRoutes;
