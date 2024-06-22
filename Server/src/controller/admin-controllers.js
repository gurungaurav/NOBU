const { Op, Sequelize, where } = require("sequelize");
const NotificationModel = require("../model/client/notifications");
const UserModel = require("../model/client/user");
const AmenitiesModel = require("../model/hotel/amenities");
const BedTypesModel = require("../model/hotel/bed_types");
const HotelModel = require("../model/hotel/hotel");
const HotelPicturesModel = require("../model/hotel/hotel_pictures");
const RoomModel = require("../model/hotel/room");
const RoomTypesModel = require("../model/hotel/room_types");
const successHandler = require("../utils/handler/successHandler");
const BlogModel = require("../model/blogs/blog");
const BlogTagsModel = require("../model/blogs/blog_tags");
const TransactionModel = require("../model/client/transactions");
const PaymentModel = require("../model/client/payment");
const BookingModel = require("../model/client/bookings");
const { sendMail } = require("../utils/mail/mailSender");

class AdminController {
  //? http://localhost:1000/api/nobu/admin/allVerificationVendors
  getAllVendorsVerify = async (req, res, next) => {
    try {
      const hotels = await HotelModel.findAll({
        where: { hotel_verified: false },
      });

      // const {vendors} = req.vendors

      // const allAmenities = hotels.map(async(amenities)=>{
      //   const amen = await HotelAmenitiesModel.findAll({where:{hotel_id: amenities.hotel_id}})
      //   return amen
      // })

      // const promAmenities= await Promise.all(allAmenities)
      // console.log(promAmenities);

      const hotelDetails = await Promise.all(
        hotels.map(async (hotel) => {
          // const amenities = await AmenitiesModel.findAll({
          //   where: { amenities_id: hotel.hotel_amenities },
          // });
          const hotel_Pictures = await HotelPicturesModel.findAll({
            where: { hotel_id: hotel.hotel_id },
          });
          const vendor = await UserModel.findOne({
            where: { user_id: hotel.vendor_id },
          });

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
            other_pictures: hotel_Pictures.map((pic) => ({
              hotel_picture_id: pic.hotel_picture_id,
              hotel_picture: pic.hotel_picture,
            })),
            hotel_amenities: hotel.hotel_amenities,
            createdAt: hotel.createdAt,
          };
        })
      );

      successHandler(
        res,
        200,
        hotelDetails,
        "These are the available vendors to be verified."
      );
    } catch (e) {
      next(e);
    }
  };

  //? http://localhost:1000/api/nobu/admin/verifyHotel/:hotel_id
  verifyVendor = async (req, res, next) => {
    try {
      const { hotel, vendor } = req.hotel;

      const { admin_id } = req.params;

      const verified = { hotel_verified: true };
      const verifiedHotel = await HotelModel.update(verified, {
        where: { hotel_id: hotel.hotel_id },
      });

      if (!verifiedHotel) {
        throw {
          status: 400,
          message: "Failed to verify the hotel. Please try again later.",
        };
      }

      let vendorVerified = { roles: "vendor" };
      const vendori = await UserModel.update(vendorVerified, {
        where: { user_id: vendor.user_id },
      });

      if (!vendori) {
        throw {
          status: 500,
          message: "Failed to update user's role. Please try again later.",
        };
      }

      const notification = await NotificationModel.create({
        sender_id: admin_id,
        receiver_id: vendor.user_id,
        type: "hotel_accepted",
        message:
          "Your hotel has been successfully verified! We have listed your hotel on our website. You can now add required rooms and welcome your guests.",
      });

      if (!notification) {
        throw {
          status: 500,
          message: "Failed to send notification. Please try again later.",
        };
      }

      successHandler(res, 201, verifiedHotel, "Hotel successfully verified.");
    } catch (e) {
      next(e);
    }
  };

  //? http://localhost:1000/api/nobu/admin/rejectVendor/:hotel_id/:admin_id
  rejectVendor = async (req, res, next) => {
    try {
      const { hotel, vendor } = req.hotel;

      const { rejectReason } = req.body;
      console.log(req.body);
      const { admin_id } = req.params;

      const verifiedHotel = await HotelModel.destroy({
        where: { hotel_id: hotel.hotel_id },
      });

      if (!verifiedHotel) {
        throw {
          status: 400,
          message: "Something went wrong on deletion of the hotel!",
        };
      }

      const notification = await NotificationModel.create({
        sender_id: admin_id,
        receiver_id: vendor.user_id,
        type: "hotel_rejected",
        message: rejectReason,
      });

      successHandler(res, 201, verifiedHotel, "Hotel rejected.");
    } catch (e) {
      next(e);
    }
  };

  addAmenities = async (req, res, next) => {
    try {
      const { amenities } = req.amenities;

      const amenitiesCheck = amenities.map(async (amenities) => {
        const amenitiess = await AmenitiesModel.create({
          amenity_name: amenities.amenity_name,
        });

        return amenitiess;
      });

      const allAmenitiess = await Promise.all(amenitiesCheck);

      if (!allAmenitiess) {
        throw {
          status: 500,
          message: "Failed to create room amenities. Please try again later.",
        };
      }

      successHandler(
        res,
        201,
        allAmenitiess,
        "New amenity added successfully."
      );
    } catch (e) {
      next(e);
    }
  };

  addSingleAmenities = async (req, res, next) => {
    try {
      const { amenity } = req.body;

      const findAmen = await AmenitiesModel.findOne({
        where: { amenity_name: amenity },
      });

      if (findAmen) {
        throw { status: 401, message: "Amenity already exists." };
      }

      const amenities = await AmenitiesModel.create({
        amenity_name: amenity,
      });

      if (!amenities) {
        throw {
          status: 500,
          message: "Failed to add the new amenity. Please try again later.",
        };
      }

      successHandler(res, 201, amenities, "New amenity added successfully.");
    } catch (e) {
      next(e);
    }
  };
  addRoomTypes = async (req, res, next) => {
    try {
      const { room_Type } = req.roomType;

      const type = await RoomTypesModel.create({
        type_name: room_Type,
      });

      if (!type) {
        throw {
          status: 500,
          message: "Failed to add the new room type. Please try again later.",
        };
      }

      successHandler(res, 201, type, "New room type added successfully.");
    } catch (e) {
      next(e);
    }
  };

  addBedTypes = async (req, res, next) => {
    try {
      const { bed_type, capacity } = req.bed;

      const type = await BedTypesModel.create({
        type_name: bed_type,
        capacity: capacity,
      });

      if (!type) {
        throw {
          status: 500,
          message: "Failed to add the new bed type. Please try again later.",
        };
      }

      successHandler(res, 201, type, "New Bed type added successfully.");
    } catch (e) {
      next(e);
    }
  };

  bookRoom = async (req, res, next) => {
    try {
      const { user_id, room_id, hotel_id } = req.params;

      const user = await UserModel.findOne({ where: { user_id: user_id } });

      if (!user) {
        throw { status: 404, message: "User not found." };
      }
      const rooms = await RoomModel.findOne({
        where: { room_id: room_id, hotel_id: hotel_id },
      });

      if (!rooms) {
        throw { status: 404, message: "User room found." };
      }
      const hotel = await HotelModel.findOne({ where: { hotel_id: hotel_id } });

      if (!hotel) {
        throw { status: 404, message: "User hotel found." };
      }
    } catch (e) {
      next(e);
    }
  };

  getSpecificHotelVerify = async (req, res, next) => {
    try {
      const { hotel_id } = req.params;
      const hotel = await HotelModel.findOne({
        where: { hotel_id: hotel_id, hotel_verified: false },
      });

      if (!hotel) {
        throw { status: 404, message: "No hotel found." };
      }

      const pictures = await HotelPicturesModel.findAll({
        where: { hotel_id: hotel.hotel_id },
      });

      const user = await UserModel.findOne({
        where: { user_id: hotel.vendor_id },
      });

      const hotelDetails = {
        hotel_id: hotel.hotel_id,
        hotel_name: hotel.hotel_name,
        email: hotel.email,
        location: hotel.location,
        description: hotel.description,
        main_picture: hotel.main_picture,
        phone_number: hotel.phone_number,
        ratings: hotel.ratings,
        hotel_amenities: hotel.hotel_amenities,
        hotel_verified: hotel.hotel_verified,
        createdAt: hotel.createdAt,
        pictures: pictures.map((pic) => ({
          pictures_id: pic.hotel_picture_id,
          room_picture: pic.hotel_picture,
        })),
        vendor: {
          vendor_id: user.user_id,
          user_name: user.user_name,
          email: user.email,
          profile_picture: user.profile_picture,
        },
      };

      // const hotelDetails = {
      //   hotel,
      //   user,
      // };

      successHandler(res, 200, hotelDetails, "Requried to verify hotel.");
    } catch (e) {
      next(e);
    }
  };

  getSpecificHotelVerified = async (req, res, next) => {
    try {
      const { hotel_id } = req.params;
      const hotel = await HotelModel.findOne({
        where: { hotel_id: hotel_id, hotel_verified: true },
      });

      if (!hotel) {
        throw { status: 404, message: "No hotel found." };
      }

      const pictures = await HotelPicturesModel.findAll({
        where: { hotel_id: hotel.hotel_id },
      });

      const user = await UserModel.findOne({
        where: { user_id: hotel.vendor_id },
      });

      const hotelDetails = {
        hotel_id: hotel.hotel_id,
        hotel_name: hotel.hotel_name,
        email: hotel.email,
        location: hotel.location,
        description: hotel.description,
        main_picture: hotel.main_picture,
        phone_number: hotel.phone_number,
        ratings: hotel.ratings,
        hotel_amenities: hotel.hotel_amenities,
        hotel_verified: hotel.hotel_verified,
        createdAt: hotel.createdAt,
        pictures: pictures.map((pic) => ({
          pictures_id: pic.hotel_picture_id,
          room_picture: pic.hotel_picture,
        })),
        vendor: {
          vendor_id: user.user_id,
          user_name: user.user_name,
          email: user.email,
          profile_picture: user.profile_picture,
        },
      };

      // const hotelDetails = {
      //   hotel,
      //   user,
      // };

      successHandler(res, 200, hotelDetails, "Requried verified hotel");
    } catch (e) {
      next(e);
    }
  };

  getAllHotels = async (req, res, next) => {
    try {
      const hotels = await HotelModel.findAll({
        where: { hotel_verified: true },
      });

      successHandler(res, 200, hotels, "These are verified hotels!");
    } catch (e) {
      next(e);
    }
  };

  getAllAmenitiesLists = async (req, res, next) => {
    try {
      const amenities = await AmenitiesModel.findAll();

      successHandler(res, 200, amenities, "These are the available amenities.");
    } catch (e) {
      next(e);
    }
  };

  updateSpecificAmenities = async (req, res, next) => {
    try {
      const amenity_id = req.params.amenity_id;
      const { amenity_name } = req.body;
      const amenity = await AmenitiesModel.findOne({
        where: { amenities_id: amenity_id },
      });

      if (!amenity) {
        throw { status: 404, message: "No amenities found." };
      }

      const updateAmenities = await AmenitiesModel.update(
        { amenity_name: amenity_name },
        { where: { amenities_id: amenity_id } }
      );

      successHandler(res, 201, null, "Required amenity updated successfully.");
    } catch (e) {
      next(e);
    }
  };

  updateSepcificHotelVerification = async (req, res, next) => {
    try {
      const { hotel_id } = req.params;
      const { status } = req.body;

      let verified;

      console.log(status);
      if (status === "Verified") {
        verified = true;
      } else {
        verified = false;
      }
      const hotel = await HotelModel.findOne({ where: { hotel_id: hotel_id } });

      if (!hotel) {
        throw { status: 404, message: "No hotel found." };
      }

      const updateHotelStatus = await HotelModel.update(
        { hotel_verified: verified },
        { where: { hotel_id: hotel.hotel_id } }
      );

      if (!updateHotelStatus) {
        throw { status: 500, message: "Failed to update verification status." };
      }
      const admin = await UserModel.findOne({ where: { roles: "admin" } });

      const notification = await NotificationModel.create({
        type: "notVerified",
        message:
          "The hotel has been marked as unverified due to suspicious activities.",
        sender_id: admin.user_id,
        receiver_id: hotel.vendor_id,
      });

      successHandler(
        res,
        201,
        null,
        "Verification status updated successfully. The hotel has been marked as unverified due to suspicious activities."
      );
    } catch (e) {
      next(e);
    }
  };

  getAllBedTypes = async (req, res, next) => {
    try {
      const beds = await BedTypesModel.findAll();

      successHandler(res, 200, beds, "These are the available Bed Types");
    } catch (e) {
      next(e);
    }
  };

  updateSpecificBedType = async (req, res, next) => {
    try {
      const { bed_type_id } = req.params;
      const { bed_type_name, count } = req.body;

      console.log(req.body, "aaa");
      console.log(req.params, "jsjdsjd");
      const bed = await BedTypesModel.findOne({
        where: { bed_types_id: bed_type_id },
      });

      if (!bed) {
        throw { status: 404, message: "No bed found." };
      }

      let type_name = bed_type_name ? bed_type_name : bed.type_name;
      let capacity = count ? parseInt(count) : bed.capacity;

      const updateBed = await BedTypesModel.update(
        { type_name: type_name, capacity: capacity },
        { where: { bed_types_id: bed_type_id } }
      );

      if (!updateBed) {
        throw { status: 500, message: "Failed to update bed type." };
      }

      successHandler(res, 201, null, "Bed updated successfully.");
    } catch (e) {
      next(e);
    }
  };

  amenityDelete = async (req, res, next) => {
    try {
      const { amenity_id } = req.params;

      const checkAmenity = await AmenitiesModel.findOne({
        where: { amenities_id: amenity_id },
      });

      if (!checkAmenity) {
        throw { status: 404, message: "No amenity found." };
      }

      const hotelsWithDesiredAmenities = await HotelModel.destroy({
        where: {
          hotel_amenities: {
            [Op.contains]: [checkAmenity.amenity_name],
          },
        },
      });

      if (!hotelsWithDesiredAmenities) {
        throw {
          status: 500,
          message:
            "Failed to delete amenity from hotels. It may have already been deleted.",
        };
      }

      const roomAmenities = await RoomModel.destroy({
        where: {
          amenities: {
            [Op.contains]: [checkAmenity.amenity_name],
          },
        },
      });

      if (!roomAmenities) {
        throw {
          status: 500,
          message:
            "Failed to delete amenity from rooms. It may have already been deleted.",
        };
      }

      const deleteAmenities = await AmenitiesModel.destroy({
        where: { amenities_id: amenity_id },
      });

      if (!deleteAmenities) {
        throw {
          status: 500,
          message:
            "Failed to delete amenity. It may have already been deleted.",
        };
      }

      successHandler(res, 201, null, "Required amenity deleted successfully.");
    } catch (e) {
      next(e);
    }
  };

  getAllUsers = async (req, res, next) => {
    try {
      const { searchName } = req.query;
      console.log(req.query);
      const page = req.query.page || 1;
      const limit = 8;
      const offset = (page - 1) * limit;

      //This will lead to not to select admin roled user
      let queryParams = {
        limit,
        offset,
        where: { [Op.not]: { roles: "admin" } },
      };

      //!Using ilike operator for finding both case sensitive letters like if G is searched when the data is g it should show the data
      if (searchName !== undefined) {
        queryParams.where = {
          ...queryParams.where,
          user_name: { [Sequelize.Op.iLike]: `%${searchName}%` },
        };
      }

      const users = await UserModel.findAll(queryParams);

      const usersCounts = await UserModel.count({
        where: { [Op.not]: { roles: "admin" } },
      });

      const userDetails = {
        limit,
        page,
        total: usersCounts,
        users,
      };

      successHandler(
        res,
        200,
        userDetails,
        "These are all the avaiable users."
      );
    } catch (e) {
      next(e);
    }
  };

  adminGetAllBlogs = async (req, res, next) => {
    try {
      let page = req.query.page || 1;
      const limit = 6;

      console.log(page, "jajaj");
      const offset = (page - 1) * limit;

      const pagination = {
        offset,
        limit,
      };
      const blogs = await BlogModel.findAll(pagination);

      const blogDetails = await Promise.all(
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
            createdAt: blog.createdAt,
            blogTag: {
              tag_id: blogTags.tag_id,
              tag_name: blogTags.tag_name,
            },
            author: {
              user_id: user.user_id,
              user_name: user.user_name,
              profile: user.profile_picture,
            },
          };
        })
      );

      const totalBlogs = await BlogModel.count();
      const blog = {
        total: totalBlogs,
        limit,
        blogDetails,
      };

      successHandler(res, 200, blog, "These are all available blogs.");
    } catch (e) {
      next(e);
    }
  };

  deleteBlogsAdmin = async (req, res, next) => {
    try {
      const { blog_id, admin_id } = req.params;
      const { message, user_id } = req.body;
      console.log(req.body);
      const blog = await BlogModel.findOne({ where: { blog_id: blog_id } });

      if (!blog) {
        throw { status: 404, message: "No blogs found." };
      }
      let addMessage = `Your blog titled ${blog.title} was deleted due to, ${message}`;
      // const notification = await NotificationModel.create({
      //   message: addMessage,
      //   type: "message",
      //   sender_id: admin_id,
      //   receiver_id: user_id,
      // });

      const deleteBlogs = await BlogModel.destroy({
        where: { blog_id: blog.blog_id },
      });

      successHandler(res, 201, null, "Successfully deleted the blog.");
    } catch (e) {
      next(e);
    }
  };

  deleteUserByAdmin = async (req, res, next) => {
    try {
      const user_id = req.params.user_id;
      const { message } = req.body;

      const user = await UserModel.findOne({ where: { user_id: user_id } });

      if (!user) {
        throw {
          status: 404,
          message:
            "User not found! Please make sure you entered the correct user ID.",
        };
      }

      await sendMail(user.email, "Account Deletion Notification.", message);

      const deleteUser = await UserModel.destroy({
        where: { user_id: user.user_id },
      });

      if (!deleteUser) {
        throw {
          status: 500,
          message:
            "Failed to delete user account! Please try again later or contact support for assistance.",
        };
      }

      successHandler(
        res,
        201,
        null,
        "User account has been successfully deleted."
      );
    } catch (e) {
      next(e);
    }
  };

  getAllPaymentDetails = async (req, res, next) => {
    try {
      const admin_id = req.params.admin_id;
      const type = req.query.type;
      const selectedHotel = req.query.selectedHotel;

      console.log(req.query);
      const admin = await UserModel.findOne({ where: { user_id: admin_id } });

      if (!admin) {
        throw { status: 404, message: "No admin found." };
      }

      const pageNumber = req.query.page || 1;
      const limit = 8;

      const offset = (pageNumber - 1) * limit;
      const queryParams = {
        offset,
        limit,
        where: {},
        order: [],
      };

      if (type === "Newest") {
        queryParams.order = [["createdAt", "DESC"]];
      }

      if (type === "Oldest") {
        queryParams.order = [["createdAt", "ASC"]];
      }

      if (selectedHotel !== "All") {
        const findHotel = await HotelModel.findOne({
          where: { hotel_name: selectedHotel },
        });
        queryParams.where = {
          ...queryParams.where,
          vendor_id: findHotel.vendor_id,
        };
      }

      const transactionDetails = await TransactionModel.findAll(queryParams);

      const paymentDetails = await Promise.all(
        transactionDetails.map(async (transaction) => {
          const payment = await PaymentModel.findOne({
            where: { transaction_id: transaction.transaction_id },
          });
          const user = await UserModel.findOne({
            where: { user_id: transaction.user_id },
          });
          const hotel = await HotelModel.findOne({
            where: { vendor_id: transaction.vendor_id },
          });

          return {
            payment_id: payment.payment_id,
            amount: transaction.amount,
            comissionAmount: transaction.commission,
            createdAt: payment.createdAt,
            status: payment.status,
            hotel: {
              hotel_id: hotel.hotel_id,
              hotel_name: hotel.hotel_name,
              picture: hotel.main_picture,
              email: hotel.email,
              vendor: {
                vendor_id: user.user_id,
                vendor_name: user.user_name,
                profile: user.profile_picture,
              },
            },
          };
        })
      );
      const totalTransactions = await TransactionModel.count();
      const totalComission = await TransactionModel.findAll();
      const totalComissionAmount = totalComission.reduce(
        (total, transaction) => total + transaction.commission,
        0
      );

      const details = {
        pageNumber,
        limit,
        totalComissionAmount,
        total: totalTransactions,
        paymentDetails,
      };

      successHandler(res, 200, details, "All payment details.");
    } catch (e) {
      next(e);
    }
  };

  adminDashboardDetails = async (req, res, next) => {
    try {
      const admin_id = req.params.admin_id;

      const admin = await UserModel.findOne({ where: { user_id: admin_id } });

      if (!admin) {
        throw { status: 404, message: "No admin found." };
      }

      const totalVendors = await HotelModel.count();
      const totalVerifiedVendors = await HotelModel.count({
        where: { hotel_verified: true },
      });
      const totalUnVerifiedVendors = await HotelModel.count({
        where: { hotel_verified: false },
      });

      const totalTransactions = await TransactionModel.findAll();
      const totalComission = totalTransactions.reduce(
        (accumulator, currentTransaction) =>
          accumulator + currentTransaction.commission,
        0
      );

      const totalBookings = await BookingModel.count();

      const currentMonth = new Date().getMonth() + 1; // Get the current month (1-12)
      const currentYear = new Date().getFullYear(); // Get the current year
      const daysInMonth = new Date(currentYear, currentMonth, 0).getDate(); // Get the number of days in the current month
      const weeksInMonth = Math.ceil(daysInMonth / 7); // Calculate the number of weeks in the current month

      const totalTransactionsMonth = await TransactionModel.findAll({
        where: {
          createdAt: {
            [Op.gte]: new Date(currentYear, currentMonth - 1, 1), // Start of the current month
            [Op.lt]: new Date(currentYear, currentMonth, 1), // Start of the next month
          },
        },
      });

      const weeklyCommissions = {};

      // Initialize weekly commissions with zero values
      for (let i = 1; i <= weeksInMonth; i++) {
        weeklyCommissions[`Week ${i}`] = 0;
      }

      // Calculate weekly commissions
      totalTransactionsMonth.forEach((transaction) => {
        const weekNumber = Math.ceil(transaction.createdAt.getDate() / 7);
        const weekKey = `Week ${weekNumber}`;

        weeklyCommissions[weekKey] += transaction.commission;
      });

      const dashboardDetails = {
        totalVendors,
        totalVerifiedVendors,
        totalUnVerifiedVendors,
        totalComission,
        totalBookings,
        weeklyCommissions,
        totalTransactionsMonth,
      };
      successHandler(
        res,
        200,
        dashboardDetails,
        "Dashboard details for admin."
      );
    } catch (e) {
      next(e);
    }
  };
}

const adminController = new AdminController();
module.exports = adminController;
