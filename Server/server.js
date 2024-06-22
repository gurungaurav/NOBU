//!COnfigs
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mainRoutes = require("./src/routes/main/main.routes");
const sequelize = require("./src/config/dbConfig");
const errorHandlerMidd = require("./src/middleware/error/errorHanldeMidd");
const error404Midd = require("./src/middleware/error/error404Midd");
const OtpModel = require("./src/model/client/otp");
const UserModel = require("./src/model/client/user");
const BlogModel = require("./src/model/blogs/blog");
const TokenModel = require("./src/model/client/token");
const BlogCommentModel = require("./src/model/blogs/blog_comments");
const BlogTagsModel = require("./src/model/blogs/blog_tags");
const BlogLikesModel = require("./src/model/blogs/blog_likes");
const RoomModel = require("./src/model/hotel/room");
const RoomPicturesModel = require("./src/model/hotel/room_pictures");
const RoomTypesModel = require("./src/model/hotel/room_types");
const HotelPicturesModel = require("./src/model/hotel/hotel_pictures");
const AmenitiesModel = require("./src/model/hotel/amenities");
const BookMarkModel = require("./src/model/hotel/bookmarks");
const HotelReviewModel = require("./src/model/hotel/hotel_reviews");
const HotelModel = require("./src/model/hotel/hotel");
const ChatModel = require("./src/model/chat/chat");
const TransactionModel = require("./src/model/client/transactions");
const PaymentModel = require("./src/model/client/payment");
const ChatRoomModel = require("./src/model/chat/room");
const RoomBedsModel = require("./src/model/hotel/room_beds");
const http = require("http");
const { setupSocket } = require("./src/socket.io/messenger");
const NotificationModel = require("./src/model/client/notifications");
const Hotel_Additional_Services = require("./src/model/hotel/hotel_additional_services");
const Bookings_Additional_Services = require("./src/model/client/booking_additional_services");
const SupportChatModel = require("./src/model/chat/supportChat");
const SupportChatRoomModel = require("./src/model/chat/supportChatRoom");
const FAQModel = require("./src/model/hotel/faq");

// const cron = require("./src/node-cron/node.cron");

dotenv.config();

//! Then after that filtering section will be shown of hotels to search for amenities and their choices and then after selecting
//! A specific hotel they now can again filter out the rooms according to its choice for amenities or checking for its availability

//!So in validation only the forms validation will be checked and then will be passed to middleware
//!Where there will be checked if user exists, authorizations etc okay..

//!Declaration
const port = process.env.PORT;
const front_Port = process.env.FRONT_PORT;
const app = express();

//!Socket setup
const server = http.createServer(app);
setupSocket(server);

//!Middlewares
app.use(cors(front_Port));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(express.urlencoded({ extended: true }));

// cron.schedule("* * * * * ", () => {
//   console.log("This task will run every second.");
// });

//!Routes
app.use("/api/nobu", mainRoutes);

//!These middlewares are used after routes because when an error is thrown these middlewares catches the error
app.use(error404Midd);
app.use(errorHandlerMidd);

sequelize.sync().then(() => {
  server.listen(port, () => {
    console.log(`Connected to ${port}`);
  });
});
