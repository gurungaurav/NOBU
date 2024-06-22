import { lazy } from "react";
const GalleryMain = lazy(()=> import("../../pages/client/galleryMain"));
const Room = lazy(()=>import("../../pages/client/room")) ;
const MainHotelPage = lazy(()=>import("../../pages/client/mainHotel"))
const Reviews = lazy(()=>import("../../pages/client/reviews"))
const FilterRooms = lazy(()=> import("../../pages/client/filterRooms"))
const ContactUs = lazy(()=> import("../../pages/client/contactUs"))


//!Need to change
export const mainHotelRoutes = [
    {
        id:'mainHotel',
        path:'/mainHotel/:hotel_id',
        element: MainHotelPage,
        hasLayout:false,
        requiredAuth:false,
        hasMainHotelLayout:true
    },
    {
        id:'hotelRooms',
        path:'/mainHotel/:hotel_id/room/:room_id',
        element: Room,
        hasLayout:false,
        requiredAuth:false,
        hasMainHotelLayout:true
    },
    {
        id:'hotelReviews',
        path:'/mainHotel/:hotel_id/reviews',
        element: Reviews,
        hasLayout:false,
        requiredAuth:false,
        hasMainHotelLayout:true
    },
    {
        id:'FilterRooms',
        path:'/mainHotel/:hotel_id/filterRooms',
        element: FilterRooms,
        hasLayout:true,
        requiredAuth:true,
        hasAdminLayout:false,
        hasVendorLayout:false,
        requiredAdminAuth:false,
        requiredVendorAuth:false,
        hasMainHotelLayout:true
    },
    {
        id:'ContactUs',
        path:'/mainHotel/:hotel_id/contactUs',
        element: ContactUs,
        hasLayout:true,
        requiredAuth:true,
        hasAdminLayout:false,
        hasVendorLayout:false,
        requiredAdminAuth:false,
        requiredVendorAuth:false,
        hasMainHotelLayout:true
    },{
        id:'GalleryMain',
        path:'/mainHotel/:hotel_id/gallery',
        element: GalleryMain,
        hasLayout:true,
        requiredAuth:true,
        hasAdminLayout:false,
        hasVendorLayout:false,
        requiredAdminAuth:false,
        requiredVendorAuth:false,
        hasMainHotelLayout:true
    },

]