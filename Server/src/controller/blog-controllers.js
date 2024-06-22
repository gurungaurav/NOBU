const BlogModel = require("../model/blogs/blog");
const BlogCommentModel = require("../model/blogs/blog_comments");
const BlogLikesModel = require("../model/blogs/blog_likes");
const BlogTagsModel = require("../model/blogs/blog_tags");
const BlogCategoryModel = require("../model/blogs/blog_tags");
const UserModel = require("../model/client/user");
const successHandler = require("../utils/handler/successHandler");

class BlogControllers {
  //!For posting blog
  //?http://localhost:1000/api/nobu/blog/postBlogs/:authorId
  postUserBlogs = async (req, res, next) => {
    try {
      const { title, content, authorId, blogTags } = req.blogs;
      const uriFromCloudinary = req.blog_Image;

      const authId = parseInt(authorId);
      //!If there is slug and image it will be stored and if not null will be stored
      const image = uriFromCloudinary ? uriFromCloudinary.secure_url : null;
      // console.log(uriFromCloudinary.secure_url,'shhhds');

      const blog = await BlogModel.create({
        title,
        content,
        author_id: authId,
        blog_tag_id: blogTags.tag_id,
        picture: image,
      });

      if (!blog) {
        throw {
          status: 500,
          message: "Failed to post the blog! Please try again later.",
        };
      }

      successHandler(res, 201, blog, "Blog successfully posted.");
    } catch (e) {
      next(e);
    }
  };

  //!For category
  //?http://localhost:1000/api/nobu/blog/blogCategories
  addBlogCategories = async (req, res, next) => {
    try {
      const { name, description } = req.blogCat;

      const postBlog = await BlogTagsModel.create({
        tag_name: name,
        description,
      });

      if (!postBlog) {
        throw {
          status: 500,
          message: "Failed to add the blog category. Please try again later.",
        };
      }

      successHandler(res, 201, postBlog, "Blog category successfully added.");
    } catch (e) {
      next(e);
    }
  };

  //?http://localhost:1000/api/nobu/blog/postBlogComments/:userId/:blogId
  postBlogComments = async (req, res, next) => {
    try {
      const { user, blogs, text } = req.postComments;

      const postComments = await BlogCommentModel.create({
        content: text,
        user_id: user.user_id,
        blog_id: blogs.blog_id,
      });

      if (!postComments) {
        throw {
          status: 500,
          message: "Failed to post the comment. Please try again later.",
        };
      }

      successHandler(res, 201, postComments, "Comment successfully posted.");
    } catch (e) {
      next(e);
    }
  };

  //?http://localhost:1000/api/nobu/blog/likeBlogPosts/:user_id/:blog_id
  likeBlogPost = async (req, res, next) => {
    try {
      const { user, blogs } = req.userBlogs;

      const likeBlogs = await BlogLikesModel.create({
        user_id: user.user_id,
        blog_id: blogs.blog_id,
      });

      if (!likeBlogs) {
        throw {
          status: 500,
          message: "Failed to like the blog post. Please try again later.",
        };
      }

      successHandler(res, 201, likeBlogs, "Blog post successfully liked.");
    } catch (e) {
      next(e);
    }
  };

  getAllBlogs = async (req, res, next) => {
    try {
      // Pagination parameters
      console.log(req.query);
      const page = parseInt(req.query.pageNumber) || 1;
      const limit = parseInt(req.query.pageLimit) || 8; // Default limit is 10

      // Calculate offset
      const offset = (page - 1) * limit;

      // Fetch blogs with pagination
      const blogs = await BlogModel.findAll({
        offset,
        limit,
        order: [["createdAt", "DESC"]], // You may change the order as needed
      });

      // If there are no blogs found for the given page, return a 404 response
      if (!blogs.length) {
        throw { status: 404, message: "No blogs found for this page." };
      }

      // Process each blog and retrieve additional information
      const allBlogs = await Promise.all(
        blogs.map(async (blog) => {
          const blogTags = await BlogTagsModel.findOne({
            where: { tag_id: blog.blog_tag_id },
          });
          const user = await UserModel.findOne({
            where: { user_id: blog.author_id },
          });
          return {
            blog_id: blog.blog_id,
            title: blog.title,
            content: blog.content,
            picture: blog.picture,
            blogTag: {
              blog_tag_id: blogTags.tag_id,
              blog_tag_name: blogTags.tag_name,
            },
            author: {
              user_id: user.user_id,
              user_name: user.user_name,
            },
            createdAt: blog.createdAt,
          };
        })
      );

      const totalBlogsCount = await BlogModel.count();

      const blogDetails = {
        page,
        limit,
        total: totalBlogsCount, // Total number of blogs
        data: allBlogs,
      };
      return successHandler(
        res,
        200,
        blogDetails,
        "Blogs retrieved successfully."
      );
    } catch (error) {
      // Handle errors
      next(error);
    }
  };

  getBlogsWithCommentsLikes = async (req, res, next) => {
    try {
      const blogs = req.blogs;
      console.log(blogs.blog_id);

      const comments = await BlogCommentModel.findAll({
        where: { blog_id: blogs.blog_id },
      });

      const likes = await BlogLikesModel.findAll({
        where: { blog_id: blogs.blog_id },
      });
      console.log(likes.length);

      const recommendBlogs = await BlogModel.findAll({
        where: { blog_tag_id: blogs.blog_tag_id },
      });
      // let allComments =[]
      // for(let i =0; comments.length > i; i++){
      //   const user = await UserModel.findOne({where:{user_id: comments[i].user_id}})
      //   console.log(user,'sdfs');
      //   allComments.push(user)
      // }

      // console.log(allComments,'sjddj');

      const allComments = await Promise.all(
        comments.map(async (comment) => {
          const user = await UserModel.findOne({
            where: { user_id: comment.user_id },
          });

          return {
            comment_id: comment.comment_id,
            content: comment.content,
            user: {
              user_id: user.user_id,
              user_name: user.user_name,
              picture: user.profile_picture,
            },
            createdAt: comment.createdAt,
          };
        })
      );

      const allLikes = await Promise.all(
        likes.map(async (like) => {
          const user = await UserModel.findOne({
            where: { user_id: like.user_id },
          });

          return {
            blog_likes_id: like.blog_likes_id,
            user: {
              user_id: user.user_id,
              user_name: user.user_name,
            },
            createdAt: like.createdAt,
          };
        })
      );
      const allRecommendBlogs = await Promise.all(
        recommendBlogs.map(async (blog) => {
          const blogTags = await BlogTagsModel.findOne({
            where: { tag_id: blog.blog_tag_id },
          });
          return {
            blog_id: blog.blog_id,
            title: blog.title,
            content: blog.content,
            picture: blog.picture,
            blogTag: {
              blog_tag_id: blogTags.tag_id,
              blog_tag_name: blogTags.tag_name,
            },
            // author: {
            //   user_id: user.user_id,
            //   user_name: user.user_name
            // },
            createdAt: blog.createdAt,
          };
        })
      );

      const blogTags = await BlogTagsModel.findOne({
        where: { tag_id: blogs.blog_tag_id },
      });

      const author = await UserModel.findOne({
        where: { user_id: blogs.author_id },
      });

      const blogDetails = {
        blog: blogs.blog_id,
        title: blogs.title,
        content: blogs.content,
        picture: blogs.picture,
        createdAt: blogs.createdAt,
        blog_Tag: {
          tag_id: blogTags.tag_id,
          tag_name: blogTags.tag_name,
        },
        author: {
          user_id: author.user_id,
          user_name: author.user_name,
          picture: author.profile_picture,
        },
        allComments,
        allLikes,
        allRecommendBlogs,
      };

      successHandler(
        res,
        200,
        blogDetails,
        "Blog details retrieved successfully."
      );
    } catch (e) {
      next(e);
    }
  };

  getBlogTags = async (req, res, next) => {
    try {
      const blogTags = await BlogTagsModel.findAll();

      if (!blogTags) {
        throw { status: 404, message: "No tags found!!" };
      }

      return successHandler(
        res,
        200,
        blogTags,
        "Successfully retrieved available blog tags."
      );
    } catch (e) {
      next(e);
    }
  };

  updateBlogs = async (req, res, next) => {
    try {
      const { title, content, blogTag } = req.body;
      const uriFromCloudinary = req.blog_Image;
      const authorId = req.params.authorId;
      const blogId = req.params.blogId;

      const blogTags = await BlogTagsModel.findOne({
        where: { tag_name: blogTag },
      });
      //!If there is slug and image it will be stored and if not null will be stored
      const image = uriFromCloudinary ? uriFromCloudinary.secure_url : null;

      const blog = await BlogModel.update(
        {
          title,
          content,
          author_id: authorId,
          blog_tag_id: blogTags?.tag_id,
          picture: image,
        },
        { where: { blog_id: blogId } }
      );

      if (!blog) {
        throw {
          status: 500,
          message: "Failed to update the blog! Please try again later.",
        };
      }

      successHandler(res, 201, blog, "Blog updated successfully.");
    } catch (e) {
      next(e);
    }
  };
}

const blogController = new BlogControllers();
module.exports = blogController;
