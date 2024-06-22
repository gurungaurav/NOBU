const express = require("express");
const {
  getAllSupportChats,
  postNewChat,
  addNewMessage,
  getAllSupportChatMessages,
  updateStatus,
} = require("../../controller/supportChat-controllers");

const supportRoutes = express.Router();

supportRoutes.get("/getAllSupportChats/:id", getAllSupportChats);
supportRoutes.post("/postChat/:id", postNewChat);
supportRoutes.get("/getAllSupportMessages/:room_id", getAllSupportChatMessages);

supportRoutes.post("/postNewMessage/:room_id/:sender_id", addNewMessage);
supportRoutes.patch("/updateSupportRoomStatus/:room_id", updateStatus);

module.exports = supportRoutes;
