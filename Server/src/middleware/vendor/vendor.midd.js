const UserModel = require("../../model/client/user");
const AmenitiesModel = require("../../model/hotel/amenities");
const HotelModel = require("../../model/hotel/hotel");
const Filter = require("bad-words");
const RoomTypesModel = require("../../model/hotel/room_types");
const RoomModel = require("../../model/hotel/room");
const BedTypesModel = require("../../model/hotel/bed_types");
const filter = new Filter();

class VendorMiddleware {
  //? http://localhost:1000/api/nobu/vendor/addVendors/:user_id
  vendorRegistrationMidd = async (req, res, next) => {
    try {
      console.log(req);
      const {
        hotel_name,
        phone_number,
        description,
        location,
        ratings,
        email,
        amenities,
      } = req.body;
      // const amenities = JSON.parse(req.body.amenities);
      const user_id = req.params.user_id;

      console.log(amenities);

      //   const jsonArray = amenities.map(item => {
      //     // Remove the single quotes and add double quotes around keys and values
      //     const correctedItem = item.replace(/'/g, '"').replace(/(\w+):/g, '"$1":');
      //     // Parse the corrected string into JSON object
      //     return JSON.parse(correctedItem);
      // });

      for (let i = 0; i < amenities.length; i++) {
        if (filter.isProfane(amenities[i])) {
          throw {
            status: 400,
            message: "Please use appropriate amenity names!",
          };
        }
      }

      // for (let i = 0; i < room_types.length; i++) {
      //   if (filter.isProfane(room_types[i].type_name)) {
      //     throw {
      //       status: 400,
      //       message: "Please use appropriate room type names!",
      //     };
      //   }
      // }
      const checkHotelName = filter.isProfane(hotel_name);

      if (checkHotelName) {
        throw { status: 400, message: "Please use appropirate hotel name." };
      }

      const vendor = await UserModel.findOne({ where: { user_id: user_id } });

      if (!vendor) {
        throw { status: 404, message: "User not found." };
      }

      const hotel = await HotelModel.findOne({ where: { vendor_id: user_id } });

      const checkNameHotel = await HotelModel.findOne({
        where: { hotel_name: hotel_name },
      });

      if (checkNameHotel) {
        throw {
          status: 409,
          message: "The hotel name is already taken. Please use a new name.",
        };
      }

      req.vendor = {
        hotel_name,
        vendor_id: user_id,
        amenities,
        phone_number,
        description,
        location,
        ratings,
        email,
      };
      next();
    } catch (e) {
      next(e);
    }
  };

  //? http://localhost:1000/api/nobu/vendor/addRooms/:hotel_id
  hotelRoomRegistrationMidd = async (req, res, next) => {
    try {
      const {
        description,
        price_per_night,
        room_type,
        amenities,
        bed_types,
        room_no,
        floor,
      } = req.body;
      const vendor_id = req.params.vendor_id;

      console.log(req.body);

      // //!Need to remove qotes from the array because the form data sends text only and convert that text to json
      // const jsonArray = amenities.map((item) => {
      //   // Remove the single quotes and add double quotes around keys and values
      //   const correctedItem = item
      //     .replace(/'/g, '"')
      //     .replace(/(\w+):/g, '"$1":');
      //   // Parse the corrected string into JSON object
      //   return JSON.parse(correctedItem);
      // });

      const badDescription = filter.isProfane(description);

      if (badDescription) {
        throw {
          status: 400,
          message: "Please use appropriate words on description of the room!",
        };
      }

      const types = await RoomTypesModel.findOne({
        where: { type_name: room_type },
      });

      // if (!types) {
      //   throw { status: 404, message: "The room type is not available!!" };
      // }

      // const bedTypes = await BedTypes.({
      //   where:{type_name : bed_types.bed_types}
      // })
      console.log(bed_types);

      const checkBeds = await Promise.all(
        bed_types.map(async (beds) => {
          console.log(beds);
          const checkBed = await BedTypesModel.findOne({
            where: { type_name: beds },
          });
          return checkBed;
        })
      );
      console.log(bed_types);

      const vendor = await UserModel.findOne({ where: { user_id: vendor_id } });

      if (!vendor) {
        throw { status: 500, message: "No vendors found." };
      }

      const hotel = await HotelModel.findOne({
        where: { vendor_id: vendor.user_id },
      });

      if (!hotel) {
        throw { status: 404, message: "Hotel not registered yet." };
      }

      if (!hotel.hotel_verified) {
        throw {
          status: 400,
          message:
            "Your hotel hasn't been verified yet. Please wait for admin approval.",
        };
      }

      const checkRoom = await RoomModel.findOne({
        where: { room_no: room_no, hotel_id: hotel.hotel_id },
      });

      if (checkRoom) {
        throw {
          status: 409,
          message: "The room number has already been taken.",
        };
      }
      //!So at first amenities of hotel is checked and then the amenities are taken out to compare if the required selected
      //!Room amenities are available to that specific hotel or not and then it is procedded

      req.hotel = {
        hotel,
        description,
        price_per_night,
        types,
        amenities,
        checkBeds,
        room_no,
        floor,
      };
      next();
    } catch (e) {
      next(e);
    }
  };

  //?http://localhost:1000/api/nobu/vendor/deleteRooms/:room_id/:hotel_id
  deleteRoomsMidd = async (req, res, next) => {
    try {
      const { hotel } = req.details;
      const { room_id } = req.params;
      const room = await RoomModel.findOne({
        where: { hotel_id: hotel.hotel_id, room_id: room_id },
      });

      if (!room) {
        throw { status: 404, message: "No room found!" };
      }

      req.room = { hotel, room };
      next();
    } catch (e) {
      next(e);
    }
  };

  updateRoomsMidd = async (req, res, next) => {
    try {
      const {
        description,
        amenities,
        bed_types,
        room_type,
        price_per_night,
        room_no,
        floor,
      } = req.body;
      const { room_id } = req.params;
      console.log(req.body, "jajja");
      const { hotel, vendor } = req.details;

      const room = await RoomModel.findOne({
        where: { room_id: room_id, hotel_id: hotel.hotel_id },
      });

      if (!room) {
        throw { status: 404, message: "No room found!" };
      }

      req.hotelRoom = {
        room,
        hotel,
        amenities,
        bed_types,
        room_type,
        description,
        price_per_night,
        room_no,
        floor,
      };
      next();
    } catch (e) {
      next(e);
    }
  };

  getRoomMidd = async (req, res, next) => {
    try {
      const { room_id } = req.params;
      const { hotel } = req.details;

      const room = await RoomModel.findOne({
        where: { room_id: room_id, hotel_id: hotel.hotel_id },
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
}

const vendorMidd = new VendorMiddleware();
module.exports = vendorMidd;
