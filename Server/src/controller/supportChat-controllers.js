const SupportChatModel = require("../model/chat/supportChat");
const SupportChatRoomModel = require("../model/chat/supportChatRoom");
const UserModel = require("../model/client/user");
const successHandler = require("../utils/handler/successHandler");

const getAllSupportChats = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findOne({ where: { user_id: id } });

    if (!user) {
      throw { status: 404, message: "No user found!" };
    }

    if (user.roles === "admin") {
      const supportChatRooms = await SupportChatRoomModel.findAll({
        where: { admin_id: user.user_id },
      });
      console.log(supportChatRooms, "chats");
      const chatDetails = await Promise.all(
        supportChatRooms.map(async (room) => {
          const oldestMessage = await SupportChatModel.findOne({
            where: { support_chat_room_id: room.support_chat_room_id },
            order: [["createdAt", "ASC"]],
          });

          const user = await UserModel.findOne({
            where: { user_id: room.vendor_id },
          });
          const totalChats = await SupportChatModel.count({
            where: { support_chat_room_id: room.support_chat_room_id },
          });
          return {
            support_chat_room_id: room.support_chat_room_id,
            title: room.title,
            status: room.status,
            createdAt: room.createdAt,
            user: {
              user_id: user.user_id,
              user_name: user.user_name,
              profile: user.profile,
            },
            message: oldestMessage.message,
            totalChats,
          };
        })
      );
      return successHandler(
        res,
        200,
        chatDetails,
        "These are the available chats"
      );
    } else {
      const supportChatRooms = await SupportChatRoomModel.findAll({
        where: { vendor_id: user.user_id },
      });
      const chatDetails = await Promise.all(
        supportChatRooms.map(async (room) => {
          const oldestMessage = await SupportChatModel.findOne({
            where: { support_chat_room_id: room.support_chat_room_id },
            order: [["createdAt", "ASC"]],
          });
          const user = await UserModel.findOne({
            where: { user_id: room.vendor_id },
          });
          const totalChats = await SupportChatModel.count({
            where: { support_chat_room_id: room.support_chat_room_id },
          });
          return {
            support_chat_room_id: room.support_chat_room_id,
            title: room.title,
            status: room.status,
            createdAt: room.createdAt,
            user: {
              user_id: user.user_id,
              user_name: user.user_name,
              profile: user.profile,
            },
            message: oldestMessage.message,
            totalChats,
          };
        })
      );
      return successHandler(
        res,
        200,
        chatDetails,
        "These are the available chats"
      );
    }
  } catch (e) {
    next(e);
  }
};

const postNewChat = async (req, res, next) => {
  try {
    const { title, message } = req.body;

    const { id } = req.params;

    const vendor = await UserModel.findOne({ where: { user_id: id } });

    if (!vendor) {
      throw { status: 404, message: "No vendor found." };
    }

    const admin = await UserModel.findOne({ where: { roles: "admin" } });

    const createNewChat = await SupportChatRoomModel.create({
      vendor_id: vendor.user_id,
      admin_id: admin.user_id,
      title: title,
    });

    console.log(createNewChat, "ahah");
    const newMessage = await SupportChatModel.create({
      support_chat_room_id: createNewChat.support_chat_room_id,
      sender_id: vendor.user_id,
      message: message,
    });

    successHandler(res, 201, null, "Chat posted successfully!");
  } catch (e) {
    next(e);
  }
};

const addNewMessage = async (req, res, next) => {
  try {
    const { room_id, sender_id } = req.params;
    const { message } = req.body;

    const support_room = await SupportChatRoomModel.findOne({
      where: { support_chat_room_id: room_id },
    });

    if (!support_room) {
      throw { status: 404, message: "No room found." };
    }

    const sender = await UserModel.findOne({ where: { user_id: sender_id } });

    if (!sender) {
      throw { status: 404, message: "No sender found." };
    }

    const newMessage = await SupportChatModel.create({
      support_chat_room_id: support_room.support_chat_room_id,
      sender_id: sender.user_id,
      message: message,
    });

    const admin = await UserModel.findOne({
      where: { user_id: support_room.admin_id },
    });

    const vendor = await UserModel.findOne({
      where: { user_id: support_room.vendor_id },
    });

    const chat = {
      support_chat_room_id: support_room.chat_room_id,
      sender: {
        sender_id: newMessage.dataValues.sender_id,
        message: newMessage.dataValues.message,
        createdAt: newMessage.dataValues.createdAt,
      },
      admin: {
        admin_id: admin.user_id,
        admin_name: admin.user_name,
        picture: admin.profile_picture,
      },
      vendor: {
        vendor: vendor.user_id,
        vendor_name: vendor.user_name,
        picture: vendor.profile_picture,
      },
    };

    successHandler(res, 201, chat, "New chat added.");
  } catch (e) {
    next(e);
  }
};

const getAllSupportChatMessages = async (req, res, next) => {
  try {
    const { room_id } = req.params;

    const findChatRoom = await SupportChatRoomModel.findOne({
      where: {
        support_chat_room_id: room_id,
      },
    });

    const findChats = await SupportChatModel.findAll({
      where: { support_chat_room_id: findChatRoom.support_chat_room_id },
    });

    const vendor = await UserModel.findOne({
      where: { user_id: findChatRoom.vendor_id },
    });
    const admin = await UserModel.findOne({
      where: { user_id: findChatRoom.admin_id },
    });

    const chat = findChats.map((message) => {
      return {
        sender: {
          sender_id: message.sender_id,
          message: message.message,
          createdAt: message.createdAt,
        },
        admin: {
          admin_id: admin.user_id,
          admin_name: admin.user_name,
          picture: admin.profile_picture,
        },
        vendor: {
          vendor: vendor.user_id,
          vendor_name: vendor.user_name,
          picture: vendor.profile_picture,
        },
      };
    });

    const chatDetails = {
      support_chat_room_id: findChatRoom.support_chat_room_id,
      status: findChatRoom.status,
      title: findChatRoom.title,
      chat,
    };

    successHandler(res, 200, chatDetails, "All chat details.");
  } catch (e) {
    next(e);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { room_id } = req.params;

    const findChatRoom = await SupportChatRoomModel.findOne({
      where: {
        support_chat_room_id: room_id,
      },
    });

    if (!findChatRoom) {
      throw { status: 404, message: "No room found." };
    }

    const updateRoom = await SupportChatRoomModel.update(
      { status: "finished" },
      { where: { support_chat_room_id: findChatRoom.support_chat_room_id } }
    );

    successHandler(res, 201, null, "Task finished");
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAllSupportChats,
  postNewChat,
  addNewMessage,
  getAllSupportChatMessages,
  updateStatus,
};
