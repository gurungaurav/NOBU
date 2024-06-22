const { Server } = require("socket.io");
const UserModel = require("../model/client/user");
const ChatRoomModel = require("../model/chat/room");
const HotelModel = require("../model/hotel/hotel");
const ChatModel = require("../model/chat/chat");
const successHandler = require("../utils/handler/successHandler");

const setupSocket = (server) => {
  try {
    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: "http://localhost:3000",
      },
    });

    io.on("connection", (socket) => {
      console.log("User connected");
      //!To check if the room and user has already a room
      socket.on("checkRoom", async (room) => {
        try {
          //!So the logic is ofc the  user starts the conversation with the vendor so when the first mount is done of the component
          //? Then the new room is made as its obvious that the user has made the conversation first cuz the vendor can't see the
          //? Chat creation the chat shows up with the user after the user has created it so the user is identified by that and then created a room
          console.log(room);
          const vendorHotel = await HotelModel.findOne({
            where: { hotel_id: room.vendor },
          });
          const vendor = await UserModel.findOne({
            where: { user_id: vendorHotel.vendor_id },
          });

          const checkRooms = await ChatRoomModel.findOne({
            where: { vendor_id: vendor.user_id, user_id: room.user },
          });

          if (!checkRooms) {
            const makeRoom = await ChatRoomModel.create({
              vendor_id: vendor.user_id,
              user_id: room.user,
            });
            let user_id = makeRoom.dataValues.user_id;
            let vendor_id = makeRoom.dataValues.vendor_id;
            return io.emit("roomUsers", {
              user: user_id,
              vendor: vendor_id,
            });
          }
          let user_id = checkRooms.user_id;
          let vendor_id = checkRooms.vendor_id;
          return io.emit("roomUsers", {
            user: user_id,
            vendor: vendor_id,
          });
        } catch (error) {
          console.error("Error:", error);
        }
      });

      socket.on("messages", async (message) => {
        console.log(message, "hdhdhdhdhhd");
        // const vendor = await UserModel.findOne({
        //   where: { user_id: room.vendor },
        // });
        const user_idd = message.user;
        const vendor_idd = message.vendor;
        const searchRoom = await ChatRoomModel.findOne({
          where: {
            vendor_id: vendor_idd,
            user_id: user_idd,
          },
        });

        console.log(searchRoom, "heheheh");

        const createChat = await ChatModel.create({
          sender_id: message.sender,
          chat_room_id: searchRoom.chat_room_id,
          message: message.message,
        });
        const hotel = await HotelModel.findOne({
          where: { vendor_id: message.vendor },
        });
        const user = await UserModel.findOne({
          where: { user_id: message.user },
        });

        const chat = {
          chat_room_id: searchRoom.chat_room_id,
          sender: {
            sender_id: createChat.dataValues.sender_id,
            message: createChat.dataValues.message,
            createdAt: createChat.dataValues.createdAt,
          },
          hotel: {
            hotel_id: hotel.hotel_id,
            vendor_id: hotel.vendor_id,
            hotel_name: hotel.hotel_name,
            picture: hotel.main_picture,
          },
          user: {
            user_id: user.user_id,
            user_name: user.user_name,
            picture: user.profile_picture,
          },
        };

        io.emit("receiveMessage", chat);
        console.log(createChat, "created");
      });
    });
  } catch (e) {
    console.log(e);
  }
};

const getAllChats = async (req, res, next) => {
  try {
    const { vendor_id, user_id } = req.params;

    const findChatRoom = await ChatRoomModel.findOne({
      where: {
        vendor_id: vendor_id,
        user_id: user_id,
      },
    });

    const findChats = await ChatModel.findAll({
      where: { chat_room_id: findChatRoom.chat_room_id },
    });

    const hotel = await HotelModel.findOne({ where: { vendor_id: vendor_id } });
    const user = await UserModel.findOne({ where: { user_id: user_id } });

    const chat = findChats.map((message) => {
      return {
        chat_room_id: message.chat_room_id,
        sender: {
          sender_id: message.sender_id,
          message: message.message,
          createdAt: message.createdAt,
        },
        hotel: {
          hotel_id: hotel.hotel_id,
          vendor_id: hotel.vendor_id,
          hotel_name: hotel.hotel_name,
          picture: hotel.main_picture,
        },
        user: {
          user_id: user.user_id,
          user_name: user.user_name,
          picture: user.profile_picture,
        },
      };
    });

    successHandler(res, 200, chat, "These are the chats");
  } catch (e) {
    next(e);
  }
};

module.exports = { setupSocket, getAllChats };
