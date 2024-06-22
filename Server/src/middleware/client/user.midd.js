const OtpModel = require("../../model/client/otp");
const UserModel = require("../../model/client/user");
const Filter = require("bad-words");
const successHandler = require("../../utils/handler/successHandler");
const BlogModel = require("../../model/blogs/blog");
const BlogTagsModel = require("../../model/blogs/blog_tags");
const bcrypt = require("bcrypt");
const TokenModel = require("../../model/client/token");
const sendMail = require("../../utils/mail/mailSender");
const crypto = require("crypto");
const BlogLikesModel = require("../../model/blogs/blog_likes");
const BookMarkModel = require("../../model/hotel/bookmarks");
const RoomModel = require("../../model/hotel/room");
const HotelModel = require("../../model/hotel/hotel");
const filter = new Filter();

class UserMiddleware {
  //!For registration
  //? http://localhost:1000/api/nobu/user/registerUser
  userRegistrationMidd = async (req, res, next) => {
    try {
      const { name, email, password, phone_number, confirmPassword } = req.body;

      const isNameClear = filter.isProfane(name);

      if (isNameClear) {
        throw { status: 400, message: "Please use appropirate name" };
      }

      const isPasswordClear = filter.isProfane(password);

      if (isPasswordClear) {
        throw { status: 400, message: "Please use appropirate name" };
      }

      const user = await UserModel.findOne({ where: { email: email } });

      // if (user.user_name === name) {
      //   throw { status: 409, message: "User name already taken!!" };
      // }

      if (user) {
        throw {
          status: 409,
          message:
            "This email has already been used. Please use a different email address.",
        };
      }

      const uriFromCloudinary = req.profile_picture;
      // console.log(uriFromCloudinary, "from user midd");
      req.profile_picture = uriFromCloudinary;
      req.user = { name, email, password, phone_number };
      next();
    } catch (e) {
      next(e);
    }
  };

  //!Middleware for login user
  //? http://localhost:1000/api/nobu/user/loginUser
  loginUserMidd = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ where: { email: email } });

      if (!user) {
        throw { status: 404, message: "Account hasn't been registered yet!!" };
      }

      const checkpassword = await bcrypt.compare(password, user.password);

      if (!checkpassword) {
        throw {
          status: 400,
          message:
            "Incorrect password. Please check your password and try again.",
        };
      }

      if (user.verified === false) {
        const token = await TokenModel.create({
          user_id: user.user_id,
          token_code: crypto.randomBytes(32).toString("hex"),
        });

        //!So this is the url or api key that the user will receive and then in the user routes i will verify it and send it to user
        const url = `http://localhost:3000/nobu/user/${user.user_id}/verify/${token.token_code}`;

        await sendMail(user.email, "Verify Email", url);

        throw {
          status: 403,
          message:
            "Your account is not verified. Please check your email and complete the verification process to proceed.",
        };
      }
      req.user = user;
      next();
    } catch (e) {
      next(e);
    }
  };

  //!Middleware for reseting the user password
  //? http://localhost:1000/api/nobu/user/userPasswordChange
  resetPasswordUserMidd = async (req, res, next) => {
    try {
      const { code, newPassword, confirmPassword } = req.body;

      const isClear = filter.isProfane(confirmPassword);

      if (isClear) {
        throw { status: 400, message: "Please use appropriate language." };
      }

      if (newPassword !== confirmPassword) {
        throw {
          status: 400,
          message: "New password and confirm password do not match.",
        };
      }

      const existCode = await OtpModel.findOne({ where: { otp_code: code } });

      if (!existCode) {
        throw { status: 400, message: "Invalid OTP." };
      }
      const user = await UserModel.findOne({
        where: { user_id: existCode.user_id },
      });

      if (!user) {
        throw {
          status: 404,
          message: "User not registered. Please sign up first.",
        };
      }

      //!Injected values
      req.user = { existCode, user, confirmPassword };
      next();
    } catch (e) {
      next(e);
    }
  };
  //? http://localhost:1000/api/nobu/user/updateUser/:user_id
  updateUserMidd = async (req, res, next) => {
    try {
      const { name, phone_number } = req.body;
      console.log(req.body);
      const user_id = req.params.user_id;
      console.log(user_id);

      const user = await UserModel.findOne({ where: { user_id: user_id } });

      if (!user) {
        throw {
          status: 404,
          message: "User not found. Please register or verify your user ID.",
        };
      }

      const checkName = filter.isProfane(name);

      if (checkName) {
        throw { status: 400, message: "Please use an appropriate name!" };
      }

      // if (password || newPassword) {
      //   if (password !== newPassword) {
      //     throw { status: 400, message: "Password didn't matched!" };
      //   }
      // }

      req.user = { name, phone_number, user };
      next();
    } catch (e) {
      next(e);
    }
  };

  //!Updating user password midd through profile through current password
  updatePasswordUserMidd = async (req, res, next) => {
    try {
      const { currentPassword, password, newPassword } = req.body;
      console.log(req.body);
      const user_id = req.params.user_id;
      console.log(user_id);

      const user = await UserModel.findOne({ where: { user_id: user_id } });

      if (!user) {
        throw { status: 404, message: "No user found!" };
      }

      const checkPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!checkPassword) {
        throw { status: 400, message: "Current password is incorrect." };
      }

      if (password || newPassword) {
        if (password !== newPassword) {
          throw {
            status: 400,
            message: "New password and confirm password do not match.",
          };
        }
      }

      req.user = { newPassword, user };
      next();
    } catch (e) {
      next(e);
    }
  };

  verifyOTPassword = async (req, res, next) => {
    try {
      const otp = req.body.otp;
      const { user_id } = req.params;

      const OTP = await OtpModel.findOne({ where: { otp_code: otp } });

      if (!OTP) {
        throw {
          status: 404,
          message:
            "No matching OTP found. Please make sure you entered the correct OTP.",
        };
      }

      const user = await UserModel.findOne({ where: { user_id: user_id } });

      if (!user) {
        throw {
          status: 404,
          message: "User not found. Please register or verify your user ID.",
        };
      }

      return successHandler(res, 201, { user_id: user.user_id }, "Success");
    } catch (e) {
      next(e);
    }
  };
}
class UserBlogMidd {
  //!Middleware for user to add blog
  //?http://localhost:1000/api/nobu/blog/postBlogs/:authorId
  userAddBlogMidd = async (req, res, next) => {
    try {
      console.log(req.body);
      const { title, content, image, blogTag } = req.body;
      const authorId = req.params.authorId;

      const user = await UserModel.findOne({ where: { user_id: authorId } });

      if (!user) {
        throw { status: 404, message: "User hasn't been registered yet!" };
      }
      const descCheck = filter.isProfane(content);

      if (descCheck) {
        throw { status: 400, message: "Please use appropriate words!" };
      }

      const titleCheck = filter.isProfane(title);

      if (titleCheck) {
        throw { status: 400, message: "Please use appropriate title!" };
      }

      const blogTags = await BlogTagsModel.findOne({
        where: { tag_name: blogTag },
      });

      if (!blogTags) {
        throw { status: 404, message: "Tags not found!" };
      }

      req.blogs = { title, content, authorId, blogTags };
      next();
    } catch (e) {
      next(e);
    }
  };

  //?http://localhost:1000/api/nobu/blog/postBlogComments/:userId/:blogId
  postBlogCommentsMidd = async (req, res, next) => {
    try {
      const { user_id, blog_id } = req.params;
      const { text } = req.body;

      const isTextClear = filter.isProfane(text);

      if (isTextClear) {
        throw { status: 400, message: "Please use appropriate comments!" };
      }

      const user = await UserModel.findOne({ where: { user_id: user_id } });

      if (!user) {
        throw {
          status: 404,
          message:
            "User hasn't been registered yet, Register to post the comments!",
        };
      }

      const blogs = await BlogModel.findOne({ where: { blog_id: blog_id } });

      if (!blogs) {
        throw { status: 404, message: "No blogs found!" };
      }

      req.postComments = { user, blogs, text };
      next();
    } catch (e) {
      next(e);
    }
  };

  //?http://localhost:1000/api/nobu/blog/likeBlogPosts/:user_id/:blog_id
  blogLikesMidd = async (req, res, next) => {
    try {
      const { user_id, blog_id } = req.params;

      const blogs = await BlogModel.findOne({ where: { blog_id: blog_id } });

      if (!blogs) {
        throw { status: 404, message: "No blogs found!" };
      }

      const user = await UserModel.findOne({ where: { user_id: user_id } });

      if (!user) {
        throw { status: 404, message: "User hasn't been registered yet!" };
      }

      const likedBlogs = await BlogLikesModel.findOne({
        where: { user_id: user_id, blog_id: blog_id },
      });

      if (likedBlogs) {
        const unlikeBlogs = await BlogLikesModel.destroy({
          where: { blog_likes_id: likedBlogs.blog_likes_id },
        });
        if (!unlikeBlogs) {
          throw { status: 500, message: "Unlike blog failed!" };
        }
        successHandler(res, 201, null, "Unliked blog!");
      } else {
        req.userBlogs = { user, blogs };
        next();
      }
    } catch (e) {
      next(e);
    }
  };

  getBlogsCommentsLikesMidd = async (req, res, next) => {
    try {
      const blog_id = req.params.blog_id;
      // console.log(blog_id);
      const blogs = await BlogModel.findOne({ where: { blog_id: blog_id } });

      if (!blogs) {
        throw { status: 404, message: "No blogs found!!" };
      }

      req.blogs = blogs;
      next();
    } catch (e) {
      next(e);
    }
  };
}

class UserHotelMidd {
  //? http://localhost:1000/api/nobu/user/addRoomReview/:user_id/:hotel_id
  hotelReviewMidd = async (req, res, next) => {
    try {
      const { user_id, hotel_id } = req.params;
      const { title, content, ratings } = req.body;

      const checkTitle = filter.isProfane(title);

      if (checkTitle) {
        throw { status: 400, message: "Please use an appropriate title." };
      }

      const checkContent = filter.isProfane(content);

      if (checkContent) {
        throw { status: 400, message: "Please use appropriate content." };
      }

      const hotel = await HotelModel.findOne({ where: { hotel_id: hotel_id } });

      if (!hotel) {
        throw { status: 404, message: "Hotel not found." };
      }

      const user = await UserModel.findOne({ where: { user_id: user_id } });

      if (!user) {
        throw { status: 404, message: "User not found." };
      }

      req.review = { user, hotel, title, content, ratings };
      next();
    } catch (e) {
      next(e);
    }
  };

  //? http://localhost:1000/api/nobu/user/getUser/allRooms/:hotel_id
  getAllHotelRoomsMidd = async (req, res, next) => {
    try {
      const hotel_id = req.params.hotel_id;
      const hotel = await HotelModel.findOne({ where: { hotel_id: hotel_id } });

      if (!hotel) {
        throw { status: 404, message: "No hotel's found!" };
      }

      req.hotel = hotel;
      next();
    } catch (e) {
      next(e);
    }
  };

  //? http://localhost:1000/api/nobu/user/getUser/rooms/:hotel_id/:room_id
  getHotelRoomMidd = async (req, res, next) => {
    try {
      const { room_id, hotel_id } = req.params;

      const hotel = await HotelModel.findOne({ where: { hotel_id: hotel_id } });

      if (!hotel) {
        throw { status: 404, message: "No hotel's found!" };
      }

      const room = await RoomModel.findOne({
        where: { room_id: room_id, hotel_id: hotel_id },
      });

      if (!room) {
        throw { status: 404, message: "No room's found!" };
      }

      req.room = { room, hotel };
      next();
    } catch (e) {
      next(e);
    }
  };

  //? http://localhost:1000/api/nobu/user/bookmark/:room_id/:hotel_id/:user_id
  bookMarkMidd = async (req, res, next) => {
    try {
      const { room_id, hotel_id, user_id } = req.params;
      console.log(user_id);
      const room = await RoomModel.findOne({
        where: { room_id: room_id, hotel_id: hotel_id },
      });

      if (!room) {
        throw { status: 404, message: "Room not found." };
      }

      const user = await UserModel.findOne({ where: { user_id: user_id } });

      if (!user) {
        throw {
          status: 404,
          message: "User not registered. Please sign up first.",
        };
      }

      const bookRoom = await BookMarkModel.findOne({
        where: { room_id: room_id, user_id: user_id },
      });

      if (bookRoom) {
        const remove = await BookMarkModel.destroy({
          where: { bookmark_id: bookRoom.bookmark_id },
        });
        if (!remove) {
          throw {
            status: 500,
            message: "Failed to remove bookmark. Please try again later.",
          };
        }
        return successHandler(res, 201, null, "Bookmark removed successfully.");
      }

      req.book = { user, room };
      next();
    } catch (e) {
      next(e);
    }
  };

  //! I will check that specific room dates of the booking of that which will be taken out from the bookings table and then show the available dates
  checkBookRooms = async (req, res, next) => {
    try {
      const { room_id, user_id } = req.params;
      console.log(user_id, "jajasja");
      const room = await RoomModel.findOne({ where: { room_id: room_id } });

      if (!room) {
        throw { status: 404, message: "Room not found." };
      }

      const user = await UserModel.findOne({ where: { user_id: user_id } });

      if (!user) {
        throw { status: 404, message: "User not found." };
      }

      req.book = { room, user };
      next();
    } catch (e) {
      next(e);
    }
  };
}

module.exports.userMidd = new UserMiddleware();
module.exports.userBlogMidd = new UserBlogMidd();
module.exports.userHotelMidd = new UserHotelMidd();
