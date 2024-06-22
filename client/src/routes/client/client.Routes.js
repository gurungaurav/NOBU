import { lazy } from "react";
const UpdateBlogs = lazy(() => import("../../pages/client/editBlogs"));
const TermsConditions = lazy(() =>
  import("../../pages/client/termsConditions")
);
const SpecificBookingDetailsClient = lazy(() =>
  import("../../pages/client/bookingsSpecificDetails")
);
const NotificationsUser = lazy(() =>
  import("../../pages/client/notificationsUser")
);
const SpecificBookingHistory = lazy(() =>
  import("../../pages/client/specificBookingHistory")
);
const BookingProcess = lazy(() => import("../../pages/client/bookingProcess"));
const ListYourHotelMain = lazy(() =>
  import("../../pages/client/listYourHotelMain")
);
const UsersHistory = lazy(() => import("../../pages/client/usersHistory"));
const Profile = lazy(() => import("../../pages/client/profile"));
const Home = lazy(() => import("../../pages/client/home"));
const Blogs = lazy(() => import("../../pages/client/blogs"));
const SpecificBlogs = lazy(() => import("../../pages/client/specificBlogs"));
const FilterRooms = lazy(() => import("../../pages/client/filterRooms"));
const FilterHotels = lazy(() => import("../../pages/client/filterHotels"));
const PostBlogs = lazy(() => import("../../pages/client/postBlogs"));
const EditProfile = lazy(() => import("../../pages/client/editProfile"));
const EditPassword = lazy(() => import("../../pages/client/editPassword"));

export const clientRoutes = [
  {
    id: "home",
    path: "/",
    element: Home,
    hasLayout: false,
    requiredAuth: false,
    hasAdminLayout: false,
    hasVendorLayout: false,
    requiredAdminAuth: false,
    requiredVendorAuth: false,
  },

  {
    id: "profile",
    path: "/profile/:user_id",
    element: Profile,
    hasLayout: true,
    requiredAuth: true,
    requiredProfileAuth: true,
  },
  {
    id: "EditProfile",
    path: "/profile/:user_id/editProfile",
    element: EditProfile,
    hasLayout: true,
    requiredAuth: true,
    requiredProfileAuth: true,
  },
  {
    id: "EditPassword",
    path: "/profile/:user_id/editPassword",
    element: EditPassword,
    hasLayout: true,
    requiredAuth: true,
    requiredProfileAuth: true,
  },

  {
    id: "blogs",
    path: "/blogs",
    element: Blogs,
    hasLayout: true,
    requiredAuth: true,
  },
  {
    id: "specificBlogs",
    path: "/blogs/:blog_id",
    element: SpecificBlogs,
    hasLayout: true,
    requiredAuth: true,
  },
  {
    id: "FilterRooms",
    path: "/filterHotels",
    element: FilterHotels,
    hasLayout: true,
    requiredAuth: true,
  },
  {
    id: "PostBlogs",
    path: "/blogs/postBlogs",
    element: PostBlogs,
    hasLayout: true,
    requiredAuth: true,
  },
  {
    id: "terms",
    path: "/terms-conditions",
    element: TermsConditions,
    hasLayout: true,
    requiredAuth: true,
  },
  {
    id: "usersHistory",
    path: "/userHistory",
    element: UsersHistory,
    hasLayout: true,
    requiredAuth: true,
  },
  {
    id: "listYourProperty",
    path: "/listYourProperty",
    element: ListYourHotelMain,
    hasLayout: true,
    requiredAuth: true,
  },
  {
    id: "bookingProcess",
    path: "/mainHotel/:hotel_id/room/:room_id/bookingProcess",
    element: BookingProcess,
    hasLayout: true,
    requiredAuth: true,
  },
  {
    id: "bookingsDetails",
    path: "/userHistory/:booking_id",
    element: SpecificBookingHistory,
    hasLayout: true,
    requiredAuth: true,
  },
  {
    id: "notifications",
    path: "/userNotifications",
    element: NotificationsUser,
    hasLayout: true,
    requiredAuth: true,
  },
  {
    id: "bookingDetails",
    path: "/mainHotel/:hotel_id/specificBookingDetails/:booking_id",
    element: SpecificBookingDetailsClient,
    hasLayout: true,
    requiredAuth: true,
  },
  {
    id: "bookingDetails",
    path: "/blogs/updateBlogs/:blogId",
    element: UpdateBlogs,
    hasLayout: true,
    requiredAuth: true,
  },
];
