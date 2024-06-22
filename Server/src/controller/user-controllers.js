const successHandler = require("../utils/handler/successHandler");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const UserModel = require("../model/client/user");
const TokenModel = require("../model/client/token");
const OtpModel = require("../model/client/otp");
const { jwtCreation } = require("../utils/jwt/token-manager");
const BookMarkModel = require("../model/hotel/bookmarks");
const HotelReviewModel = require("../model/hotel/hotel_reviews");
const HotelModel = require("../model/hotel/hotel");
const RoomModel = require("../model/hotel/room");
const { Sequelize, Op, where } = require("sequelize");
const AmenitiesModel = require("../model/hotel/amenities");
const HotelPicturesModel = require("../model/hotel/hotel_pictures");
const RoomPicturesModel = require("../model/hotel/room_pictures");
const RoomTypesModel = require("../model/hotel/room_types");
const RoomBedsModel = require("../model/hotel/room_beds");
const BedTypesModel = require("../model/hotel/bed_types");
const BookingModel = require("../model/client/bookings");
const axios = require("axios");
const { paymentConfirmation } = require("../khalti/khaltiAPI");
const PaymentModel = require("../model/client/payment");
const TransactionModel = require("../model/client/transactions");
const sequelize = require("../config/dbConfig");
const generatePDF = require("../utils/pdf/pdfGenerator");
const pdfSender = require("../utils/mail/pdfSender");
const NotificationModel = require("../model/client/notifications");
const Hotel_Additional_Services = require("../model/hotel/hotel_additional_services");
const Bookings_Additional_Services = require("../model/client/booking_additional_services");
require("dotenv").config();
const nodemailer = require("nodemailer");
const moment = require("moment");
const FAQModel = require("../model/hotel/faq");
const { sendMail, customMailSender } = require("../utils/mail/mailSender");
const BlogModel = require("../model/blogs/blog");
const BlogTagsModel = require("../model/blogs/blog_tags");

class UserControllers {
  //? http://localhost:1000/api/nobu/user/registerUser
  addUser = async (req, res, next) => {
    try {
      const { name, email, password, phone_number } = req.user;

      const uriFromCloudinary = req.profile_picture;

      const profile_pic = req.profile_picture
        ? uriFromCloudinary.secure_url
        : "https://res.cloudinary.com/dr1giexhn/image/upload/v1715435659/userProfile/pfp_ehyg3e.png";

      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);

      const user = await UserModel.create({
        user_name: name,
        email: email,
        password: hashedPass,
        profile_picture: profile_pic,
        phone_number: phone_number,
      });

      if (!user) {
        throw {
          status: 500,
          message: "Failed to create user. Please try again later.",
        };
      }

      //!So how does the verify of mail works
      //!At first adds account and then the user is ovbiously set to unverified and then token is generated and then
      //!It is sent through the mail using nodemailer and then the url that user receives it is then verified

      const token = await TokenModel.create({
        user_id: user.user_id,
        token_code: crypto.randomBytes(32).toString("hex"),
      });

      //!So this is the url or api key that the user will receive and then in the user routes i will verify it and send it to user
      const url = `http://localhost:3000/nobu/user/${user.user_id}/verify/${token.token_code}`;

      await sendMail(user.email, "Verify Email", url);

      successHandler(
        res,
        201,
        null,
        "An email has been sent to your email address. Please check your inbox (and spam folder) and follow the instructions to verify your email."
      );
    } catch (e) {
      next(e);
    }
  };

  //!This is for generating jwt
  //? http://localhost:1000/api/nobu/user/loginUser
  loginUser = async (req, res, next) => {
    try {
      const user = req.user;
      const name = user.user_name;
      const id = user.user_id;
      const role = user.roles;
      const profile_picture = user.profile_picture;

      const token = jwtCreation(name, id, role, profile_picture);
      if (!token) {
        throw {
          status: 500,
          message: "Failed to generate token. Please try again later.",
        };
      }

      successHandler(
        res,
        201,
        { token: token },
        "Token generated successfully."
      );
    } catch (e) {
      next(e);
    }
  };

  //!This is after verification of jwt
  //? http://localhost:1000/api/nobu/user/loginUser/jwtVerify
  loggedUser = async (req, res, next) => {
    try {
      const { name, id, role, profile_picture } = req.user;
      const { Token } = req.token;

      const jwt = Token;

      const user = await UserModel.findOne({ where: { user_id: id } });

      if (!user) {
        throw {
          status: 400,
          message:
            "User not found. Please make sure you entered the correct user ID.",
        };
      }

      successHandler(
        res,
        200,
        { name, id, role, profile_picture, jwt },
        "Logged in successfully"
      );
    } catch (e) {
      next(e);
    }
  };

  //!For user verification success from mail
  //? http://localhost:1000/api/nobu/user/:id/verify/:token
  mailVerifiedController = async (req, res, next) => {
    try {
      const { token, userId } = req.token;
      console.log(typeof userId, "from mail hehe");

      const id = parseInt(userId);
      const verify = { verified: true };

      // const verified = await UserModel.update(verify,{where:{id:userId}});
      const verified = await UserModel.update(verify, {
        where: { user_id: userId },
      });

      if (!verified) {
        throw {
          status: 500,
          message: "User verification failed. Please try again later.",
        };
      }

      const destroy_Token = await TokenModel.destroy({
        where: { token_id: token.token_id },
      });

      if (!destroy_Token) {
        throw {
          status: 500,
          message:
            "Failed to delete verification token. Please try again later.",
        };
      }
      successHandler(
        res,
        201,
        null,
        "Your account has been successfully verified!"
      );
    } catch (e) {
      next(e);
    }
  };

  //!OTP code for password reset //! Not using this one
  sendOTPPassRe = async (req, res, next) => {
    try {
      const id = req.params.id;

      const user = await UserModel.findOne({ where: { user_id: id } });

      if (!user) {
        throw { status: 400, message: "No user found!!" };
      }

      const max = 9999;
      const min = 1000;

      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

      const otpCode = await OtpModel.create({ otp: randomNumber, user_id: id });

      const url = `http://localhost:3000/nobu/user/${user.user_id}/OTPCode/${otpCode.otp_code}`;

      await sendMail(user.email, "Verify Email", url);

      successHandler(res, 201, null, "OTP code sent! check your email!");
    } catch (e) {
      next(e);
    }
  };

  //!For users reset password
  //? http://localhost:1000/api/nobu/user/userPasswordChange
  resetUserPassword = async (req, res, next) => {
    try {
      const { existCode, user, confirmPassword } = req.user;

      const saltPass = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(confirmPassword, saltPass);

      let password = { password: hashedPassword };

      const updatePassword = await UserModel.update(password, {
        where: { user_id: user.user_id },
      });

      if (!updatePassword) {
        throw {
          status: 500,
          message: "Failed to update password. Please try again later.",
        };
      }

      const removeCode = await OtpModel.destroy({
        where: { opt_id: existCode.opt_id },
      });

      if (!removeCode) {
        throw { status: 400, message: "OTP has already expired." };
      }

      successHandler(
        res,
        201,
        null,
        "Password changed successfully. Please log in with your new password."
      );
    } catch (e) {
      next(e);
    }
  };

  //? http://localhost:1000/api/nobu/user/updateUser/:user_id
  updateUser = async (req, res, next) => {
    try {
      const { name, phone_number, user } = req.user;
      const uriFromCloudinary = req.profile_picture;

      const user_name = name ? name : user.user_name;
      const number = phone_number ? phone_number : user.phone_number;

      const profile_picture = req.profile_picture
        ? uriFromCloudinary.secure_url
        : user.profile_picture;

      const updatedUser = await UserModel.update(
        { user_name, phone_number: number, profile_picture },
        { where: { user_id: user.user_id } }
      );

      if (!updatedUser) {
        throw {
          status: 500,
          message: "Failed to update user. Please try again later.",
        };
      }

      const newUser = await UserModel.findOne({
        where: { user_id: user.user_id },
      });

      successHandler(res, 201, newUser, "User updated successfully.");
    } catch (e) {
      next(e);
    }
  };

  //!This is used for updating user's password through current password through profile
  updatePasswordProfile = async (req, res, next) => {
    try {
      const { newPassword, user } = req.user;

      const salt = await bcrypt.genSalt(10);

      const password = newPassword
        ? await bcrypt.hash(newPassword, salt)
        : user.password;

      const updatedUser = await UserModel.update(
        { password },
        { where: { user_id: user.user_id } }
      );

      if (!updatedUser) {
        throw {
          status: 500,
          message: "Failed to update user's password. Please try again later.",
        };
      }

      const newUser = await UserModel.findOne({
        where: { user_id: user.user_id },
      });

      successHandler(
        res,
        201,
        newUser,
        "User's password updated successfully."
      );
    } catch (e) {
      next(e);
    }
  };

  userDetails = async (req, res, next) => {
    try {
      const { id } = req.params;

      const user = await UserModel.findOne({ where: { user_id: id } });

      if (!user) {
        throw { status: 404, message: "No user found!" };
      }

      const reviews = await HotelReviewModel.findAll({
        where: { user_id: id },
      });

      let reviewLists = [];
      if (reviews) {
        for (let review of reviews) {
          const hotel = await HotelModel.findOne({
            where: { hotel_id: review.hotel_id },
          });
          const reviewDetails = {
            reviews_id: review?.hotel_review_id,
            title: review?.title,
            content: review?.content,
            ratings: review?.ratings,
            createdAt: review?.createdAt,
            hotel: {
              hotel_id: hotel?.hotel_id,
              hotel_name: hotel?.hotel_name,
              hotel_picture: hotel?.main_picture,
            },
          };

          reviewLists.push(reviewDetails);
        }
      }

      const bookMarks = await BookMarkModel.findAll({ where: { user_id: id } });

      let bookMarkLists = [];
      if (bookMarks.length > 0) {
        for (let bookmarks of bookMarks) {
          const rooms = await RoomModel.findOne({
            where: { room_id: bookmarks.room_id },
          });
          const hotel = await HotelModel.findOne({
            where: { hotel_id: rooms.hotel_id },
          });
          const roomType = await RoomTypesModel.findOne({
            where: { room_type_id: rooms.room_type_id },
          });
          const roomPics = await RoomPicturesModel.findAll({
            where: { room_id: rooms.room_id },
          });
          const bookMarkss = {
            bookmark_id: bookmarks.bookmark_id,
            user_id: bookmarks.user_id,
            room: {
              room_id: rooms.room_id,
              room_picture: roomPics[0].room_picture,
              room_type: roomType.type_name,
              hotel_id: hotel.hotel_id,
              hotel_name: hotel.hotel_name,
              hotel_location: hotel.location,
            },
          };
          bookMarkLists.push(bookMarkss);
        }
      }

      const blogs = await BlogModel.findAll({
        where: { author_id: user.user_id },
        order: [["createdAt", "DESC"]],
      });

      const userDetails = {
        user_id: user.user_id,
        user_name: user.user_name,
        email: user.email,
        profile_picture: user.profile_picture,
        roles: user.roles,
        phone_number: user.phone_number,
        verified: user.verified,
        createdAt: user.createdAt,
        reviews: reviewLists,
        blogs,
        bookMarkLists,
      };
      return successHandler(res, 200, userDetails, "Available user");
    } catch (e) {
      next(e);
    }
  };

  generateVerifyTokenMail = async (req, res, next) => {
    try {
      const user_id = req.params.user_id;

      const user = await UserModel.findOne({ where: { user_id: user_id } });

      if (!user) {
        throw { status: 404, message: "No user found!" };
      }

      if (user.verified) {
        throw { status: 400, message: "User has already been verified!" };
      }

      const token = await TokenModel.create({
        user_id: user.user_id,
        token_code: crypto.randomBytes(32).toString("hex"),
      });

      //!So this is the url or api key that the user will receive and then in the user routes i will verify it and send it to user
      const url = `http://localhost:3000/nobu/user/${user.user_id}/verify/${token.token_code}`;

      await sendMail(user.email, "Verify Email", url);

      successHandler(
        res,
        201,
        null,
        "A verification link has been sent to your email!"
      );
    } catch (e) {
      next(e);
    }
  };
}

class UserHotelController {
  //? http://localhost:1000/api/nobu/user/bookmark/:room_id/:hotel_id/:user_id
  bookMarkRoom = async (req, res, next) => {
    try {
      const { user, room } = req.book;

      const bookRoom = await BookMarkModel.create({
        user_id: user.user_id,
        room_id: room.room_id,
      });

      if (!bookRoom) {
        throw {
          status: 400,
          message:
            "Failed to create bookmark for room. Please try again later.",
        };
      }

      successHandler(res, 201, bookRoom, "Room bookmarked successfully.");
    } catch (e) {
      next(e);
    }
  };

  //? http://localhost:1000/api/nobu/user/addRoomReview/:user_id/:hotel_id
  hotelReview = async (req, res, next) => {
    try {
      const { user, hotel, title, content, ratings } = req.review;

      const review = await HotelReviewModel.create({
        ratings: ratings,
        hotel_id: hotel.hotel_id,
        user_id: user.user_id,
        title: title,
        content: content,
      });

      if (!review) {
        throw {
          status: 500,
          message: "Failed to create review. Please try again later.",
        };
      }

      successHandler(res, 201, review, "Review posted successfully.");
    } catch (e) {
      next(e);
    }
  };

  // //? http://localhost:1000/api/nobu/user/getUser/allRooms/:hotel_id
  // getAllHotelRooms = async (req, res, next) => {
  //   try {
  //     const hotel = req.hotel;

  //     const rooms = await RoomModel.findAll({
  //       where: { hotel_id: hotel.hotel_id },
  //     });

  //     successHandler(res, 200, rooms, "These are the all rooms of a hotel!");
  //   } catch (e) {
  //     next(e);
  //   }
  // };

  //? http://localhost:1000/api/nobu/user/getUser/rooms/:hotel_id/:room_id
  getHotelRoom = async (req, res, next) => {
    try {
      const { room, hotel } = req.room;

      const room_Pictures = await RoomPicturesModel.findAll({
        where: { room_id: room.room_id },
      });
      // const vendor = await UserModel.findOne({
      //   where: { user_id: hotel.vendor_id },
      // });

      const beds = await RoomBedsModel.findAll({
        where: { room_id: room.room_id },
      });
      console.log(beds);

      const roomType = await RoomTypesModel.findOne({
        where: { room_type_id: room.room_type_id },
      });

      const bookMarks = await BookMarkModel.findAll({
        where: { room_id: room.room_id },
      });

      const checkBeds = await Promise.all(
        beds.map(async (beds) => {
          console.log(beds);
          const checkBed = await BedTypesModel.findOne({
            where: { bed_types_id: beds.bed_type_id },
          });
          return checkBed;
        })
      );

      let bookedDates = [];

      // if (room.is_available === false) {
      const bookedRooms = await BookingModel.findAll({
        where: { room_id: room.room_id },
      });
      // const successBooks = bookedRooms.filter(
      //   (success) => success.status === "booked"
      // );
      const date = bookedRooms.map((booked) => {
        console.log(booked.status);
        // if (booked.status === "success") {
        return {
          room_id: room.room_id,
          booked_id: booked.booking_id,
          user_id: booked.user_id,
          status: booked.status,
          total_price: booked.total_price,
          bookedDates: {
            check_in_date: booked.check_in_date,
            check_out_date: booked.check_out_date,
          },
          createdAt: booked.createdAt,
        };
      });

      bookedDates.push(date);
      // }

      const additionalServices = await Hotel_Additional_Services.findAll({
        where: { hotel_id: room.hotel_id },
      });

      let capacity = 0;

      checkBeds.map((bedss) => (capacity += bedss.capacity));

      const otherRooms = await RoomModel.findAll({
        where: {
          hotel_id: hotel.hotel_id,
          room_id: { [Op.not]: room.room_id },
        },
      });
      const recommendationRoomDetails = await Promise.all(
        otherRooms.map(async (room) => {
          // const amenities = await AmenitiesModel.findAll({
          //   where: { amenities_id: hotel.hotel_amenities },
          // });
          const room_Pictures = await RoomPicturesModel.findAll({
            where: { room_id: room.room_id },
          });
          const vendor = await UserModel.findOne({
            where: { user_id: hotel.vendor_id },
          });

          const room_type = await RoomTypesModel.findOne({
            where: { room_type_id: room.room_type_id },
          });
          return {
            hotel_id: hotel.hotel_id,
            room_id: room.room_id,
            room_type: room_type,
            capacity: room.room_capacity,
            price_per_night: room.price_per_night,
            vendor: {
              vendor_id: vendor.user_id,
              vendor_name: vendor.user_name,
              vendor_image: vendor.profile_picture,
            },
            description: room.description,
            other_pictures: room_Pictures.map((pic) => ({
              room_picture_id: pic.room_picture_id,
              room_picture: pic.room_picture,
            })),
            room_amenities: room.amenities.map((amen) => amen),
          };
        })
      );
      const roomDetails = {
        room_id: room.room_id,
        hotel_id: hotel.hotel_id,
        room_capacity: capacity,
        price_per_night: room.price_per_night,
        floor: room.floor,
        vendor_id: hotel.vendor_id,
        // vendor: {
        //   vendor_id: vendor.user_id,
        //   vendor_name: vendor.user_name,
        //   vendor_image: vendor.profile_picture,
        // },
        hotel_name: hotel.hotel_name,
        description: room.description,
        roomType,
        other_pictures: room_Pictures.map((pic) => ({
          room_picture_id: pic.room_picture_id,
          room_picture: pic.room_picture,
        })),
        room_amenities: room.amenities.map((amen) => amen),
        room_beds: checkBeds.map((bed) => bed),
        bookMarks,
        bookedDates,
        additionalServices,
        recommendationRoomDetails,
      };

      successHandler(
        res,
        200,
        roomDetails,
        "This the requried room for the hotel!"
      );
    } catch (e) {
      next(e);
    }
  };
  //? http://localhost:1000/api/nobu/user/getUser/allHotels
  getAllHotels = async (req, res, next) => {
    try {
      const hotels = await HotelModel.findAll();

      const allHotels = hotels.filter((hotel) => hotel.hotel_verified === true);

      const hotelDetails = await Promise.all(
        allHotels.map(async (hotel) => {
          // const amenities = await AmenitiesModel.findAll({
          //   where: { amenities_id: hotel.hotel_amenities },
          // });
          const hotel_Pictures = await HotelPicturesModel.findAll({
            where: { hotel_id: hotel.hotel_id },
          });
          const vendor = await UserModel.findOne({
            where: { user_id: hotel.vendor_id },
          });

          const reviews = await HotelReviewModel.findAll({
            where: { hotel_id: hotel.hotel_id },
          });
          // Calculate the average ratings
          const totalRatings = reviews.reduce(
            (sum, review) => sum + Number(review.ratings),
            0
          );
          const averageRatings = totalRatings / reviews.length;

          // Round off the average ratings to the nearest 0.5
          const roundedRatings = Math.round(averageRatings * 2) / 2;

          const rooms = await RoomModel.findAll({
            where: { hotel_id: hotel.hotel_id },
          });

          // Find the least and most expensive prices of the hotel
          const roomPrices = rooms.map((room) => room.price_per_night);
          const leastPrice = Math.min(...roomPrices);
          const mostExpensivePrice = Math.max(...roomPrices);
          return {
            hotel_id: hotel.hotel_id,
            vendor: {
              vendor_id: vendor.user_id,
              vendor_name: vendor.user_name,
              vendor_image: vendor.profile_picture,
            },
            hotel_name: hotel.hotel_name,
            location: hotel.location,
            description: hotel.description,
            main_picture: hotel.main_picture,
            phone_number: hotel.phone_number,
            ratings: hotel.ratings,
            email: hotel.email,
            hotel_verified: hotel.hotel_verified,
            hotel_reviews_ratings: roundedRatings,
            leastPrice: leastPrice,
            mostExpensivePrice: mostExpensivePrice,
            hotel_reviews: reviews.map((review) => ({
              review_id: review.hotel_review_id,
              ratings: review.ratings,
              user_id: review.user_id,
              hotel_id: review.hotel_id,
            })),
            other_pictures: hotel_Pictures.map((pic) => ({
              hotel_picture_id: pic.hotel_picture_id,
              hotel_picture: pic.hotel_picture,
            })),
            hotel_amenities: hotel.hotel_amenities,
            hotel_rooms: rooms.map((room) => ({
              room_id: room.room_id,
              price: room.price_per_night,
              is_available: room.is_available,
              room_capacity: room.room_capacity,
              hotel_id: room.hotel_id,
            })),
          };
        })
      );

      successHandler(res, 200, hotelDetails, "These are the available hotels!");
    } catch (e) {
      next(e);
    }
  };

  //? http://localhost:1000/api/nobu/user/getUser/mainHotel/:hotel_id
  getSpecificHotel = async (req, res, next) => {
    try {
      const hotel_id = req.params.hotel_id;
      console.log(hotel_id);
      const hotel = await HotelModel.findOne({ where: { hotel_id: hotel_id } });

      if (!hotel) {
        throw { status: 404, message: "No hotels found!" };
      }

      if (!hotel.hotel_verified) {
        throw { status: 409, message: "Please verify your hotel first!" };
      }

      const hotel_Pictures = await HotelPicturesModel.findAll({
        where: { hotel_id: hotel.hotel_id },
      });
      const vendor = await UserModel.findOne({
        where: { user_id: hotel.vendor_id },
      });

      const reviews = await HotelReviewModel.findAll({
        where: { hotel_id: hotel.hotel_id },
      });

      const additionalServices = await Hotel_Additional_Services.findAll({
        where: { hotel_id: hotel.hotel_id },
      });

      const rooms = await RoomModel.findAll({ where: { hotel_id: hotel_id } });

      const roomDetails = await Promise.all(
        rooms.map(async (room) => {
          // const amenities = await AmenitiesModel.findAll({
          //   where: { amenities_id: hotel.hotel_amenities },
          // });
          const room_Pictures = await RoomPicturesModel.findAll({
            where: { room_id: room.room_id },
          });
          const vendor = await UserModel.findOne({
            where: { user_id: hotel.vendor_id },
          });

          const room_type = await RoomTypesModel.findOne({
            where: { room_type_id: room.room_type_id },
          });
          return {
            hotel_id: hotel.hotel_id,
            room_id: room.room_id,
            room_type: room_type,
            capacity: room.room_capacity,
            price_per_night: room.price_per_night,
            vendor: {
              vendor_id: vendor.user_id,
              vendor_name: vendor.user_name,
              vendor_image: vendor.profile_picture,
            },
            description: room.description,
            other_pictures: room_Pictures.map((pic) => ({
              room_picture_id: pic.room_picture_id,
              room_picture: pic.room_picture,
            })),
            room_amenities: room.amenities.map((amen) => amen),
          };
        })
      );

      let review_users = [];
      for (let review of reviews) {
        const reviewUsers = await UserModel.findOne({
          where: { user_id: review.user_id },
        });
        const reviewss = {
          hotel_review_id: review.hotel_review_id,
          title: review.title,
          content: review.content,
          ratings: review.ratings,
          user: {
            user_id: reviewUsers.user_id,
            user_name: reviewUsers.user_name,
            user_pic: reviewUsers.profile_picture,
          },
          createdAt: review.createdAt,
        };
        review_users.push(reviewss);
      }

      const hotelDetails = {
        hotel_id: hotel.hotel_id,
        vendor: {
          vendor_id: vendor.user_id,
          vendor_name: vendor.user_name,
          vendor_image: vendor.profile_picture,
        },
        hotel_name: hotel.hotel_name,
        location: hotel.location,
        description: hotel.description,
        main_picture: hotel.main_picture,
        phone_number: hotel.phone_number,
        ratings: hotel.ratings,
        email: hotel.email,
        hotel_verified: hotel.hotel_verified,
        roomDetails,
        additionalServices,
        other_pictures: hotel_Pictures.map((pic) => ({
          hotel_picture_id: pic.hotel_picture_id,
          hotel_picture: pic.hotel_picture,
        })),
        hotel_amenities: hotel.hotel_amenities,
        hotel_reviews: review_users,
      };

      successHandler(res, 200, hotelDetails, "These are the available hotels!");
    } catch (e) {
      next(e);
    }
  };

  getBedTypes = async (req, res, next) => {
    try {
      const allBeds = await BedTypesModel.findAll();

      if (!allBeds) {
        throw { status: 404, message: "No beds found!" };
      }

      successHandler(res, 200, allBeds, "These are all the bed types");
    } catch (e) {
      next(e);
    }
  };

  getHotelReviews = async (req, res, next) => {
    try {
      const hotel_id = req.params.hotel_id;

      const hotel = await HotelModel.findOne({ where: { hotel_id: hotel_id } });

      if (!hotel) {
        throw { status: 404, message: "No hotel's found" };
      }

      const reviews = await HotelReviewModel.findAll({
        where: { hotel_id: hotel_id },
      });

      const allreviews = await Promise.all(
        reviews.map(async (rev) => {
          const users = await UserModel.findOne({
            where: { user_id: rev.user_id },
          });
          return {
            hotel_review_id: rev.hotel_review_id,
            ratings: rev.ratings,
            title: rev.title,
            content: rev.content,
            hotel: rev.hotel_id,
            user: {
              user_id: users.user_id,
              user_name: users.user_name,
            },
            createdAt: rev.createdAt,
          };
        })
      );

      if (!reviews) {
        throw { status: 404, message: "No reviews found" };
      }

      return successHandler(
        res,
        200,
        allreviews,
        "These are the available reviews"
      );
    } catch (e) {
      next(e);
    }
  };

  searchHotelFilter = async (req, res, next) => {
    try {
      const {
        ratings,
        amenities,
        roomTypes,
        minPrice,
        maxPrice,
        location,
        startDate,
        endDate,
        additionalServices,
        searchName,
      } = req.query;
      console.log(req.query, "jajja");

      // if (!searchParams) {
      //   throw { status: 404, message: "Please provide a query" };
      // }

      //!Everything runs with if the required filter exists or not then according to that the results are shown
      let filteredHotels = await HotelModel.findAll({
        where: { hotel_verified: true },
      });

      if (ratings > 0) {
        filteredHotels = filteredHotels.filter(
          (hotel) => hotel.ratings == ratings
        );
      }

      if (searchName != "" || searchName != undefined) {
        filteredHotels = filteredHotels.filter((hotel) =>
          hotel.hotel_name.toLowerCase().includes(searchName.toLowerCase())
        );
      }

      // if (additionalServices && additionalServices.length > 0) {
      //   console.log(additionalServices, "jajaj");
      //   const additionalServicesArray = Array.isArray(additionalServices)
      //     ? additionalServices
      //     : [additionalServices];
      //   filteredHotels = await HotelModel.findAll({
      //     include: [
      //       {
      //         model: Hotel_Additional_Services,
      //         where: {
      //           additional_services_id: {
      //             [Op.in]: additionalServicesArray,
      //           },
      //         },
      //         required: true,
      //       },
      //     ],
      //   });
      // }

      if (startDate && endDate) {
        // Map over each hotel to find available rooms
        filteredHotels = await Promise.all(
          filteredHotels.map(async (hotel) => {
            const availableRooms = await RoomModel.findAll({
              attributes: ["room_id"],
              where: {
                hotel_id: hotel.hotel_id,
                room_id: {
                  [Op.notIn]: sequelize.literal(`(
                  SELECT room_id
                  FROM bookings
                  WHERE status = 'booked'
                  AND room_id IS NOT NULL
                  AND hotel_id = ${hotel.hotel_id}
                  AND '${startDate}' <= check_out_date
                  AND '${endDate}' >= check_in_date
                )`),
                },
              },
            });

            // Check if any room of the hotel is available
            const isAnyRoomAvailable = availableRooms.length > 0;

            // If any room is available, include the hotel
            if (isAnyRoomAvailable) {
              return hotel;
            }

            // Otherwise, exclude the hotel
            return null;
          })
        );

        // Filter out null values (hotels with no available rooms)
        filteredHotels = filteredHotels.filter((hotel) => hotel !== null);
      }

      // if (minPrice && maxPrice) {
      //   filteredHotels = await HotelModel.findAll({
      //     include: [
      //       {
      //         model: RoomModel,
      //         where: {
      //           price_per_night: { [Op.between]: [minPrice, maxPrice] },
      //         },
      //       },
      //     ],
      //   });
      // }

      if (roomTypes) {
        const roomTypesArray = Array.isArray(roomTypes)
          ? roomTypes
          : [roomTypes];
        filteredHotels = await HotelModel.findAll({
          include: [
            {
              model: RoomModel,
              where: { room_type_id: roomTypesArray },
              required: true,
            },
          ],
        });
      }

      //!Sab amenities huna paryo yesma ani balla true aucha every use nagreko vaa euta amenities included cha tara arko chaina vane tyo hotel
      //! chai dekhaunu vayena cuz it dosenot match the requirements
      if (amenities) {
        const amenitiesArray = Array.isArray(amenities)
          ? amenities
          : [amenities];
        filteredHotels = filteredHotels.filter((hotel) =>
          amenitiesArray.every((amenity) =>
            hotel.hotel_amenities.includes(amenity)
          )
        );
      }

      if (location) {
        filteredHotels = filteredHotels.filter((hotel) =>
          hotel.location.includes(location)
        );
      }

      if (filteredHotels.length === 0) {
        throw { status: 404, message: "No results found!!" };
      }

      // After combining results from different queries
      // const uniqueHotels = filteredHotels.filter(
      //   (hotel, index, self) =>
      //     index === self.findIndex((h) => h.hotel_id === hotel.hotel_id)
      // );

      const hotelDetails = await Promise.all(
        filteredHotels.map(async (hotel) => {
          const vendor = await UserModel.findOne({
            where: { user_id: hotel.vendor_id },
          });

          const reviews = await HotelReviewModel.findAll({
            where: { hotel_id: hotel.hotel_id },
          });
          // Calculate the average ratings
          const totalRatings = reviews.reduce(
            (sum, review) => sum + Number(review.ratings),
            0
          );
          const averageRatings = totalRatings / reviews.length;

          // Round off the average ratings to the nearest 0.5
          const roundedRatings = Math.round(averageRatings * 2) / 2;

          const rooms = await RoomModel.findAll({
            where: { hotel_id: hotel.hotel_id },
          });

          // Find the least and most expensive prices of the hotel
          const roomPrices = rooms.map((room) => room.price_per_night);
          const leastPrice = Math.min(...roomPrices);
          const mostExpensivePrice = Math.max(...roomPrices);
          return {
            hotel_id: hotel.hotel_id,
            vendor: {
              vendor_id: vendor.user_id,
              vendor_name: vendor.user_name,
              vendor_image: vendor.profile_picture,
            },
            hotel_name: hotel.hotel_name,
            location: hotel.location,
            description: hotel.description,
            main_picture: hotel.main_picture,
            phone_number: hotel.phone_number,
            ratings: hotel.ratings,
            email: hotel.email,
            hotel_verified: hotel.hotel_verified,
            hotel_reviews_ratings: roundedRatings,
            leastPrice: leastPrice,
            mostExpensivePrice: mostExpensivePrice,
            hotel_reviews: reviews.map((review) => ({
              review_id: review.review_id,
              ratings: review.ratings,
              user_id: review.user_id,
              hotel_id: review.hotel_id,
            })),
            hotel_amenities: hotel.hotel_amenities,
            hotel_rooms: rooms.map((room) => ({
              room_id: room.room_id,
              price: room.price_per_night,
              is_available: room.is_available,
              room_capacity: room.room_capacity,
              hotel_id: room.hotel_id,
            })),
          };
        })
      );

      successHandler(res, 201, hotelDetails, "Searched Hotels");
    } catch (e) {
      next(e);
    }
  };

  searchRoomFilter = async (req, res, next) => {
    try {
      const {
        amenities,
        roomTypes,
        maxPrice,
        minPrice,
        bedTypes,
        capacity,
        startDate,
        endDate,
        floor,
      } = req.query;
      const { hotel_id } = req.params;

      console.log(req.query);
      let whereConditions = { hotel_id: hotel_id };
      console.log(maxPrice);
      if (maxPrice !== undefined && minPrice !== undefined) {
        whereConditions.price_per_night = {
          [Op.between]: [minPrice, maxPrice],
        };
      }

      if (capacity) {
        whereConditions.room_capacity = parseInt(capacity);
      }

      if (bedTypes) {
        const bedTypesArray = Array.isArray(bedTypes) ? bedTypes : [bedTypes];
        whereConditions["$room_beds.bed_type_id$"] = {
          [Op.in]: bedTypesArray,
        };
      }

      if (roomTypes) {
        const roomTypesArray = Array.isArray(roomTypes)
          ? roomTypes
          : [roomTypes];
        whereConditions.room_type_id = { [Op.in]: roomTypesArray };
      }

      if (startDate && endDate) {
        const bookedRooms = await BookingModel.findAll({
          attributes: ["room_id"],
          where: {
            room_id: { [Op.not]: null },
            check_in_date: { [Op.lte]: endDate },
            check_out_date: { [Op.gte]: startDate },
            status: "booked",
          },
        });

        const bookedRoomIds = bookedRooms.map((booking) => booking.room_id);

        whereConditions.room_id = { [Op.notIn]: bookedRoomIds };
      }

      if (floor !== undefined && floor !== "") {
        whereConditions.floor = floor;
      }

      let filteredRooms = await RoomModel.findAll({
        where: whereConditions,
        include: [{ model: RoomBedsModel, required: false }],
      });

      if (amenities) {
        const amenitiesArray = Array.isArray(amenities)
          ? amenities
          : [amenities];
        filteredRooms = filteredRooms.filter((room) =>
          amenitiesArray.every((amenity) => room.amenities.includes(amenity))
        );
      }

      if (filteredRooms.length === 0) {
        throw { status: 404, message: "No results found!!" };
      }

      const uniqueRooms = filteredRooms.filter(
        (room, index, self) =>
          index === self.findIndex((h) => h.room_id === room.room_id)
      );
      console.log(whereConditions, "hshshsh");

      const roomDetails = await Promise.all(
        uniqueRooms.map(async (room) => {
          const roomType = await RoomTypesModel.findOne({
            where: { room_type_id: room.room_type_id },
          });

          const room_Pictures = await RoomPicturesModel.findAll({
            where: { room_id: room.room_id },
          });

          return {
            room_id: room.room_id,
            room_type: roomType.type_name,
            price: room.price_per_night,
            price_per_night: room.price_per_night,
            is_available: room.is_available,
            room_capacity: room.room_capacity,
            hotel_id: room.hotel_id,
            description: room.description,
            room_amenities: room.amenities.map((amen) => amen),
            other_pictures: room_Pictures.map((pic) => ({
              room_picture_id: pic.room_picture_id,
              room_picture: pic.room_picture,
            })),
          };
        })
      );

      successHandler(res, 201, roomDetails, "Searched Rooms");
    } catch (e) {
      next(e);
    }
  };

  contactUsMail = async (req, res, next) => {
    try {
      const { vendor } = req.contact;
      const { firstName, lastName, email, message, phoneNumber } = req.body;

      const body = `Full Name: ${firstName}${lastName}, Email: ${email}, Phone Number: ${phoneNumber}, Message: ${message}`;

      await customMailSender(
        email,
        vendor.email,
        `Email from customer,${email} `,
        body
      );
      successHandler(
        res,
        201,
        null,
        "Your message has been successfully sent. Thank you for contacting us!"
      );
    } catch (e) {
      next(e);
    }
  };

  //!The default status of this will be reserved after the booking is done and before the payment is done
  bookRooms = async (req, res, next) => {
    try {
      const { room, user } = req.book;
      // const {transaction_pin, mobile} = req.body
      const { check_in_date, check_out_date, total_price, additionalServices } =
        req.body;
      console.log(req.body);
      const hotel = await HotelModel.findOne({
        where: { hotel_id: room.hotel_id },
      });
      // if (transaction_pin.toString().length > 4) {
      //   throw{status:401,message:"Pin's length must be 4"}
      // }
      const bookRooms = await BookingModel.create({
        user_id: user.user_id,
        room_id: room.room_id,
        check_in_date: check_in_date,
        check_out_date: check_out_date,
        total_price: total_price,
      });

      if (additionalServices.length > 0) {
        for (let i of additionalServices) {
          const addServices = await Bookings_Additional_Services.create({
            booking_id: bookRooms.booking_id,
            additional_services_id: i.additional_services_id,
          });
        }
      }

      const message = `The room has been booked by ${user.user_name}`;
      const createNotifications = await NotificationModel.create({
        sender_id: user.user_id,
        receiver_id: hotel.vendor_id,
        message: message,
      });

      return successHandler(res, 201, bookRooms, "Room booked successfully!");
    } catch (e) {
      next(e);
    }
  };

  //!This is the final payment where the khalti confiramtion will be done and then the details are stored on the database
  //! For khalti
  confirmPayment = async (req, res, next) => {
    try {
      console.log(req.body);
      const details = req.body;
      const { booking_id, hotel_id } = req.params;

      const bookingDetails = await BookingModel.findOne({
        where: { booking_id: booking_id },
      });

      const hotel = await HotelModel.findOne({ where: { hotel_id: hotel_id } });

      const test_secret_key = process.env.KHALTI_TEST_SECRET_KEY;
      let config = {
        headers: {
          Authorization: `Key ${test_secret_key}`,
        },
      };

      const haha = await axios.post(
        "https://khalti.com/api/v2/payment/verify/",
        details,
        config
      );
      console.log(haha.data);

      //!The commission will be submitted to the admin
      const originalAmount = haha.data.amount;
      const commission = (originalAmount * 10) / 100;
      const finalAmount = Math.round(originalAmount - commission);

      const transaction = await TransactionModel.create({
        transaction_id: haha.data.idx,
        amount: finalAmount,
        commission: commission,
        user_id: bookingDetails.user_id,
        vendor_id: hotel.vendor_id,
      });

      const payment = await PaymentModel.create({
        transaction_id: haha.data.idx,
        booking_id: bookingDetails.booking_id,
        method: "Khalti",
      });

      console.log(bookingDetails.user_id, "jehhehe");

      const user = await UserModel.findOne({
        where: {
          user_id: bookingDetails.user_id,
        },
      });

      console.log(user, "hahahah");

      const room = await RoomModel.findOne({
        where: { room_id: bookingDetails.room_id },
      });

      //!updateStatus of the room
      const status = { is_available: false };
      const updateRoom = await RoomModel.update(status, {
        where: { room_id: bookingDetails.room_id },
      });

      if (updateRoom) {
        console.log("updated successfully");
      } else {
        console.log("not updated");
      }

      //!For sending the other users who have pending status as their booking status basically sending a notification to that user
      //! For notifying that the room has been booked by others and your booking has been canceled hai ta hehe!
      const checkPendingBookings = await BookingModel.findAll({
        where: {
          room_id: bookingDetails.room_id,
          check_in_date: { [Op.lte]: bookingDetails.check_in_date },
          check_out_date: { [Op.gte]: bookingDetails.check_out_date },
          status: "pending",
          booking_id: { [Op.not]: bookingDetails.booking_id },
        },
      });

      if (checkPendingBookings.length > 0) {
        console.log("phshshshsh");
        for (let i of checkPendingBookings) {
          const sendNotification = await NotificationModel.create({
            message:
              "Your booking has been canceled due to non-payment. Another person has booked the room for that specific date.",

            receiver_id: i.user_id,
            sender_id: hotel.vendor_id,
            type: "canceled",
          });
          const updateBookingDetailsCanceled = await BookingModel.update(
            { status: "canceled" },
            { where: { booking_id: i.booking_id } }
          );
        }
      }
      const bookStatus = { status: "booked" };

      const updateBooking = await BookingModel.update(bookStatus, {
        where: { booking_id: bookingDetails.booking_id },
      });

      // const services = await Bookings_Additional_Services.findAll({
      //   where: { booking_id: booking_id },
      // });

      // const serviceId = services.map((id) => id.additional_services_id);

      // const additionalServices = await Hotel_Additional_Services.findAll({
      //   where: { additional_services_id: serviceId },
      // });

      // var checkInDateStr = bookingDetails.check_in_date;
      // var checkOutDateStr = bookingDetails.check_out_date;

      // // Creating moment objects from the original date strings
      // var checkInDate = moment(checkInDateStr);
      // var checkOutDate = moment(checkOutDateStr);

      // // Formatting the dates to '20 May 2021' format
      // var formattedCheckInDateStr = checkInDate.format("DD MMMM YYYY");
      // var formattedCheckOutDateStr = checkOutDate.format("DD MMMM YYYY");
      // var nights = checkOutDate.diff(checkInDate, "days") + 1;
      // var refundDeadlineDate = checkInDate.clone().subtract(1, "days");
      // var formattedRefundDeadlineDateStr =
      //   refundDeadlineDate.format("DD MMMM YYYY");
      // //!Total room price of stay

      // // Calculate the total price of the additional services
      // let additionalServicesPrice = 0;
      // for (const service of additionalServices) {
      //   additionalServicesPrice += service.price;
      // }

      // // Calculate the room price by subtracting the additional services price from the total price
      // const roomPrice = bookingDetails?.total_price - additionalServicesPrice;

      // const bookingDetailss = {
      //   booking_id: booking_id,
      //   room_id: bookingDetails.room_id,
      //   customer_name: user.user_name,
      //   customer_email: user.email,
      //   customer_phone: user.phone_number,
      //   check_in: formattedCheckInDateStr,
      //   check_out: formattedCheckOutDateStr,
      //   nights_days: nights,
      //   hotel_name: hotel.hotel_name,
      //   location: hotel.location,
      //   num_people: room.room_capacity,
      //   total_price: originalAmount,
      //   payment_method: "Khalti",
      //   roomPrice,
      //   refundDeadline: formattedRefundDeadlineDateStr,
      //   additional_services: additionalServices.map((hehe) => ({
      //     service_name: hehe.service_name,
      //     price: hehe.price,
      //   })),
      // };

      // const pdf = await generatePDF(bookingDetailss);

      // await pdfSender(user.email, "PDF generated", pdf);

      successHandler(
        res,
        201,
        null,
        "Room booked successfully! PDF of recepit sent to your email."
      );
    } catch (e) {
      next(e);
    }
  };

  //!This is the final payment where the khalti confiramtion will be done and then the details are stored on the database
  //! For khalti
  confirmPaymentEsewa = async (req, res, next) => {
    try {
      console.log(req.body);
      const details = req.body;
      const { booking_id, hotel_id } = req.params;

      const bookingDetails = await BookingModel.findOne({
        where: { booking_id: booking_id },
      });

      const hotel = await HotelModel.findOne({ where: { hotel_id: hotel_id } });

      //!The commission will be submitted to the admin
      const originalAmount = details.amount;
      const commission = (originalAmount * 10) / 100;
      const finalAmount = Math.round(originalAmount - commission);

      const transaction = await TransactionModel.create({
        transaction_id: details.token,
        amount: finalAmount,
        commission: commission,
        user_id: bookingDetails.user_id,
        vendor_id: hotel.vendor_id,
      });

      const payment = await PaymentModel.create({
        transaction_id: details.token,
        booking_id: bookingDetails.booking_id,
        method: "Esewa",
      });

      console.log(bookingDetails.user_id, "jehhehe");

      const user = await UserModel.findOne({
        where: {
          user_id: bookingDetails.user_id,
        },
      });

      console.log(user, "hahahah");

      const room = await RoomModel.findOne({ room_id: bookingDetails.room_id });

      //!updateStatus of the room
      const status = { is_available: false };
      const updateRoom = await RoomModel.update(status, {
        where: { room_id: bookingDetails.room_id },
      });

      if (updateRoom) {
        console.log("updated successfully");
      } else {
        console.log("not updated");
      }

      //!For sending the other users who have pending status as their booking status basically sending a notification to that user
      //! For notifying that the room has been booked by others and your booking has been canceled hai ta hehe!
      const checkPendingBookings = await BookingModel.findAll({
        where: {
          room_id: bookingDetails.room_id,
          check_in_date: { [Op.lte]: bookingDetails.check_in_date },
          check_out_date: { [Op.gte]: bookingDetails.check_out_date },
          status: "pending",
          booking_id: { [Op.not]: bookingDetails.booking_id },
        },
      });

      if (checkPendingBookings.length > 0) {
        console.log("phshshshsh");
        for (let i of checkPendingBookings) {
          const sendNotification = await NotificationModel.create({
            message:
              "Your booking has been canceled due to non-payment. Another person has booked the room for that specific date.",

            receiver_id: i.user_id,
            sender_id: hotel.vendor_id,
            type: "canceled",
          });
          const updateBookingDetailsCanceled = await BookingModel.update(
            { status: "canceled" },
            { where: { booking_id: i.booking_id } }
          );
        }
      }
      const bookStatus = { status: "booked" };

      const updateBooking = await BookingModel.update(bookStatus, {
        where: { booking_id: bookingDetails.booking_id },
      });

      // const services = await Bookings_Additional_Services.findAll({
      //   where: { booking_id: booking_id },
      // });

      // const serviceId = services.map((id) => id.additional_services_id);

      // const additionalServices = await Hotel_Additional_Services.findAll({
      //   where: { additional_services_id: serviceId },
      // });

      // var checkInDateStr = bookingDetails.check_in_date;
      // var checkOutDateStr = bookingDetails.check_out_date;

      // // Creating moment objects from the original date strings
      // var checkInDate = moment(checkInDateStr);
      // var checkOutDate = moment(checkOutDateStr);

      // // Formatting the dates to '20 May 2021' format
      // var formattedCheckInDateStr = checkInDate.format("DD MMMM YYYY");
      // var formattedCheckOutDateStr = checkOutDate.format("DD MMMM YYYY");
      // var nights = checkOutDate.diff(checkInDate, "days") + 1;
      // var refundDeadlineDate = checkInDate.clone().subtract(1, "days");
      // var formattedRefundDeadlineDateStr =
      //   refundDeadlineDate.format("DD MMMM YYYY");
      // //!Total room price of stay

      // // Calculate the total price of the additional services
      // let additionalServicesPrice = 0;
      // for (const service of additionalServices) {
      //   additionalServicesPrice += service.price;
      // }

      // // Calculate the room price by subtracting the additional services price from the total price
      // const roomPrice = bookingDetails?.total_price - additionalServicesPrice;
      // const bookingDetailss = {
      //   booking_id: booking_id,
      //   room_id: bookingDetails.room_id,
      //   customer_name: user.user_name,
      //   customer_email: user.email,
      //   customer_phone: user.phone_number,
      //   check_in: formattedCheckInDateStr,
      //   check_out: formattedCheckOutDateStr,
      //   nights_days: nights,
      //   hotel_name: hotel.hotel_name,
      //   location: hotel.location,
      //   num_people: room.room_capacity,
      //   total_price: originalAmount,
      //   roomPrice,
      //   payment_method: "Esewa",
      //   refundDeadline: formattedRefundDeadlineDateStr,
      //   additional_services: additionalServices.map((hehe) => ({
      //     service_name: hehe.service_name,
      //     price: hehe.price,
      //   })),
      // };

      // const pdf = await generatePDF(bookingDetailss);

      // await pdfSender(user.email, "PDF generated", pdf);

      successHandler(
        res,
        201,
        null,
        "Room booked successfully! PDF of recepit sent to your email."
      );
    } catch (e) {
      next(e);
    }
  };

  checkListYourProperty = async (req, res, next) => {
    try {
      const user_id = req.params.user_id;

      const user = await UserModel.findOne({ user_id: user_id });

      if (!user) {
        throw { status: 404, message: "No user found!" };
      }

      //!So how this works is to show the if the user has registered or not for the hotel at first i need to check if the user has already
      //!Applied for the hotel and whether it has been rejected or on pending then according to it if the user is on pending i will
      //! show the steps has been cleared but your in pending stage so you cant register another hotel till then
      //Here if the registered user is found with pending stage then it will return you need to wait for the admin's response and return the details
      const checkHotel = await HotelModel.findOne({
        where: { vendor_id: user_id, hotel_verified: false },
      });

      if (checkHotel) {
        const hotel_Pictures = await HotelPicturesModel.findAll({
          where: { hotel_id: checkHotel.hotel_id },
        });

        const hotelDetails = {
          hotel_id: checkHotel.hotel_id,
          user: {
            vendor_id: user.user_id,
            vendor_name: user.user_name,
            vendor_image: user.profile_picture,
          },
          hotel_name: checkHotel.hotel_name,
          location: checkHotel.location,
          description: checkHotel.description,
          main_picture: checkHotel.main_picture,
          phone_number: checkHotel.phone_number,
          ratings: checkHotel.ratings,
          email: checkHotel.email,
          hotel_verified: checkHotel.hotel_verified,
          other_pictures: hotel_Pictures.map((pic) => ({
            hotel_picture_id: pic.hotel_picture_id,
            hotel_picture: pic.hotel_picture,
          })),
          hotel_amenities: checkHotel.hotel_amenities,
        };
        return successHandler(
          res,
          200,
          hotelDetails,
          "The details of your hotel that is still on pending, Wait for admin to verify it"
        );
      }

      successHandler(res, 200, null, "The user can register");
    } catch (e) {
      next(e);
    }
  };

  usersBookingHistory = async (req, res, next) => {
    try {
      const user_id = req.params.user_id;
      const user = await UserModel.findOne({ where: { user_id: user_id } });

      if (!user) {
        throw { status: 404, message: "No user found" };
      }

      const booking = await BookingModel.findAll({
        where: { user_id: user_id },
      });

      const bookingDetails = await Promise.all(
        booking.map(async (book) => {
          // const payment = await PaymentModel.findOne({
          //   where: { booking_id: book.booking_id },
          // });
          const room = await RoomModel.findOne({
            where: { room_id: book.room_id },
          });
          const hotel = await HotelModel.findOne({
            where: { hotel_id: room.hotel_id },
          });

          const room_pictures = await RoomPicturesModel.findAll({
            where: { room_id: room.room_id },
          });

          return {
            user: {
              user_id: user.user_id,
              user_name: user.user_name,
            },
            booking: {
              booking_id: book.booking_id,
              booking_status: book.status,
              check_in_date: book.check_in_date,
              check_out_date: book.check_out_date,
              total_price: book.total_price,
            },
            room: {
              room_id: room.room_id,
              room_amenities: room.amenities.map((hehe) => hehe),
              room_capacity: room.room_capacity,
              room_picture: room_pictures.map((pic) => {
                return {
                  room_picture_id: pic.room_picture_id,
                  picture: pic.room_picture,
                };
              }),
            },
            hotel: {
              hotel_id: hotel.hotel_id,
              hotel_name: hotel.hotel_name,
              hotel_picture: hotel.main_picture,
              hotel_location: hotel.location,
            },
          };
        })
      );

      successHandler(res, 200, bookingDetails, "Heheh");
    } catch (e) {
      next(e);
    }
  };

  usersSpecificBookingDetails = async (req, res, next) => {
    try {
      const { user_id, booking_id } = req.params;

      const user = await UserModel.findOne({ where: { user_id: user_id } });

      if (!user) {
        throw { status: 404, message: "No user found!" };
      }

      const booking = await BookingModel.findOne({
        where: { booking_id: booking_id, user_id: user_id },
      });

      if (!booking) {
        throw { status: 404, message: "No booking's found!" };
      }

      const room = await RoomModel.findOne({
        where: { room_id: booking.room_id },
      });
      const hotel = await HotelModel.findOne({
        where: { hotel_id: room.hotel_id },
      });
      const room_pictures = await RoomPicturesModel.findAll({
        where: { room_id: room.room_id },
      });

      const bookingDetails = {
        user: {
          user_id: user.user_id,
          user_name: user.user_name,
        },
        booking: {
          booking_id: booking.booking_id,
          booking_status: booking.status,
          check_in_date: booking.check_in_date,
          check_out_date: booking.check_out_date,
          total_price: booking.total_price,
        },
        room: {
          room_id: room.room_id,
          room_capacity: room.room_capacity,
          room_amenities: room.amenities.map((hehe) => hehe),
          room_picture: room_pictures.map((pic) => {
            return {
              room_picture_id: pic.room_picture_id,
              picture: pic.room_picture,
            };
          }),
        },
        hotel: {
          hotel_id: hotel.hotel_id,
          hotel_name: hotel.hotel_name,
          hotel_picture: hotel.main_picture,
          hotel_location: hotel.location,
        },
      };

      successHandler(res, 200, bookingDetails, "Required booking details!");
    } catch (e) {
      next(e);
    }
  };

  refundMain = async (req, res, next) => {
    try {
      const { booking_id } = req.params;

      const booking = await BookingModel.findOne({
        where: { booking_id: booking_id },
      });
      if (!booking) {
        throw { status: 404, message: "Booking not found." };
      }

      const currentDate = new Date();
      const checkInDate = new Date(booking.check_in_date);
      const refundDeadline = new Date(checkInDate);
      refundDeadline.setDate(refundDeadline.getDate() - 1); // Refund allowed until one day before check-in date

      if (currentDate >= refundDeadline) {
        throw {
          status: 400,
          message:
            "Refund not allowed. Deadline exceeded. If it's an emergency you can contact us or visit us.",
        };
      }

      const payment = await PaymentModel.findOne({
        where: { booking_id: booking_id },
      });
      if (!payment) {
        throw { status: 404, message: "Payment not found." };
      }

      const transaction = await TransactionModel.findOne({
        where: { transaction_id: payment.transaction_id },
      });
      if (!transaction) {
        throw { status: 404, message: "Transaction not found." };
      }

      const room = await RoomModel.findOne({
        where: { room_id: booking.room_id },
      });
      if (!room) {
        throw { status: 404, message: "Room not found." };
      }

      // Refund payment
      const paymentRefund = await PaymentModel.update(
        { status: "refund" },
        { where: { payment_id: payment.payment_id } }
      );

      // Mark room as available
      const roomRefund = await RoomModel.update(
        { is_available: true },
        { where: { room_id: booking.room_id } }
      );

      // Calculate refund amount
      const originalAmount = (parseInt(transaction.amount) * 10) / 100;
      const amount = Math.round(parseInt(transaction.amount) - originalAmount);

      // Update transaction with refund status and amount
      const transactionRefund = await TransactionModel.update(
        { status: "refund", amount: amount },
        { where: { transaction_id: transaction.transaction_id } }
      );

      // Update booking status
      const updateBooking = await BookingModel.update(
        { status: "refund", total_price: amount },
        { where: { booking_id: booking_id } }
      );

      successHandler(res, 201, null, "Booking refunded successfully.");
    } catch (e) {
      next(e);
    }
  };

  checkHotel = async (req, res, next) => {
    try {
      const { hotel_id } = req.params;

      const hotel = await HotelModel.findOne({
        where: { hotel_id: hotel_id },
      });

      if (!hotel) {
        throw { status: 404, message: "No hotel found." };
      }

      successHandler(res, 200, null, "pass");
    } catch (e) {
      next(e);
    }
  };

  deleteReviewUser = async (req, res, next) => {
    try {
      const { user_id, review_id } = req.params;
      const user = await UserModel.findOne({ where: { user_id: user_id } });

      if (!user) {
        throw { status: 404, message: "User not found." };
      }

      const review = await HotelReviewModel.findOne({
        where: { hotel_review_id: review_id },
      });
      if (!review) {
        throw { status: 404, message: "Review not found." };
      }

      const deleteReview = await HotelReviewModel.destroy({
        where: { hotel_review_id: review_id },
      });
      if (!deleteReview) {
        throw { status: 404, message: "Failed to delete review." };
      }

      successHandler(res, 201, null, "Review successfully deleted.");
    } catch (e) {
      next(e);
    }
  };

  removeBookMarkByUser = async (req, res, next) => {
    try {
      const { user_id, bookmark_id } = req.params;
      const user = await UserModel.findOne({ where: { user_id: user_id } });

      if (!user) {
        throw { status: 404, message: "No user found!" };
      }

      const bookmark = await BookMarkModel.findOne({
        where: { bookmark_id: bookmark_id },
      });
      if (!bookmark) {
        throw { status: 404, message: "No bookmark found." };
      }

      const deleteBookmark = await BookMarkModel.destroy({
        where: { bookmark_id: bookmark_id },
      });

      if (!deleteBookmark) {
        throw { status: 404, message: "No bookmark deleted." };
      }

      successHandler(res, 201, null, "Bookmark successfully removed.");
    } catch (e) {
      next(e);
    }
  };

  getAllAdditionalServices = async (req, res, next) => {
    try {
      const { hotel_id } = req.params;

      const checkHotel = await HotelModel.findOne({
        where: { hotel_id: hotel_id },
      });

      if (!checkHotel) {
        throw { status: 404, message: "No hotel's found!" };
      }

      const services = await Hotel_Additional_Services.findAll({
        where: { hotel_id: hotel_id },
      });

      successHandler(
        res,
        200,
        services,
        "The additional services of the hotels!"
      );
    } catch (e) {
      next(e);
    }
  };

  getSpecificBookingDetails = async (req, res, next) => {
    try {
      const { booking_id } = req.params;

      const booking = await BookingModel.findOne({
        where: { booking_id: booking_id },
      });

      if (!booking) {
        throw { status: 404, message: "No booking detail's found" };
      }

      const user = await UserModel.findOne({
        where: { user_id: booking.user_id },
      });

      if (!user) {
        throw { status: 404, message: "No User found" };
      }

      const room = await RoomModel.findOne({
        where: { room_id: booking.room_id },
      });

      if (!room) {
        throw { status: 404, message: "No Rooms found" };
      }

      const roomType = await RoomTypesModel.findOne({
        where: { room_type_id: room.room_type_id },
      });

      const hotel = await HotelModel.findOne({
        where: { hotel_id: room.hotel_id },
      });
      if (!hotel) {
        throw { status: 404, message: "No Hotels found" };
      }

      const roomPictures = await RoomPicturesModel.findAll({
        where: { room_id: room.room_id },
      });

      const additionalBookings = await Bookings_Additional_Services.findAll({
        where: { booking_id: booking_id },
      });
      const servicesIds = additionalBookings.map(
        (id) => id.additional_services_id
      );

      const services = await Hotel_Additional_Services.findAll({
        where: { additional_services_id: servicesIds },
      });

      const allServies = await Hotel_Additional_Services.findAll({
        where: { hotel_id: hotel.hotel_id },
      });

      const bookingDetails = {
        booking_id: booking.booking_id,
        status: booking.status,
        total_price: booking.total_price,
        createdAt: booking.createdAt,
        check_in_date: booking.check_in_date,
        check_out_date: booking.check_out_date,
        user: {
          user_id: user.user_id,
          user_name: user.user_name,
          profile_picture: user.profile_picture,
        },
        hotel: {
          hotel_id: hotel.hotel_id,
          hotel_name: hotel.hotel_name,
          location: hotel.location,
        },
        room: {
          room_id: room.room_id,
          room_type: roomType.type_name,
          room_capacity: room.room_capacity,
          room_picture: roomPictures[0].room_picture,
          price: room.price_per_night,
        },
        additionalServices: services.map((service) => ({
          additional_services_id: service.additional_services_id,
          service_name: service.service_name,
          price: service.price,
        })),
        allServies,
      };

      successHandler(res, 200, bookingDetails, "Booking details");
    } catch (e) {
      next(e);
    }
  };

  getAllGalleryPictures = async (req, res, next) => {
    try {
      const { hotel_id } = req.params;

      const checkHotel = await HotelModel.findOne({
        where: { hotel_id: hotel_id },
      });

      if (!checkHotel) {
        throw { status: 404, message: "No hotel's found!" };
      }

      const pictures = await HotelPicturesModel.findAll({
        where: { hotel_id: hotel_id },
      });

      const hotelPictures = {
        pictures: pictures.map((image) => ({
          room_picture: image.hotel_picture,
        })),
      };

      successHandler(res, 200, hotelPictures, "Pictures for gallery!");
    } catch (e) {
      next(e);
    }
  };

  cancelBookingsPending = async (req, res, next) => {
    try {
      const { booking_id } = req.params;
      const booking = await BookingModel.findOne({
        where: { booking_id: booking_id },
      });
      if (!booking) {
        throw { status: 404, message: "Booking not found." };
      }
      const updateBookingDetails = await BookingModel.update(
        { status: "canceled" },
        { where: { booking_id: booking_id } }
      );

      if (!updateBookingDetails) {
        throw { status: 500, message: "Failed to cancel the booking." };
      }

      successHandler(res, 201, null, "Booking canceled successfully.");
    } catch (e) {
      next(e);
    }
  };

  sendMailListProperty = async (req, res, next) => {
    try {
      const { email, message } = req.body;

      if (!email || !message) {
        throw { status: 401, message: "Fill up the form!" };
      }

      const receiver_email = process.env.MY_EMAIL;
      const subject = "Query from the list your property";

      await customMailSender(email, receiver_email, subject, message);

      successHandler(res, 201, null, "Your message has been sent! Thankyou!");
    } catch (e) {
      next(e);
    }
  };

  getAllFAQHotel = async (req, res, next) => {
    try {
      const { hotel_id } = req.params;

      const hotel = await HotelModel.findOne({ where: { hotel_id: hotel_id } });

      if (!hotel) {
        throw { status: 404, message: "No hotel's found!" };
      }

      const FaqDetails = await FAQModel.findAll({
        where: { hotel_id: hotel_id },
      });

      successHandler(
        res,
        200,
        FaqDetails,
        "These are the avaiable FAQ details!"
      );
    } catch (e) {
      next(e);
    }
  };

  getAllAdditionalServices = async (req, res, next) => {
    try {
      const additionalServices = await Hotel_Additional_Services.findAll();

      successHandler(
        res,
        200,
        additionalServices,
        "These are the additional services"
      );
    } catch (e) {
      next(e);
    }
  };

  deleteBlogsUserProfile = async (req, res, next) => {
    try {
      const { user_id, blog_id } = req.params;

      const checkUser = await UserModel.findOne({
        where: { user_id: user_id },
      });
      if (!checkUser) {
        throw { status: 404, message: "User not found." };
      }

      const blog = await BlogModel.findOne({
        where: { author_id: user_id, blog_id: blog_id },
      });

      if (!blog) {
        throw { status: 404, message: "Blog not found." };
      }

      await blog.destroy();

      return successHandler(res, 201, null, "Blog deleted successfully.");
    } catch (e) {
      next(e);
    }
  };
}

module.exports.userController = new UserControllers();
module.exports.userHotelController = new UserHotelController();
