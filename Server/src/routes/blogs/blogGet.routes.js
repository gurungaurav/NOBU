const express = require("express");
const blogController = require("../../controller/blog-controllers");
const { userBlogMidd } = require("../../middleware/client/user.midd");

const getBlogRoutes = express.Router();

getBlogRoutes.get("/getAllBlogs", blogController.getAllBlogs);
getBlogRoutes.get(
  "/getSpecificBlogs/:blog_id",
  userBlogMidd.getBlogsCommentsLikesMidd,
  blogController.getBlogsWithCommentsLikes
);


getBlogRoutes.get("/getBlogTags", blogController.getBlogTags)

module.exports = getBlogRoutes;
