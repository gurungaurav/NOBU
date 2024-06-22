const express = require("express");
const axios = require("axios");
const userRoutes = require("../client/user.routes");
const blogRoutes = require("../blogs/blog.routes");
const vendorRoutes = require("../vendor/vendor.routes");
const adminRoutes = require("../admin/admin.routes");
const ChatRoomModel = require("../../model/chat/room");
const ChatModel = require("../../model/chat/chat");
const successHandler = require("../../utils/handler/successHandler");
const supportRoutes = require("../socket/support.routes");

const mainRoutes = express.Router({ mergeParams: true });

mainRoutes.use("/user", userRoutes);
mainRoutes.use("/blog", blogRoutes);
mainRoutes.use("/vendor", vendorRoutes);
mainRoutes.use("/admin", adminRoutes);
mainRoutes.use("/support", supportRoutes);

//!Will implement later on when i will make the ui
mainRoutes.use("/chat/:user_id/:vendor_id", async (req, res, next) => {
  try {
    const { user_id, vendor_id } = req.params;
    const { sender_id, message } = req.body;

    const chatRoom = await ChatRoomModel.findOne({
      where: { user_1: vendor_id, user_2: user_id },
    });

    const room = chatRoom
      ? chatRoom
      : await ChatRoomModel.create({ user_1: vendor_id, user_2: user_id });

    const chat = await ChatModel.create({
      sender_id,
      message,
      chat_room_id: room.chat_room_id,
    });

    successHandler(res, 201, { room, chat }, "Message sent");
  } catch (e) {
    next(e);
  }
});

mainRoutes.post("/khalti-api", async (req, res, next) => {
  let data = {
    token: "QUao9cqFzxPgvWJNi9aKac",
    amount: 1000,
  };

  let config = {
    headers: {
      Authorization: "Key test_secret_key_ce2cdff0070e4c219415c1b28cbb2b65",
    },
  };

  axios
    .post("https://khalti.com/api/v2/payment/verify/", data, config)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});
// Khalti Payment API route
mainRoutes.post("/khalti-api", async (req, res, next) => {
  try {
    const khaltiCredentials = {
      khaltiMerchantID: "YOUR_MERCHANT_ID",
      khaltiSecretKey: "YOUR_SECRET_KEY",
    };

    const paymentData = {
      amount: 1000,
      productIdentity: "1234567890",
      productName: "Product Name",
      productUrl: "http://yourwebsite.com/product-url",
    };

    const config = {
      headers: {
        Authorization: `Key ${khaltiCredentials.khaltiSecretKey}`,
        "Content-Type": "application/json",
        token: khaltiCredentials.khaltiMerchantID,
      },
    };

    const khaltiResponse = await axios.post(
      "https://khalti.com/api/v2/payment/verify/",
      paymentData,
      config
    );

    // Handle Khalti response here
    console.log("Payment successful:", khaltiResponse.data);
    res
      .status(200)
      .json({ message: "Payment successful", data: khaltiResponse.data });
  } catch (error) {
    console.error("Payment failed:", error.response.data);
    res
      .status(500)
      .json({ message: "Payment failed", error: error.response.data });
  }
});

module.exports = mainRoutes;
