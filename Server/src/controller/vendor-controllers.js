const UserModel = require("../model/client/user");
const AmenitiesModel = require("../model/hotel/amenities");
const HotelModel = require("../model/hotel/hotel");
const RoomModel = require("../model/hotel/room");
const RoomTypesModel = require("../model/hotel/room_types");
const successHandler = require("../utils/handler/successHandler");
const HotelPicturesModel = require("../model/hotel/hotel_pictures");
const RoomPicturesModel = require("../model/hotel/room_pictures");
const BedTypesModel = require("../model/hotel/bed_types");
const RoomBedsModel = require("../model/hotel/room_beds");
const ChatRoomModel = require("../model/chat/room");
const ChatModel = require("../model/chat/chat");
const BookingModel = require("../model/client/bookings");
const HotelReviewModel = require("../model/hotel/hotel_reviews");
const PaymentModel = require("../model/client/payment");
const TransactionModel = require("../model/client/transactions");
const { Op, DATE, Sequelize } = require("sequelize");
const BookMarkModel = require("../model/hotel/bookmarks");
const Hotel_Additional_Services = require("../model/hotel/hotel_additional_services");
const Bookings_Additional_Services = require("../model/client/booking_additional_services");
const NotificationModel = require("../model/client/notifications");
const FAQModel = require("../model/hotel/faq");

class VendorController {
  //? http://localhost:1000/api/nobu/vendor/addVendors/:user_id
  vendorRegistration = async (req, res, next) => {
    try {
      const {
        hotel_name,
        vendor_id,
        amenities,
        phone_number,
        description,
        location,
        ratings,
        email,
      } = req.vendor;
      //!For single picture
      const urlFromCloudinary = req.hotel_Image;
      //!For multiple pictures
      const uriFromCloudinary = req.hotel_Images;

      // const ma = room_types.map((mapp) => mapp);
      console.log(amenities, "aasas");
      // // console.log(ma);
      const allAmenities = amenities.map((amen) => amen);

      const vendorHotel = await HotelModel.create({
        vendor_id,
        hotel_name,
        phone_number,
        description,
        location,
        ratings,
        hotel_amenities: allAmenities,
        email,
        main_picture: urlFromCloudinary.secure_url,
      });

      if (!vendorHotel) {
        throw {
          status: 500,
          message: "Failed to register the hotel. Please try again later.",
        };
      }

      //!Need to perform cascade
      //!And i can just add the amenities by the admin so that the vendors can select from them like by using tick radio input type

      const hotelImages = uriFromCloudinary.map(async (url) => {
        const hotelImag = await HotelPicturesModel.create({
          hotel_id: vendorHotel.hotel_id,
          hotel_picture: url.secure_url,
        });
        return hotelImag;
      });

      const allImages = await Promise.all(hotelImages);

      const vendor = await UserModel.findOne({ where: { user_id: vendor_id } });

      const admin = await UserModel.findOne({ where: { roles: "admin" } });

      const notification = await NotificationModel.create({
        message: `A new hotel registration named "${hotel_name}" has been submitted by ${vendor.user_name}.`,
        sender_id: vendor.user_id,
        receiver_id: admin.user_id,
        type: "message",
      });

      successHandler(
        res,
        201,
        { vendorHotel, allAmenities, allImages },
        "Hotel registration successful! Please await admin approval."
      );
    } catch (e) {
      next(e);
    }
  };

  //? http://localhost:1000/api/nobu/vendor/addRooms/:hotel_id
  hotelRoomRegistration = async (req, res, next) => {
    try {
      const {
        hotel,
        description,
        price_per_night,
        types,
        amenities,
        checkBeds,
        room_no,
        floor,
      } = req.hotel;
      const uriFromCloudinary = req.room_Image;

      console.log(description);

      let capacity = 0;
      checkBeds.map((cap) => (capacity += cap.capacity));

      const createRoom = await RoomModel.create({
        hotel_id: hotel.hotel_id,
        description,
        price_per_night,
        room_type_id: types.room_type_id,
        room_capacity: capacity,
        room_no,
        floor,
        amenities: amenities.map((amen) => amen),
      });

      if (!createRoom) {
        throw { status: 500, message: "Failed to create the room." };
      }

      for (const bed of checkBeds) {
        await RoomBedsModel.create({
          room_id: createRoom.room_id,
          bed_type_id: bed.bed_types_id,
        });
      }

      console.log(uriFromCloudinary.secure_url);
      console.log(createRoom.room_id, "tereo");

      // for(let i = 0; uriFromCloudinary.length > i; i++){
      //   const roomImage = await RoomPicturesModel.create({room_id:createRoom.room_id,room_picture:uriFromCloudinary[i].secure_url})

      // }

      const roomImag = uriFromCloudinary.map(async (url) => {
        const roomImage = await RoomPicturesModel.create({
          room_id: createRoom.room_id,
          room_picture: url.secure_url,
        });
        return roomImage;
      });

      const allImages = await Promise.all(roomImag);

      successHandler(
        res,
        201,
        { createRoom },
        "Hotel room created successfully."
      );
    } catch (e) {
      next(e);
    }
  };

  //!Need to improve it
  getHotelRoomDetails = async (req, res, next) => {
    try {
      const room_id = req.params.room_id;
      const hotel_id = req.params.hotel_id;

      const room = await RoomModel.findOne({
        where: { room_id: room_id, hotel_id: hotel_id },
      });

      if (!room) {
        throw { status: 404, message: "No such rooms!" };
      }

      // const hotel = await HotelModel.findOne({where:{hotel_id:room.hotel_id}})

      const roomType = await RoomTypesModel.findOne({
        where: { room_type_id: room.room_type_id },
      });

      const allData = {
        room_id: room.room_id,
        hotel_id: room.hotel_id,
        status: room.is_available,
        amenities: room.amenities,
        price_per_night: room.price_per_night,
        description: room.description,
        room_type: roomType.type_name,
        createdAt: room.createdAt,
      };

      successHandler(res, 200, allData, "Room details");
    } catch (e) {
      next(e);
    }
  };

  //?http://localhost:1000/api/nobu/vendor/deleteRooms/:room_id/:hotel_id
  deleteRoom = async (req, res, next) => {
    try {
      const { hotel, room } = req.room;

      const deleteRoom = await RoomModel.destroy({
        where: { room_id: room.room_id, hotel_id: hotel.hotel_id },
      });

      if (!deleteRoom) {
        throw {
          status: 500,
          message: "Failed to delete the room. Please try again later.",
        };
      }

      successHandler(res, 201, null, "Room deleted successfully.");
    } catch (e) {
      next(e);
    }
  };

  updateRoom = async (req, res, next) => {
    try {
      const {
        room,
        description,
        amenities,
        room_type,
        price_per_night,
        room_no,
        floor,
      } = req.hotelRoom;

      const { bed_types } = req.body;
      console.log(JSON.stringify(bed_types), "beds");
      console.log(req.body, "haha");
      const uriFromCloudinary = req.room_Image;

      const desc = description ? description : room.description;
      const price_per = price_per_night
        ? price_per_night
        : room.price_per_night;

      //!If the previous room_type_id doesnot match with the value received from the user then it will be updated if it matches it wont be updated
      const checkRoomType = await RoomTypesModel.findOne({
        where: { type_name: room_type },
      });

      if (room.room_type_id !== checkRoomType.room_type_id) {
        await RoomModel.update(
          { room_type_id: checkRoomType.room_type_id },
          { where: { room_id: room.room_id } }
        );
      }
      //!Removing old pictures and creating a new one
      const deleteOldPictures = await RoomPicturesModel.destroy({
        where: { room_id: room.room_id },
      });

      if (!deleteOldPictures) {
        throw { status: 500, message: "Deletion of room picture failed!!" };
      }

      const roomImag = uriFromCloudinary.map(async (url) => {
        const roomImage = await RoomPicturesModel.create({
          room_id: room.room_id,
          room_picture: url.secure_url,
        });
        return roomImage;
      });

      const allImages = await Promise.all(roomImag);

      const findRoom = await RoomBedsModel.findOne({
        where: { room_id: room.room_id },
      });

      if (findRoom) {
        //!So first deleting the previous beds and updating it with new one okay hehe
        const deleteBedTypes = await RoomBedsModel.destroy({
          where: { room_id: room.room_id },
        });
        if (!deleteBedTypes) {
          throw { status: 500, message: "Beds not deleted!" };
        }
      }

      const newBedTypes = bed_types.map(async (bedTypes) => {
        await RoomBedsModel.create({
          room_id: room.room_id,
          bed_type_id: parseInt(bedTypes),
        });
      });

      const allBeds = await Promise.all(newBedTypes);

      const roomAmenities = await RoomModel.update(
        { amenities: amenities },
        { where: { room_id: room.room_id } }
      );

      const beds = await RoomBedsModel.findAll({
        where: { room_id: room.room_id },
      });
      console.log(beds);

      const checkBeds = await Promise.all(
        beds.map(async (beds) => {
          console.log(beds);
          const checkBed = await BedTypesModel.findOne({
            where: { bed_types_id: beds.bed_type_id },
          });
          return checkBed;
        })
      );

      let capacity = 0;

      checkBeds.map((bedss) => (capacity += bedss.capacity));

      const hotelRoom = await RoomModel.update(
        {
          description: desc,
          price_per_night: price_per,
          amenities,
          room_type,
          room_no,
          floor,
          room_capacity: capacity,
        },
        { where: { room_id: room.room_id } }
      );

      if (!hotelRoom) {
        throw {
          status: 500,
          message: "Something went wrong while updation of room!",
        };
      }

      successHandler(res, 201, hotelRoom, "Room updated Successfully.");
    } catch (e) {
      next(e);
    }
  };

  //?http://localhost:1000/api/nobu/vendor/getVendors/getAllRoomTypes
  getAllRoomTypesRegis = async (req, res, next) => {
    try {
      const types = await RoomTypesModel.findAll();

      successHandler(res, 200, types, "These are all room types available!!");
    } catch (e) {
      next(e);
    }
  };

  //?http://localhost:1000/api/nobu/vendor/getVendors/getAllAmenitiesRegi
  getAllAmenitiesRegi = async (req, res, next) => {
    try {
      const amenities = await AmenitiesModel.findAll();
      successHandler(
        res,
        200,
        { amenities: amenities },
        "These are the amenities registered!!"
      );
    } catch (e) {
      next(e);
    }
  };

  //?http://localhost:1000/api/nobu/vendor/getVendors/getHotelAmenities/:vendor_id
  getHotelAmenRegist = async (req, res, next) => {
    try {
      const { hotel } = req.details;

      const amenities = hotel.hotel_amenities;

      successHandler(
        res,
        200,
        amenities,
        "These are the amenities registered into this hotel!!"
      );
    } catch (e) {
      next(e);
    }
  };

  //?http://localhost:1000/api/nobu/vendor/getVendors/getRoomTypes
  getRoomTypes = async (req, res, next) => {
    try {
      const roomTypes = await RoomTypesModel.findAll();

      successHandler(res, 200, roomTypes, "These are the room types!");
    } catch (e) {
      next(e);
    }
  };

  //?http://localhost:1000/api/nobu/vendor/getVendors/getAllRooms/:vendor_id
  getAllHotelsRooms = async (req, res, next) => {
    try {
      const vendor_id = req.params.vendor_id;

      const vendor = await UserModel.findOne({ where: { user_id: vendor_id } });

      if (!vendor) {
        throw { status: 404, message: "User hasn't been registered yet!!" };
      }
      const hotel = await HotelModel.findOne({
        where: { vendor_id: vendor_id },
      });

      if (!hotel) {
        throw { status: 404, message: "No hotels found!" };
      }

      successHandler(res, 200, hotel, "This is the hotel for required vendor!");
    } catch (e) {
      next(e);
    }
  };

  getAllBedTypes = async (req, res, next) => {
    try {
      const allBedTypes = await BedTypesModel.findAll();

      if (!allBedTypes) {
        throw { status: 404, message: "No bed types found!" };
      }
      successHandler(res, 200, allBedTypes, "These are the all bed types");
    } catch (e) {
      next(e);
    }
  };

  getSingleHotel = async (req, res, next) => {
    try {
      const { vendor_id } = req.params;

      const getHotel = await HotelModel.findOne({
        where: { vendor_id: vendor_id },
      });

      if (!getHotel) {
        throw { status: 404, message: "No hotel's found" };
      }

      successHandler(res, 200, getHotel, "The hotel");
    } catch (e) {
      next(e);
    }
  };

  getAllChats = async (req, res, next) => {
    try {
      const { vendor_id } = req.params;

      const getChats = await ChatRoomModel.findAll({
        where: { vendor_id: vendor_id },
      });

      let chats = [];

      for (let chat of getChats) {
        const users = await UserModel.findOne({
          where: { user_id: chat.user_id },
        });
        const allChats = await ChatModel.findAll({
          where: { chat_room_id: chat.chat_room_id },
          order: [["createdAt", "DESC"]], // Use 'createdAt' as the timestamp field
        });

        const latestChat = allChats[0]; // The first item will be the latest message

        const chatData = {
          chat_room_id: chat.chat_room_id,
          vendor_id: chat.vendor_id,
          user: {
            user_id: users.user_id,
            user_name: users.user_name,
            picture: users.profile_picture,
          },
          latestMessage: latestChat,
        };
        chats.push(chatData);
      }
      successHandler(res, 200, chats, "Chats ");
    } catch (e) {
      next(e);
    }
  };

  getAllBookingDetails = async (req, res, next) => {
    try {
      // const hotel_id = req.params.hotel_id;

      const {
        page,
        bookedRooms,
        refundedRooms,
        canceledRooms,
        pendingRooms,
        ongoingRooms,
        succcessRooms,
      } = req.query;

      const { hotel } = req.details;

      const pageNumber = parseInt(page);
      const limit = parseInt(req.query.pageLimit) || 7;

      const offset = (pageNumber - 1) * limit;

      console.log(req.query);

      //!So the booking details dosenot have the hotel_id so i have to find all the bookings and then filter out the rooms according to the hotel_id
      // const bookingDetails = await BookingModel.findAll({
      //   include: { model: RoomModel, where: { hotel_id: hotel.hotel_id }},
      // });
      // const bookingDetails = await BookingModel.findAll({
      //   include: [{
      //     model: RoomModel,
      //     where: { hotel_id: hotel.hotel_id } // Filter rooms by hotel_id
      //   }]
      // });

      const hotelRooms = await RoomModel.findAll({
        where: { hotel_id: hotel.hotel_id }, // Filter rooms by hotel_id
      });

      // Extract room ids
      const roomIds = hotelRooms.map((room) => room.room_id);

      let bookingQuery = {
        offset,
        limit,
        order: [["booking_id", "ASC"]],
        where: { room_id: roomIds, user_id: { [Op.not]: null } },
      };
      let bookingQueryCounts = {
        where: { room_id: roomIds, user_id: { [Op.not]: null } },
      };

      if (refundedRooms) {
        bookingQuery.where = { ...bookingQuery.where, status: "refund" };
        bookingQueryCounts.where = {
          ...bookingQueryCounts.where,
          status: "refund",
        };
      }

      if (bookedRooms) {
        bookingQuery.where = { ...bookingQuery.where, status: "booked" };
        bookingQueryCounts.where = {
          ...bookingQueryCounts.where,
          status: "booked",
        };
      }

      if (pendingRooms) {
        bookingQuery.where = { ...bookingQuery.where, status: "pending" };
        bookingQueryCounts.where = {
          ...bookingQueryCounts.where,
          status: "pending",
        };
      }

      if (canceledRooms) {
        bookingQuery.where = { ...bookingQuery.where, status: "canceled" };
        bookingQueryCounts.where = {
          ...bookingQueryCounts.where,
          status: "canceled",
        };
      }

      //!Checking if the user _id is null or not if it is then the row related to it will not be shown
      if (ongoingRooms) {
        bookingQuery.where = {
          ...bookingQuery.where,
          status: "ongoing",
        };
        bookingQueryCounts.where = {
          ...bookingQueryCounts.where,
          status: "ongoing",
        };
      }

      if (succcessRooms) {
        bookingQuery.where = { ...bookingQuery.where, status: "success" };
        bookingQueryCounts.where = {
          ...bookingQueryCounts.where,
          status: "success",
        };
      }

      let bookings = await BookingModel.findAll(bookingQuery);

      const totalNumbers = await BookingModel.count(bookingQueryCounts);

      const bookingDetails = await Promise.all(
        bookings.map(async (book) => {
          //!With this the booking details which have been booked without online like for cash payment this will be used

          const user = await UserModel.findOne({
            where: { user_id: book.user_id },
          });

          const room = await RoomModel.findOne({
            where: { room_id: book.room_id },
          });

          const roomType = await RoomTypesModel.findOne({
            where: { room_type_id: room.room_type_id },
          });

          return {
            booking_id: book.booking_id,
            status: book.status,
            total_price: book.total_price,
            createdAt: book.createdAt,
            check_in_date: book.check_in_date,
            check_out_date: book.check_out_date,
            user: {
              user_id: user.user_id,
              user_name: user.user_name,
              profile_picture: user.profile_picture,
            },
            room: {
              room_id: room.room_id,
              room_no: room.room_no,
              room_type: roomType.type_name,
            },
          };
        })
      );

      //!Here the length or count of the required details of the bookings are shown
      const allBookedRoomsCount = await BookingModel.count({
        where: { status: "booked", room_id: roomIds },
      });
      const allPendingRoomsCount = await BookingModel.count({
        where: { status: "pending", room_id: roomIds },
      });

      const allRefundedRoomsCount = await BookingModel.count({
        where: { status: "refund", room_id: roomIds },
      });
      const allCanceledRoomsCount = await BookingModel.count({
        where: { status: "canceled", room_id: roomIds },
      });
      const allSuccessRoomsCount = await BookingModel.count({
        where: { status: "success", room_id: roomIds },
      });
      const allOngoingRoomsCount = await BookingModel.count({
        where: {
          status: "ongoing",
          room_id: roomIds,
          user_id: { [Op.not]: null },
        },
      });
      const totalBookingDetails = await BookingModel.count({
        where: { room_id: roomIds },
      });

      //!So the total Details is basiccally  all the bboking details of the hotel and the total means the total number of required filtered lists
      //!So what i have done is the counts are differntiated at first right so the totalDetails is used as the total counts of the required filtered rooms
      //! Not the paginated one like when i use the paginated one then the total counts will be 2 when the total counts of the list is 4 so
      //! The page wont show another page so the total numbers of required list is set instead of the total numbers of the queried conunts with limits
      const bookingDetail = {
        page,
        limit,
        totalDetails: totalNumbers,
        total: totalBookingDetails,
        allBookedRoomsCount,
        allPendingRoomsCount,
        allRefundedRoomsCount,
        allCanceledRoomsCount,
        allOngoingRoomsCount,
        allSuccessRoomsCount,
        bookingDetails,
      };

      successHandler(
        res,
        200,
        bookingDetail,
        "Bookings of the requried hotel!"
      );
    } catch (e) {
      next(e);
    }
  };
  //? http://localhost:1000/api/nobu/vendor/getVendors/allRooms/:hotel_name

  getAllRooms = async (req, res, next) => {
    try {
      const { hotel } = req.details;

      const allAvailableRooms = req.query.allAvailableRooms;
      const bookedRooms = req.query.bookedRooms;
      const searchName = req.query.searchName;
      const selectedRoomType = req.query.selectedRoomType;
      const selectedRoomFloor = req.query.selectedRoomFloor;

      const page = parseInt(req.query.pageNumber) || 1;
      const limit = parseInt(req.query.pageLimit) || 7;

      const offset = (page - 1) * limit;
      console.log(selectedRoomFloor, "nulll");
      let roomsQuery = {
        offset,
        limit,
        order: [["room_id", "ASC"]],
        where: { hotel_id: hotel.hotel_id },
      };

      let roomsQueryCount = {
        where: { hotel_id: hotel.hotel_id },
      };

      if (searchName !== undefined) {
        roomsQuery.where = {
          ...roomsQuery.where,
          room_no: { [Sequelize.Op.iLike]: `%${searchName}%` },
        };
      }

      if (selectedRoomFloor !== "") {
        roomsQuery.where = {
          ...roomsQuery.where,
          floor: selectedRoomFloor,
        };
      }

      if (selectedRoomType > 0) {
        roomsQuery.where = {
          ...roomsQuery.where,
          room_type_id: selectedRoomType,
        };
      }

      //!Important for taking out the history of bookings of rooms
      if (bookedRooms) {
        // roomsQuery.include = [
        //   {
        //     model: BookingModel,
        //     where: { status: "booked" }, // Assuming 'success' is one of the status values for a successful booking
        //     required: true, // Inner join to fetch only booked rooms
        //   },
        // ];
        roomsQuery.where = { ...roomsQuery.where, is_available: false };
        roomsQueryCount.where = {
          ...roomsQueryCount.where,
          is_available: false,
        };
      }

      if (allAvailableRooms) {
        roomsQuery.where = { ...roomsQuery.where, is_available: true };
        roomsQueryCount.where = {
          ...roomsQueryCount.where,
          is_available: true,
        };
      }

      const rooms = await RoomModel.findAll(roomsQuery);

      //!This is the total number of rooms according to its specific conditions
      //!Like if the booked Rooms are 6 then this will be used whenever the query is inserted like if the query booked is instered then
      //! The total number of booked rooms will be counted through this which will be needed on the pagination to know the total number of
      //! The items of the required query
      const roomCounts = await RoomModel.count(roomsQueryCount);

      // After combining results from different queries
      const uniqueRooms = rooms.filter(
        (room, index, self) =>
          index === self.findIndex((h) => h.room_id === room.room_id)
      );
      const roomDetails = await Promise.all(
        uniqueRooms.map(async (room) => {
          const room_Pictures = await RoomPicturesModel.findAll({
            where: { room_id: room.room_id },
          });
          const vendor = await UserModel.findOne({
            where: { user_id: hotel.vendor_id },
          });

          const room_type = await RoomTypesModel.findOne({
            where: { room_type_id: room.room_type_id },
          });

          const beds = await RoomBedsModel.findAll({
            where: {
              room_id: room.room_id,
            },
          });

          // Use flatMap to flatten the array of arrays into a single array
          const allBeds = await Promise.all(
            beds.map(async (bed) => {
              const bedType = await BedTypesModel.findOne({
                where: { bed_types_id: bed.bed_type_id },
              });
              return {
                bed_type_id: bedType.bed_types_id,
                type_name: bedType.type_name,
              };
            })
          );

          const checkBookings = await BookingModel.findAll({
            where: {
              room_id: room.room_id,
              status: ["booked", "ongoing"],
            },
          });

          //!Checking if the booking status of the room is free or not if the status booked and ongoing is true then the status of the room
          //! Will be the same false but if its not then i will update it right now
          if (checkBookings.length === 0) {
            await RoomModel.update(
              { is_available: true },
              { where: { room_id: room.room_id } }
            );
            console.log("status updated of the room");
          }

          return {
            hotel_id: hotel.hotel_id,
            room_id: room.room_id,
            room_no: room.room_no,
            room_type: room_type.type_name,
            room_capacity: room.room_capacity,
            is_available: room.is_available,
            price_per_night: room.price_per_night,
            floor: room.floor,
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
            bed_types: allBeds,
          };
        })
      );

      const allRoomsCount = await RoomModel.count({
        where: { hotel_id: hotel.hotel_id },
      });
      const allAvailableRoomsCount = await RoomModel.count({
        where: { is_available: true, hotel_id: hotel.hotel_id },
      });
      // const allBookedRoomsCount = await RoomModel.count({
      //   where:{hotel_id:hotel_id},
      //   include: [{
      //     model: BookingModel,
      //     where: { status: "booked" }
      //   }]
      // });

      const allBookedRoomsCount = await RoomModel.count({
        where: { is_available: false, hotel_id: hotel.hotel_id },
      });

      const roomDetail = {
        page,
        limit,
        allRoomsCount,
        allAvailableRoomsCount,
        allBookedRoomsCount,
        total: roomCounts,
        data: roomDetails,
      };

      successHandler(res, 200, roomDetail, "These are the available rooms!");
    } catch (e) {
      next(e);
    }
  };

  getHotelRoom = async (req, res, next) => {
    try {
      const {
        page,
        bookedRooms,
        refundedRooms,
        canceledRooms,
        pendingRooms,
        ongoingRooms,
        succcessRooms,
      } = req.query;

      const { room, hotel } = req.room;
      console.log(room.room_id, "jsajajsd");

      const room_Pictures = await RoomPicturesModel.findAll({
        where: { room_id: room.room_id },
      });

      const pageNumber = parseInt(page) || 1;
      const limit = parseInt(req.query.pageLimit) || 7;

      const offset = (pageNumber - 1) * limit;

      console.log(req.query);

      //!Checking if the user _id is null or not if it is then the row related to it will not be shown
      let bookingQuery = {
        offset,
        limit,
        where: { room_id: room.room_id, user_id: { [Op.not]: null } },
      };

      let bookingQueryCounts = {
        where: { room_id: room.room_id, user_id: { [Op.not]: null } },
      };

      if (refundedRooms) {
        bookingQuery.where = { ...bookingQuery.where, status: "refund" };
        bookingQueryCounts.where = {
          ...bookingQueryCounts.where,
          status: "refund",
        };
      }

      if (bookedRooms) {
        bookingQuery.where = { ...bookingQuery.where, status: "booked" };
        bookingQueryCounts.where = {
          ...bookingQueryCounts.where,
          status: "booked",
        };
      }

      if (pendingRooms) {
        bookingQuery.where = { ...bookingQuery.where, status: "pending" };
        bookingQueryCounts.where = {
          ...bookingQueryCounts.where,
          status: "pending",
        };
      }

      if (canceledRooms) {
        bookingQuery.where = { ...bookingQuery.where, status: "canceled" };
        bookingQueryCounts.where = {
          ...bookingQueryCounts.where,
          status: "canceled",
        };
      }

      if (ongoingRooms) {
        bookingQuery.where = {
          ...bookingQuery.where,
          status: "ongoing",
        };
        bookingQueryCounts.where = {
          ...bookingQueryCounts.where,
          status: "ongoing",
        };
      }

      if (succcessRooms) {
        bookingQuery.where = { ...bookingQuery.where, status: "success" };
        bookingQueryCounts.where = {
          ...bookingQueryCounts.where,
          status: "success",
        };
      }

      let bookings = await BookingModel.findAll(bookingQuery);

      const totalNumbers = await BookingModel.count(bookingQueryCounts);

      const bookingDetails = await Promise.all(
        bookings.map(async (book) => {
          //!With this the booking details which have been booked without online like for cash payment this will be used

          const user = await UserModel.findOne({
            where: { user_id: book.user_id },
          });

          const room = await RoomModel.findOne({
            where: { room_id: book.room_id },
          });

          const roomType = await RoomTypesModel.findOne({
            where: { room_type_id: room.room_type_id },
          });

          return {
            booking_id: book.booking_id,
            status: book.status,
            total_price: book.total_price,
            createdAt: book.createdAt,
            check_in_date: book.check_in_date,
            check_out_date: book.check_out_date,
            user: {
              user_id: user.user_id,
              user_name: user.user_name,
              profile_picture: user.profile_picture,
            },
            room: {
              room_id: room.room_id,
              room_type: roomType.type_name,
            },
          };
        })
      );

      //!Here the length or count of the required details of the bookings are shown
      const allBookedRoomsCount = await BookingModel.count({
        where: { status: "booked", room_id: room.room_id },
      });
      const allPendingRoomsCount = await BookingModel.count({
        where: { status: "pending", room_id: room.room_id },
      });

      const allRefundedRoomsCount = await BookingModel.count({
        where: { status: "refund", room_id: room.room_id },
      });
      const allCanceledRoomsCount = await BookingModel.count({
        where: { status: "canceled", room_id: room.room_id },
      });
      const allSuccessRoomsCount = await BookingModel.count({
        where: { status: "success", room_id: room.room_id },
      });
      const allOngoingRoomsCount = await BookingModel.count({
        where: {
          status: "ongoing",
          room_id: room.room_id,
          user_id: { [Op.not]: null },
        },
      });
      const totalBookingDetails = await BookingModel.count({
        where: { room_id: room.room_id },
      });

      const bookingDetail = {
        page,
        limit,
        totalDetails: totalNumbers,
        total: totalBookingDetails,
        allBookedRoomsCount,
        allPendingRoomsCount,
        allRefundedRoomsCount,
        allCanceledRoomsCount,
        allOngoingRoomsCount,
        allSuccessRoomsCount,
        bookingDetails,
      };

      const beds = await RoomBedsModel.findAll({
        where: { room_id: room.room_id },
      });

      const roomType = await RoomTypesModel.findOne({
        where: { room_type_id: room.room_type_id },
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

      if (room.is_available === false) {
        const bookedRooms = await BookingModel.findAll({
          where: { room_id: room.room_id },
        });

        const date = bookedRooms.map((booked) => {
          return {
            room_id: room.room_id,
            booked_id: booked.booking_id,
            user_id: booked.user_id,
            status: booked.status,
            bookedDates: {
              check_in_date: booked.check_in_date,
              check_out_date: booked.check_out_date,
            },
            createdAt: booked.createdAt,
          };
        });

        bookedDates.push(date);
      }

      let capacity = 0;

      checkBeds.map((bedss) => (capacity += bedss.capacity));

      const roomDetails = {
        room_id: room.room_id,
        hotel_id: hotel.hotel_id,
        room_capacity: capacity,
        floor: room.floor,
        room_no: room.room_no,
        price_per_night: room.price_per_night,
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
        bookedDates,
      };

      successHandler(
        res,
        200,
        { bookingDetail, roomDetails },
        "This the requried room for the hotel!"
      );
    } catch (e) {
      next(e);
    }
  };

  getVendorDashboardDetails = async (req, res, next) => {
    try {
      const { hotel, vendor } = req.details;

      const rooms = await RoomModel.findAll({
        where: { hotel_id: hotel.hotel_id },
      });

      const roomIds = rooms.map((room) => room.room_id);

      const bookingHistory = await BookingModel.findAll({
        where: { room_id: roomIds },
      });

      //!Here the length or count of the required details of the bookings are shown
      const allBookedRoomsCount = await BookingModel.count({
        where: { status: "booked", room_id: roomIds },
      });
      const allPendingRoomsCount = await BookingModel.count({
        where: { status: "pending", room_id: roomIds },
      });

      const allRefundedRoomsCount = await BookingModel.count({
        where: { status: "refund", room_id: roomIds },
      });
      const allCanceledRoomsCount = await BookingModel.count({
        where: { status: "canceled", room_id: roomIds },
      });

      const totalBookingDetails = await BookingModel.count({
        where: { room_id: roomIds },
      });

      const totalRooms = await RoomModel.count({
        where: { hotel_id: hotel.hotel_id },
      });

      const totalUniqueGuests = await BookingModel.count({
        distinct: true,
        col: "user_id",
        where: { room_id: roomIds },
      });
      console.log(hotel.hotel_id, "lala");
      const hotelReviews = await HotelReviewModel.findAll({
        limit: 6,
        where: { hotel_id: hotel.hotel_id },
        order: [["createdAt", "DESC"]],
      });

      console.log(hotelReviews, "jaja");

      const customerReviews = await Promise.all(
        hotelReviews.map(async (review) => {
          const user = await UserModel.findOne({
            where: { user_id: review.user_id },
          });

          return {
            review_id: review.hotel_review_id,
            ratings: review.ratings,
            title: review.title,
            content: review.content,
            user: {
              user_id: user.user_id,
              user_name: user.user_name,
              profile: user.profile_picture,
            },
            createdAt: review.createdAt,
          };
        })
      );

      const recentBookings = await BookingModel.findAll({
        order: [["createdAt", "DESC"]],
        limit: 5,
        where: { room_id: roomIds, user_id: { [Op.not]: null } },
      });

      let recentActivity = [];
      for (let i of recentBookings) {
        if (i.user_id) {
          // Check if user_id is not null
          const user = await UserModel.findOne({
            where: { user_id: i.user_id },
          });

          recentActivity.push({
            booking_id: i.booking_id,
            status: i.status,
            check_in_date: i.check_in_date,
            check_out_date: i.check_out_date,
            user: {
              user_id: user.user_id,
              user_name: user.user_name,
              picture: user.profile_picture,
            },
            createdAt: i.createdAt,
          });
        }
      }

      //!Taking out bookings which have been successful and which has status booked and success
      const bookings = await BookingModel.findAll({
        where: {
          room_id: roomIds,
          user_id: { [Op.not]: null },
          status: { [Op.or]: ["booked", "success"] },
        },
      });

      const bookingIds = bookings.map((id) => id.booking_id);

      //! This is for taking out total amount including commission
      const payments = await PaymentModel.findAll({
        where: { booking_id: bookingIds },
      });

      const paymentsId = payments.map((id) => id.transaction_id);
      const transactions = await TransactionModel.findAll({
        where: { transaction_id: paymentsId },
      });

      // const totalWithComissionAmount = transactions.reduce(
      //   (acc, current) => parseInt(acc) + parseInt(current.amount),
      //   0
      // );

      const totalWithComission = await TransactionModel.findAll({
        where: { vendor_id: hotel.vendor_id },
      });
      const totalWithComissionAmount = totalWithComission.reduce(
        (acc, current) => parseInt(acc) + parseInt(current.amount),
        0
      );

      console.log(recentBookings.map((hehe) => hehe.total_price));
      console.log(bookings.map((hehe) => hehe.total_price));

      //!This is total amount without comission
      const totalAmount = bookings.reduce(
        (acc, current) => parseInt(acc) + parseInt(current.total_price),
        0
      );

      //!Have to convert the date and time due to different time zones so when i try to retrive
      const today = new Date();
      const todayISOString = today.toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format

      const recentDates = recentBookings.map((booking) => {
        // Convert the database date string to a Date object
        const date = new Date(booking.check_in_date); // Create a new Date object

        date.setDate(date.getDate() + 1);
        return date.toISOString().slice(0, 10);
      });

      const checkInToday = recentDates.filter(
        (date) => date === todayISOString
      ).length;

      const recentDatesDepart = recentBookings.map((booking) => {
        // Convert the database date string to a Date object
        const date = new Date(booking.check_out_date); // Create a new Date object
        date.setDate(date.getDate() + 1);
        return date.toISOString().slice(0, 10);
      });

      const checkOutToday = recentDatesDepart.filter(
        (date) => date === todayISOString
      ).length;

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.toISOString().slice(0, 10);

      const tomorrowDates = recentBookings.map((booking) => {
        const date = new Date(booking.check_in_date);
        date.setDate(date.getDate() + 1);
        return date.toISOString().slice(0, 10);
      });

      const checkInTomorrow = tomorrowDates.filter(
        (date) => date === tomorrowDate
      ).length;

      console.log(todayISOString); // Current date
      console.log(checkInToday); // Count of recent bookings with check-in date same as today
      console.log(recentDates); // Array of recent booking check-in dates
      console.log(tomorrowDates);

      const freeRooms = await RoomModel.count({
        where: { is_available: true },
      });

      // Get the current date
      const currentDate = new Date();

      // Get the start of the current week (Sunday)
      const startOfWeek = new Date(
        currentDate.setDate(currentDate.getDate() - currentDate.getDay())
      );

      // Get the end of the current week (Saturday)
      const endOfWeek = new Date(
        startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000
      );

      const bookingsInCurrentWeek = bookingHistory.filter((booking) => {
        const bookingDate = new Date(booking.createdAt);
        return bookingDate >= startOfWeek && bookingDate <= endOfWeek;
      });

      const totalBookingsInCurrentWeek = bookingsInCurrentWeek.length;
      const dayWiseBookings = {
        "Day 0": 0,
        "Day 1": 0,
        "Day 2": 0,
        "Day 3": 0,
        "Day 4": 0,
        "Day 5": 0,
        "Day 6": 0,
      };

      bookingsInCurrentWeek.forEach((booking) => {
        const bookingDate = new Date(booking.createdAt);
        const day = bookingDate.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday

        const dayKey = `Day ${day}`;
        dayWiseBookings[dayKey]++;
      });

      console.log(dayWiseBookings, "jajajs");

      const bookingDetail = {
        totalRooms: totalRooms,
        totalBookings: totalBookingDetails,
        withoutComissionAmount: totalAmount,
        withComissionAmount: totalWithComissionAmount,
        totalBookingsInCurrentWeek,
        dayWiseBookings,
        freeRooms,
        checkInToday,
        checkInTomorrow,
        totalUniqueGuests,
        checkOutToday,
        allBookedRoomsCount,
        allPendingRoomsCount,
        allRefundedRoomsCount,
        allCanceledRoomsCount,
        recentActivity,
        customerReviews,
      };

      successHandler(res, 200, bookingDetail, "Dashboard details!");
    } catch (e) {
      next(e);
    }
  };

  guestDetails = async (req, res, next) => {
    try {
      const { hotel } = req.details;

      const { searchName } = req.query;
      console.log(req.query);
      const page = parseInt(req.query.page) || 1;
      const limit = 8;
      const offset = (page - 1) * limit;

      const rooms = await RoomModel.findAll({
        where: { hotel_id: hotel.hotel_id },
      });

      const roomIds = rooms.map((room) => room.room_id);
      const uniqueGuests = await BookingModel.findAll({
        where: { room_id: roomIds },
      });

      const uniqueIds = uniqueGuests.map((hehe) => hehe.user_id);

      let queryName = {
        limit,
        offset,
        where: { user_id: uniqueIds },
      };

      //!Using ilike operator for finding both case sensitive letters like if G is searched when the data is g it should show the data
      if (searchName !== undefined) {
        queryName.where = {
          ...queryName.where,
          user_name: { [Sequelize.Op.iLike]: `%${searchName}%` },
        };
      }

      const users = await UserModel.findAll(queryName);

      const user = await Promise.all(
        users.map(async (user) => {
          const lastCheckOutUser = await BookingModel.findOne({
            where: { user_id: user.user_id, status: "success" },
            order: [["createdAt", "DESC"]],
          });
          console.log(lastCheckOutUser, "lalall");
          const lastCheckInUser = await BookingModel.findOne({
            where: { user_id: user.user_id, status: "success" },
            order: [["createdAt", "DESC"]],
          });

          const bookingCounts = await BookingModel.count({
            where: { user_id: user.user_id },
          });

          return {
            user_id: user.user_id,
            user_name: user.user_name,
            profile_picture: user.profile_picture,
            email: user.email,
            phone_number: user.phone_number,
            status: user.verified,
            roles: user.roles,
            bookingCounts,
            last_check_in: lastCheckOutUser?.check_in_date,
            last_check_out: lastCheckInUser?.check_out_date,
          };
        })
      );
      const userCount = await UserModel.count({
        where: { user_id: uniqueIds },
      });

      const userDetails = {
        limit,
        page,
        total: userCount,
        user,
      };

      successHandler(res, 200, userDetails, "The hotel's guests");
    } catch (e) {
      next(e);
    }
  };

  specificUserDetails = async (req, res, next) => {
    try {
      const { hotel, vendor } = req.details;
      const { user_id } = req.params;

      const { bookedRooms, refundedRooms, canceledRooms, pendingRooms } =
        req.query;

      const pageNumber = req.query.page || 1;
      const limit = req.query.pageLimit || 1;

      //!So how this works is the offset is basically the index to start the query like if the offset is 0 then the items will be displayed from 0
      //! If the offset is like 10 then the items will be displayed from 10 index onwards
      //! So the offset is calculated by subtracting the pageNumber by 1 and then adding by limit of the page if the page number
      //! is 2 and the limit is 4 then the subtracted number will be multiplyed to the limit which will be 4 as 2-1 is 4 then the starting index will be 4
      //! So the items that will be displayed will be from index 4 to index 7
      const offset = (pageNumber - 1) * limit;

      const requiredRooms = await RoomModel.findAll({
        where: { hotel_id: hotel.hotel_id },
      });

      //!Mapping to take the id only and keep it in an array for queries
      const hotelRooms = requiredRooms.map((room) => room.room_id);

      const user = await UserModel.findOne({ where: { user_id: user_id } });

      if (!user) {
        throw {
          status: 404,
          message: "The user has not booked the hotel yet!",
        };
      }

      //!This is where all the query will be located and then if the user adds up the queries i can add the queries on where
      let bookingsQuery = {
        offset,
        limit,
        order: [["createdAt", "DESC"]],
        where: {
          room_id: hotelRooms,
          user_id: user.user_id,
        },
      };

      //!This is the total number of rooms according to its specific conditions
      //!Like if the booked Rooms are 6 then this will be used whenever the query is inserted like if the query booked is instered then
      //! The total number of booked rooms will be counted through this which will be needed on the pagination to know the total number of
      //! The items of the required query
      let bookingsQueryCount = {
        where: { room_id: hotelRooms, user_id: user.user_id },
      };

      if (refundedRooms) {
        bookingsQuery.where = { ...bookingsQuery.where, status: "refund" };
        bookingsQueryCount.where = {
          ...bookingsQueryCount.where,
          status: "refund",
        };
      }

      if (bookedRooms) {
        bookingsQuery.where = { ...bookingsQuery.where, status: "booked" };
        bookingsQueryCount.where = {
          ...bookingsQueryCount.where,
          status: "booked",
        };
      }

      if (pendingRooms) {
        bookingsQuery.where = { ...bookingsQuery.where, status: "pending" };
        bookingsQueryCount.where = {
          ...bookingsQueryCount.where,
          status: "pending",
        };
      }

      if (canceledRooms) {
        bookingsQuery.where = { ...bookingsQuery.where, status: "canceled" };
        bookingsQueryCount.where = {
          ...bookingsQueryCount.where,
          status: "canceled",
        };
      }

      //!For taking out all the bookings of a specific guest
      const usersBookings = await BookingModel.findAll(bookingsQuery);

      const bookingDetails = await Promise.all(
        usersBookings.map(async (book) => {
          const room = await RoomModel.findOne({
            where: { room_id: book.room_id },
          });

          const roomType = await RoomTypesModel.findOne({
            where: { room_type_id: room.room_type_id },
          });

          const roomPictures = await RoomPicturesModel.findAll({
            where: { room_id: room.room_id },
          });

          const beds = await RoomBedsModel.findAll({
            where: { room_id: room.room_id },
          });
          const bedsId = beds.map((ehhe) => ehhe.bed_type_id);

          const bedTypes = await BedTypesModel.findAll({
            where: { bed_types_id: bedsId },
          });

          return {
            booking_id: book.booking_id,
            status: book.status,
            total_price: book.total_price,
            createdAt: book.createdAt,
            check_in_date: book.check_in_date,
            check_out_date: book.check_out_date,
            room: {
              room_id: room.room_id,
              room_type: roomType.type_name,
              capacity: room.room_capacity,
              amenities: room.amenities.map((amen) => amen),
              beds: bedTypes.map((bed) => ({
                bed_type_id: bed.bed_types_id,
                bed_type_name: bed.type_name,
              })),
              room_pictures: roomPictures.map((picture) => ({
                room_picture_id: picture.room_picture_id,
                room_picture: picture.room_picture,
              })),
            },
          };
        })
      );

      //!User details
      const userDetails = {
        user_id: user.user_id,
        user_name: user.user_name,
        email: user.email,
        profile_picture: user.profile_picture,
        phone_number: user.phone_number,
      };

      //!Here the length or count of the required details of the bookings are shown
      const allBookedRoomsCount = await BookingModel.count({
        where: { status: "booked", room_id: hotelRooms, user_id: user.user_id },
      });
      const allPendingRoomsCount = await BookingModel.count({
        where: {
          status: "pending",
          room_id: hotelRooms,
          user_id: user.user_id,
        },
      });

      const allRefundedRoomsCount = await BookingModel.count({
        where: { status: "refund", room_id: hotelRooms, user_id: user.user_id },
      });
      const allCanceledRoomsCount = await BookingModel.count({
        where: {
          status: "canceled",
          room_id: hotelRooms,
          user_id: user.user_id,
        },
      });

      const totalBookingCounts = await BookingModel.count({
        where: { room_id: hotelRooms, user_id: user.user_id },
      });

      //!This will be the total number of queried rooms used for pagination
      const totalQueryCounts = await BookingModel.count(bookingsQueryCount);

      //!For latest booking of the room
      const getLatestBooking = await BookingModel.findOne({
        order: [["createdAt", "DESC"]],
        where: {
          room_id: hotelRooms,
          user_id: user.user_id,
        },
      });
      const getLatestRoom = await RoomModel.findOne({
        where: { room_id: getLatestBooking.room_id },
      });
      const getLatestRoomType = await RoomTypesModel.findOne({
        where: { room_type_id: getLatestRoom.room_type_id },
      });
      const beds = await RoomBedsModel.findAll({
        where: { room_id: getLatestRoom.room_id },
      });
      const bedsId = beds.map((ehhe) => ehhe.bed_type_id);

      const bedTypes = await BedTypesModel.findAll({
        where: { bed_types_id: bedsId },
      });
      const getRoomPicsLatest = await RoomPicturesModel.findAll({
        where: { room_id: getLatestRoom.room_id },
      });

      const guestLastestBookingDetails = {
        booking_id: getLatestBooking.booking_id,
        status: getLatestBooking.status,
        total_price: getLatestBooking.total_price,
        createdAt: getLatestBooking.createdAt,
        check_in_date: getLatestBooking.check_in_date,
        check_out_date: getLatestBooking.check_out_date,
        room: {
          room_id: getLatestRoom.room_id,
          room_type: getLatestRoomType.type_name,
          capacity: getLatestRoom.room_capacity,
          amenities: getLatestRoom.amenities.map((amen) => amen),
          beds: bedTypes.map((bed) => ({
            bed_type_id: bed.bed_types_id,
            bed_type_name: bed.type_name,
          })),
          room_pictures: getRoomPicsLatest.map((picture) => ({
            room_picture_id: picture.room_picture_id,
            room_picture: picture.room_picture,
          })),
        },
      };

      const userBookingDetails = {
        limit,
        pageNumber,
        totalQueryCounts: totalQueryCounts,
        totalBookings: totalBookingCounts,
        userDetails,
        bookingDetails,
        guestLastestBookingDetails,
        bookingCounts: {
          allBookedRoomsCount,
          allRefundedRoomsCount,
          allCanceledRoomsCount,
          allPendingRoomsCount,
        },
      };

      successHandler(
        res,
        200,
        userBookingDetails,
        "These are the details of a specific guest!"
      );
    } catch (e) {
      next(e);
    }
  };

  getAllPaymentDetails = async (req, res, next) => {
    try {
      const { hotel, vendor } = req.details;
      const { success, refund } = req.query;

      const pageNumber = req.query.page || 1;
      const limit = 8;

      const offset = (pageNumber - 1) * limit;
      const queryParams = {
        offset,
        limit,
        where: {
          vendor_id: vendor.user_id,
        },
      };

      const queryParamsCounts = {
        where: { vendor_id: vendor.user_id },
      };
      if (success) {
        queryParams.where = { ...queryParams.where, status: "success" };
        queryParamsCounts.where = {
          ...queryParamsCounts.where,
          status: "success",
        };
      }

      if (refund) {
        queryParams.where = { ...queryParams.where, status: "refund" };
        queryParamsCounts.where = {
          ...queryParamsCounts.where,
          status: "refund",
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

          return {
            payment_id: payment.payment_id,
            amount: transaction.amount,
            createdAt: payment.createdAt,
            status: payment.status,
            method: payment.method,
            user: {
              user_id: user.user_id,
              user_name: user.user_name,
              profile_picture: user.profile_picture,
            },
          };
        })
      );
      const totalTransactions = await TransactionModel.count({
        where: { vendor_id: vendor.user_id },
      });

      const totalQueryCounts = await TransactionModel.count(queryParamsCounts);
      const totalSuccess = await TransactionModel.count({
        where: { vendor_id: vendor.user_id, status: "success" },
      });

      const totalRefund = await TransactionModel.count({
        where: { vendor_id: vendor.user_id, status: "refund" },
      });
      const details = {
        pageNumber,
        limit,
        totalDetails: totalQueryCounts,
        total: totalTransactions,
        totalRefund,
        totalSuccess,
        paymentDetails,
      };

      successHandler(res, 200, details, "Payment info of the hotel!");
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

  getSpecificHotelDetails = async (req, res, next) => {
    try {
      const { hotel, vendor } = req.details;

      const hotel_Pictures = await HotelPicturesModel.findAll({
        where: { hotel_id: hotel.hotel_id },
      });

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
        other_pictures: hotel_Pictures.map((pic) => ({
          picture_id: pic.hotel_picture_id,
          room_picture: pic.hotel_picture,
        })),
        hotel_amenities: hotel.hotel_amenities,
      };

      successHandler(res, 200, hotelDetails, "These are the available hotels!");
    } catch (e) {
      next(e);
    }
  };

  updateHotelsSpecificDetails = async (req, res, next) => {
    try {
      const { hotel, vendor } = req.details;
      const {
        description,
        hotel_name,
        location,
        phone_number,
        email,
        ratings,
      } = req.body;

      console.log(req.body, "shshs");

      const desc = description ? description : hotel.description;
      const name = hotel_name ? hotel_name : hotel.hotel_name;
      const locati = location ? location : hotel.location;
      const number = phone_number ? phone_number : hotel.phone_number;
      const emailAdd = email ? email : hotel.email;
      const rating = ratings ? ratings : hotel.ratings;

      const updateHotel = await HotelModel.update(
        {
          description: desc,
          hotel_name: name,
          location: locati,
          phone_number: number,
          email: emailAdd,
          ratings: rating,
        },
        { where: { hotel_id: hotel.hotel_id } }
      );

      if (!updateHotel) {
        throw {
          status: 500,
          message: "Something went wrong while updation of hotel!",
        };
      }

      successHandler(
        res,
        201,
        { hotel_name: hotel_name },
        "Hotel updated successfully."
      );
    } catch (e) {
      next(e);
    }
  };

  updateHotelsPicturesDetails = async (req, res, next) => {
    try {
      const { hotel, vendor } = req.details;

      console.log(req.body, "shshs");
      //!For single picture
      const singlePicture = req.hotel_Image;
      //!For multiple pictures
      const multiplePictures = req.hotel_Images;

      console.log(singlePicture, "sinle");
      console.log(multiplePictures, "multiple");
      const updateHotel = await HotelModel.update(
        {
          main_picture: singlePicture.secure_url,
        },
        { where: { hotel_id: hotel.hotel_id } }
      );

      if (!updateHotel) {
        throw {
          status: 500,
          message: "Something went wrong while updation of hotel!",
        };
      }

      const updateHotelPictures = await HotelPicturesModel.destroy({
        where: { hotel_id: hotel.hotel_id },
      });

      const hotelImages = multiplePictures.map(async (url) => {
        const hotelImag = await HotelPicturesModel.create({
          hotel_id: hotel.hotel_id,
          hotel_picture: url.secure_url,
        });
        return hotelImag;
      });

      const allImages = await Promise.all(hotelImages);

      successHandler(
        res,
        201,
        { hotel_name: hotel.hotel_name },
        "Hotel updated successfully!"
      );
    } catch (e) {
      next(e);
    }
  };

  getAllReviewsHotel = async (req, res, next) => {
    try {
      const { hotel } = req.details;
      const pageNumber = req.query.page || 1;
      const limit = 5;

      const offset = (pageNumber - 1) * limit;

      const queryParams = {
        offset,
        limit,
        where: { hotel_id: hotel.hotel_id },
      };

      const hotelReviews = await HotelReviewModel.findAll(queryParams);

      const allReviews = await Promise.all(
        hotelReviews.map(async (reviews) => {
          const user = await UserModel.findOne({
            where: { user_id: reviews.user_id },
          });
          return {
            review_id: reviews.hotel_review_id,
            ratings: reviews.ratings,
            title: reviews.title,
            content: reviews.content,
            createdAt: reviews.createdAt,
            user: {
              user_id: user.user_id,
              user_name: user.user_name,
              profile: user.profile_picture,
            },
          };
        })
      );

      const hotelReviewsCount = await HotelReviewModel.count({
        where: { hotel_id: hotel.hotel_id },
      });

      const reviewLists = {
        total: hotelReviewsCount,
        limit,
        allReviews,
      };

      successHandler(res, 200, reviewLists, "All reviews of hotel");
    } catch (e) {
      next(e);
    }
  };

  deleteReviewVendor = async (req, res, next) => {
    try {
      const { hotel } = req.details;
      const { review_id } = req.params;

      const review = await HotelReviewModel.findOne({
        where: { hotel_review_id: review_id, hotel_id: hotel.hotel_id },
      });

      if (!review) {
        throw { status: 404, message: "No review found!" };
      }

      const deleteReview = await HotelReviewModel.destroy({
        where: { hotel_review_id: review.hotel_review_id },
      });

      if (!deleteReview) {
        throw { status: 500, message: "Reviews not deleted" };
      }

      successHandler(res, 201, null, "Review deleted.");
    } catch (e) {
      next(e);
    }
  };

  getAllAdditionalServices = async (req, res, next) => {
    try {
      const { hotel, vendor } = req.details;

      const page = req.query.page;
      const limit = 8;
      const offset = (page - 1) * limit;

      const pageQuery = {
        where: { hotel_id: hotel.hotel_id },
        offset,
        limit,
      };

      const hotelServices = await Hotel_Additional_Services.findAll(pageQuery);

      const hotelServicesCount = await Hotel_Additional_Services.count({
        where: { hotel_id: hotel.hotel_id },
      });
      const details = {
        total: hotelServicesCount,
        limit,
        page,
        hotelServices,
      };
      successHandler(res, 200, details, "All additional Services!");
    } catch (e) {
      next(e);
    }
  };

  addHotelAdditionalServices = async (req, res, next) => {
    try {
      const { hotel } = req.details;
      const service = req.body;
      console.log(req.body);
      console.log(hotel);
      const hotelServices = await Hotel_Additional_Services.findOne({
        where: {
          service_name: service.service_name,
          hotel_id: hotel.hotel_id,
        },
      });

      if (hotelServices) {
        throw {
          status: 409,
          message: "The service already exists for this hotel!",
        };
      }

      const newService = await Hotel_Additional_Services.create({
        service_name: service.service_name,
        price: service.price,
        hotel_id: hotel.hotel_id,
      });

      if (!newService) {
        throw {
          status: 500,
          message: "Something went wrong while insertion of service!",
        };
      }

      successHandler(res, 201, null, "New service added successfully");
    } catch (e) {
      next(e);
    }
  };

  deleteAdditionalServices = async (req, res, next) => {
    try {
      const { hotel } = req.details;
      const { service_id } = req.params;

      const checkService = await Hotel_Additional_Services.findOne({
        where: { additional_services_id: service_id, hotel_id: hotel.hotel_id },
      });

      if (!checkService) {
        throw { status: 404, message: "Service not found!" };
      }
      const deleteService = await Hotel_Additional_Services.destroy({
        where: { additional_services_id: service_id, hotel_id: hotel.hotel_id },
      });

      if (!deleteService) {
        throw {
          status: 500,
          message: "Something went wrong on deletion of the service!",
        };
      }

      successHandler(
        res,
        201,
        null,
        "Additional Service deleted successfully!"
      );
    } catch (e) {
      next(e);
    }
  };

  updateServiceHotel = async (req, res, next) => {
    try {
      const { hotel } = req.details;
      const { service_name, price } = req.body;
      const { service_id } = req.params;
      console.log(req.body, "shshs");

      const checkService = await Hotel_Additional_Services.findOne({
        where: { hotel_id: hotel.hotel_id, additional_services_id: service_id },
      });

      if (!checkService) {
        throw {
          status: 404,
          message: "No service found!",
        };
      }
      const updateHotelService = await Hotel_Additional_Services.update(
        {
          service_name: service_name,
          price: price,
        },

        {
          where: {
            hotel_id: hotel.hotel_id,
            additional_services_id: service_id,
          },
        }
      );

      if (!updateHotelService) {
        throw {
          status: 500,
          message: "Something went wrong while updation of services!",
        };
      }

      successHandler(
        res,
        201,
        null,
        "Additional Service updated successfully!"
      );
    } catch (e) {
      next(e);
    }
  };

  updateBookingDetails = async (req, res, next) => {
    try {
      const { hotel } = req.details;
      const {
        booking_id,
        status,
        total_price,
        check_in_date,
        check_out_date,
        additionalServices,
      } = req.body;

      console.log(req.body, "shhs");
      const booking = await BookingModel.findOne({
        where: { booking_id: booking_id },
      });

      if (!booking) {
        throw { status: 404, message: "No booking details!" };
      }

      const updateBookings = await BookingModel.update(
        {
          status: status,
          total_price: total_price,
          check_in_date: check_in_date,
          check_out_date: check_out_date,
        },
        { where: { booking_id: booking_id } }
      );

      if (additionalServices.length > 0) {
        const deleteServices = await Bookings_Additional_Services.destroy({
          where: { booking_id: booking_id },
        });

        for (let i of additionalServices) {
          await Bookings_Additional_Services.create({
            booking_id: booking_id,
            additional_services_id: i.additional_services_id,
          });
        }
      }

      successHandler(res, 201, null, "Booking details updated successfylly.");
    } catch (e) {
      next(e);
    }
  };

  getAllAmenitiesHotel = async (req, res, next) => {
    try {
      const { hotel } = req.details;

      const hotelAmenities = hotel.hotel_amenities.map(
        (amenities) => amenities
      );

      successHandler(
        res,
        200,
        hotelAmenities,
        "These are the available hotel's amenities"
      );
    } catch (e) {
      next(e);
    }
  };

  addAmenitiesHotel = async (req, res, next) => {
    try {
      const { hotel } = req.details;
      const { amenity } = req.body;
      const checkAmenity = hotel.hotel_amenities.includes(amenity);

      if (checkAmenity) {
        throw { status: 404, message: "The amenity has already been added!" };
      } else {
        // Update the hotel_amenities field in the database
        await hotel.update(
          { hotel_amenities: [...hotel.hotel_amenities, amenity] },
          { where: { hotel_id: hotel.hotel_id } }
        );

        successHandler(res, 201, null, "New amenity successfully added.");
      }
    } catch (e) {
      next(e);
    }
  };

  deleteAmenityHotel = async (req, res, next) => {
    try {
      const { hotel } = req.details;
      const { amenity } = req.params;

      const rooms = await RoomModel.findAll({
        where: { hotel_id: hotel.hotel_id },
      });

      const roomsWithAmenity = rooms.filter((room) =>
        room.amenities.includes(amenity)
      );
      console.log(roomsWithAmenity, "ajaj");
      //!Removing from the rooms also array use garesi baula hune lol
      if (roomsWithAmenity.length > 0) {
        await Promise.all(
          roomsWithAmenity.map(async (room) => {
            room.amenities = room.amenities.filter((item) => item !== amenity);
            await room.save();
          })
        );
      }

      hotel.hotel_amenities = hotel.hotel_amenities.filter(
        (item) => item !== amenity
      );
      await hotel.save();

      successHandler(
        res,
        201,
        null,
        "Amenity successfully deleted from rooms and hotel."
      );
    } catch (e) {
      next(e);
    }
  };

  //!The old amenity have been used cuz the data is on an array not on a seperate table so yeah lol
  updateAmenityHotel = async (req, res, next) => {
    try {
      const { hotel } = req.details;
      const { oldAmenity, newAmenity } = req.body;

      const isOldAmenityAdded = hotel.hotel_amenities.includes(oldAmenity);

      if (isOldAmenityAdded) {
        hotel.hotel_amenities = hotel.hotel_amenities.map((item) =>
          item === oldAmenity ? newAmenity : item
        );
        await hotel.save();

        const rooms = await RoomModel.findAll({
          where: { hotel_id: hotel.hotel_id },
        });

        await Promise.all(
          rooms.map(async (room) => {
            if (room.amenities.includes(oldAmenity)) {
              room.amenities = room.amenities.map((item) =>
                item === oldAmenity ? newAmenity : item
              );
              await room.save(); // Save the updated room
            }
          })
        );

        successHandler(
          res,
          201,
          null,
          "Amenity updated successfully in both hotel and related rooms."
        );
      } else {
        throw { status: 404, message: "Old amenity not found in the hotel" };
      }
    } catch (e) {
      next(e);
    }
  };

  getAllFAQHotel = async (req, res, next) => {
    try {
      const { hotel } = req.details;
      const page = req.query.page || 1;
      const limit = 8;

      const offset = (page - 1) * limit;

      const FaqDetails = await FAQModel.findAll({
        offset,
        limit,
        order: [["faq_id", "ASC"]],
        where: { hotel_id: hotel.hotel_id },
      });

      const totalFAQ = await FAQModel.count({
        where: { hotel_id: hotel.hotel_id },
      });

      let faqDetails = {
        total: totalFAQ,
        limit: limit,
        FaqDetails,
      };

      successHandler(
        res,
        200,
        faqDetails,
        "These are the avaiable FAQ details!"
      );
    } catch (e) {
      next(e);
    }
  };

  addFAQVendor = async (req, res, next) => {
    try {
      const { hotel } = req.details;

      const { title, content } = req.body;

      const faq = await FAQModel.create({
        content: content,
        title: title,
        hotel_id: hotel.hotel_id,
      });

      successHandler(res, 201, null, "New FAQ added");
    } catch (e) {
      next(e);
    }
  };

  updateFAQVendor = async (req, res, next) => {
    try {
      const { hotel } = req.details;

      const { title, content } = req.body;
      const { faq_id } = req.params;
      const faq = await FAQModel.findOne({
        where: { faq_id: faq_id, hotel_id: hotel.hotel_id },
      });

      if (!faq) {
        throw { status: 404, message: "No faq found!" };
      }
      const updateFaq = await FAQModel.update(
        {
          content: content,
          title: title,
        },
        { where: { faq_id: faq_id } }
      );

      successHandler(res, 201, null, " FAQ updated successfully.");
    } catch (e) {
      next(e);
    }
  };

  deleteFAQVendor = async (req, res, next) => {
    try {
      const { hotel } = req.details;

      const { faq_id } = req.params;
      const faq = await FAQModel.findOne({
        where: { faq_id: faq_id, hotel_id: hotel.hotel_id },
      });

      if (!faq) {
        throw { status: 404, message: "No faq found!" };
      }
      const updateFaq = await FAQModel.destroy({ where: { faq_id: faq_id } });

      if (!updateFaq) {
        throw {
          status: 500,
          message: "Something went wrong the faq is not deleted!",
        };
      }
      successHandler(res, 201, null, "FAQ deleted successfully.");
    } catch (e) {
      next(e);
    }
  };
}

const vendorController = new VendorController();
module.exports = vendorController;
