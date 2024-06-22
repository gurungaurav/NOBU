import { lazy } from "react";
const VendorFAQ = lazy(() => import("../../pages/vendor/vendorFAQ"));
const VendorAllAmenitiesList = lazy(() =>
  import("../../pages/vendor/vendorAllAmenitiesLists")
);
const VendorAdditionalServicesLists = lazy(() =>
  import("../../pages/vendor/additional_Services")
);
const ReviewsList = lazy(() => import("../../pages/vendor/reviewsList"));
const EditHotelPictures = lazy(() =>
  import("../../pages/vendor/updateHotelPictures")
);
const EditHotel = lazy(() => import("../../pages/vendor/updateHotel"));
const VendorSettings = lazy(() => import("../../pages/vendor/vendorSettings"));
const SpecificBookingDetails = lazy(() =>
  import("../../pages/vendor/specificBookingDetails")
);
const AllTransactions = lazy(() =>
  import("../../pages/vendor/allTransactions")
);
const GuestDetails = lazy(() => import("../../pages/vendor/guestDetails"));
const GuestsLists = lazy(() => import("../../pages/vendor/guestsLists"));
const BookingsLists = lazy(() => import("../../pages/vendor/bookingsLists"));
const VendorHelpSupport = lazy(() =>
  import("../../pages/vendor/vendorHelpSupport")
);
const EditRooms = lazy(() => import("../../pages/vendor/editRooms"));
const SpecificRoomDetails = lazy(() =>
  import("../../pages/vendor/specificRoomDetails")
);
const VendorRoomsLists = lazy(() =>
  import("../../pages/vendor/vendorRoomsLists")
);
const VendorDashBoard = lazy(() => import("../../pages/vendor/vendorDash"));
const VendorAddRooms = lazy(() => import("../../pages/vendor/vendorAddRooms"));

export const vendorRoutes = [
  //!Need to put the id of the vendors on to the url
  {
    id: "vendor",
    path: "/vendor/:hotel_name/vendorDashboard",
    element: VendorDashBoard,
    hasLayout: true,
    hasVendorLayout: true,
    requiredVendorAuth: true,
  },

  {
    id: "vendorAddRooms",
    path: "/vendor/:hotel_name/addRooms",
    element: VendorAddRooms,
    hasLayout: true,
    hasVendorLayout: true,
    requiredVendorAuth: true,
  },
  {
    id: "vendorRoomLists",
    path: "/vendor/:hotel_name/roomLists",
    element: VendorRoomsLists,
    hasLayout: true,
    hasVendorLayout: true,
    requiredVendorAuth: true,
  },
  {
    id: "specificRoomVendor",
    path: "/vendor/:hotel_name/roomLists/room/:room_id",
    element: SpecificRoomDetails,
    hasLayout: true,
    hasVendorLayout: true,
    requiredVendorAuth: true,
  },
  {
    id: "editRooms",
    path: "/vendor/:hotel_name/roomLists/room/:room_id/editRoom",
    element: EditRooms,
    hasLayout: true,
    hasVendorLayout: true,
    requiredVendorAuth: true,
  },
  {
    id: "helpSupport",
    path: "/vendor/:hotel_name/helpSupport",
    element: VendorHelpSupport,
    hasLayout: true,
    hasVendorLayout: true,
    requiredVendorAuth: true,
  },
  {
    id: "editRooms",
    path: "/vendor/:hotel_name/bookingLists",
    element: BookingsLists,
    hasLayout: true,
    hasVendorLayout: true,
    requiredVendorAuth: true,
  },
  {
    id: "guestsList",
    path: "/vendor/:hotel_name/guestsLists",
    element: GuestsLists,
    hasLayout: true,
    hasVendorLayout: true,
    requiredVendorAuth: true,
  },
  {
    id: "guestDetails",
    path: "/vendor/:hotel_name/guestsLists/guestDetails/:user_id",
    element: GuestDetails,
    hasLayout: true,
    hasVendorLayout: true,
    requiredVendorAuth: true,
  },
  {
    id: "allTransactions",
    path: "/vendor/:hotel_name/paymentLists",
    element: AllTransactions,
    hasLayout: true,
    hasVendorLayout: true,
    requiredVendorAuth: true,
  },
  {
    id: "bookingDetail",
    path: "/vendor/:hotel_name/bookingLists/:booking_id",
    element: SpecificBookingDetails,
    hasLayout: true,
    hasVendorLayout: true,
    requiredVendorAuth: true,
  },
  {
    id: "vendorSeetings",
    path: "/vendor/:hotel_name/settings",
    element: VendorSettings,
    hasLayout: true,
    hasVendorLayout: true,
    requiredVendorAuth: true,
  },
  {
    id: "updateHotel",
    path: "/vendor/:hotel_name/updateHotel",
    element: EditHotel,
    hasLayout: true,
    hasVendorLayout: true,
    requiredVendorAuth: true,
  },
  {
    id: "updateHotel",
    path: "/vendor/:hotel_name/updateHotelPictures",
    element: EditHotelPictures,
    hasLayout: true,
    hasVendorLayout: true,
    requiredVendorAuth: true,
  },
  {
    id: "updateHotel",
    path: "/vendor/:hotel_name/reviewsLists",
    element: ReviewsList,
    hasLayout: true,
    hasVendorLayout: true,
    requiredVendorAuth: true,
  },
  {
    id: "updateHotel",
    path: "/vendor/:hotel_name/additionalServices",
    element: VendorAdditionalServicesLists,
    hasLayout: true,
    hasVendorLayout: true,
    requiredVendorAuth: true,
  },
  {
    id: "allAmenities",
    path: "/vendor/:hotel_name/allAmenities",
    element: VendorAllAmenitiesList,
    hasLayout: true,
    hasVendorLayout: true,
    requiredVendorAuth: true,
  },
  {
    id: "allFAQ",
    path: "/vendor/:hotel_name/allFAQHotel",
    element: VendorFAQ,
    hasLayout: true,
    hasVendorLayout: true,
    requiredVendorAuth: true,
  },
];
