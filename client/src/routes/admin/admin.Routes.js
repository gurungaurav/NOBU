import { lazy } from "react";
const AdminHotelSpecificHotel = lazy(() =>
  import("../../pages/admin/adminHotelSpecificDetails")
);
const AdminAllTransactions = lazy(() =>
  import("../../pages/admin/adminAllTransactions")
);
const MainChatAdmin = lazy(() => import("../../pages/admin/mainChatAdmin"));
const AdminSupportChatLists = lazy(() =>
  import("../../pages/admin/adminSupportChatLists")
);
const AdminBlogsLists = lazy(() => import("../../pages/admin/adminBlogsLists"));
const UsersLists = lazy(() => import("../../pages/admin/userLists"));

const AdminRoomBedsList = lazy(() =>
  import("../../pages/admin/adminAllBedTypes")
);
const AdminAmenitiesList = lazy(() =>
  import("../../pages/admin/adminAmenitiesList")
);
const AdminVerifyVendorsLists = lazy(() =>
  import("../../pages/admin/adminVerifyVendorLists")
);
// import AdminVerifyVendors from ;
const AdminVerifyVendors = lazy(() =>
  import("../../pages/admin/adminVerifyVendors")
);
const AdminAllLists = lazy(() => import("../../pages/admin/adminAllLists"));
const AdminDash = lazy(() => import("../../pages/admin/adminDash"));

export const adminRoutes = [
  {
    id: "adminDash",
    path: "/admin/:admin_id/adminDash",
    element: AdminDash,
    hasLayout: true,
    requiredAdminAuth: true,
    hasAdminLayout: true,
    hasVendorLayout: false,
    requiredVendorAuth: false,
  },
  {
    id: "verifyVendors",
    path: "/admin/:admin_id/verifyVendors/:hotel_id",
    element: AdminVerifyVendors,
    hasLayout: true,
    requiredAdminAuth: true,
    hasAdminLayout: true,
    hasVendorLayout: false,
    requiredVendorAuth: false,
  },
  {
    id: "verifyVendorsLists",
    path: "/admin/:admin_id/verifyVendorsLists",
    element: AdminVerifyVendorsLists,
    hasLayout: true,
    requiredAdminAuth: true,
    hasAdminLayout: true,
    hasVendorLayout: false,
    requiredVendorAuth: false,
  },
  {
    id: "allLists",
    path: "/admin/:admin_id/allHotels",
    element: AdminAllLists,
    hasLayout: true,
    requiredAdminAuth: true,
    hasAdminLayout: true,
    hasVendorLayout: false,
    requiredVendorAuth: false,
  },
  {
    id: "allAmenities",
    path: "/admin/:admin_id/allAmenities",
    element: AdminAmenitiesList,
    hasLayout: true,
    requiredAdminAuth: true,
    hasAdminLayout: true,
    hasVendorLayout: false,
    requiredVendorAuth: false,
  },
  {
    id: "allAmenities",
    path: "/admin/:admin_id/allBedTypes",
    element: AdminRoomBedsList,
    hasLayout: true,
    requiredAdminAuth: true,
    hasAdminLayout: true,
    hasVendorLayout: false,
    requiredVendorAuth: false,
  },
  {
    id: "allUsers",
    path: "/admin/:admin_id/allUsers",
    element: UsersLists,
    hasLayout: true,
    requiredAdminAuth: true,
    hasAdminLayout: true,
    hasVendorLayout: false,
    requiredVendorAuth: false,
  },
  {
    id: "allBlogs",
    path: "/admin/:admin_id/blogLists",
    element: AdminBlogsLists,
    hasLayout: true,
    requiredAdminAuth: true,
    hasAdminLayout: true,
    hasVendorLayout: false,
    requiredVendorAuth: false,
  },
  {
    id: "allBlogs",
    path: "/admin/:admin_id/allTransactions",
    element: AdminAllTransactions,
    hasLayout: true,
    requiredAdminAuth: true,
    hasAdminLayout: true,
    hasVendorLayout: false,
    requiredVendorAuth: false,
  },
  {
    id: "hotelDetails",
    path: "/admin/:admin_id/hotelDetails/:hotel_id",
    element: AdminHotelSpecificHotel,
    hasLayout: true,
    requiredAdminAuth: true,
    hasAdminLayout: true,
    hasVendorLayout: false,
    requiredVendorAuth: false,
  },
  {
    id: "allChats",
    path: "/supportChatLists",
    element: AdminSupportChatLists,
    hasLayout: true,
    // requiredAdminAuth: true,
    hasChatLayout: true,
    // requiredVendorAuth: true,
  },
  {
    id: "specificChats",
    path: "/supportChatLists/chat/:chat_id",
    element: MainChatAdmin,
    hasLayout: true,
    // requiredAdminAuth: true,
    hasChatLayout: true,

    // requiredVendorAuth: true,
  },
];
