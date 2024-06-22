import { http } from "../userMain";

export const getAllHotels = () => {
  const res = http.get("/user/getUser/allHotels");
  return res;
};

export const getRooms = () => {
  const res = http.get("/user/getUser/allRooms/:hotel_id");
  return res;
};

export const getHotelByHotelId = (hotel_id) => {
  const res = http.get(`/user/getUser/checkHotel/${hotel_id}`);
  return res;
};
export const getSingleHotel = (hotel_id) => {
  const res = http.get(`/user/getUser/mainHotel/${hotel_id}`);
  return res;
};

export const getSingleRoomDetails = (hotel_id, room_id) => {
  const res = http.get(
    `/user/getUser/getSingleRoomById/${hotel_id}/${room_id}`
  );
  return res;
};

export const sendContactUsMail = (hotel_id, form, jwt) => {
  const res = http.post(`/user/contactUs/sendMail/${hotel_id}`, form, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res;
};

export const bookRooms = (user_id, room_id, jwt, bookingDetails) => {
  const res = http.post(
    `/user/bookRooms/${room_id}/${user_id}`,
    bookingDetails,
    { headers: { Authorization: `Bearer ${jwt}` } }
  );
  return res;
};

export const getAllAdditionalService = (hotel_id) => {
  const res = http.get(`/user/getUser/getAllAdditionalServices/${hotel_id}`);
  return res;
};

export const getBookingDetails = (booking_id) => {
  const res = http.get(
    `/user/getUser/getSpecificBookingDetailsUser/${booking_id}`
  );
  return res;
};

export const getFAQClients = (hotel_id) => {
  return http.get(`/user/getUser/getAllFAQ/${hotel_id}`);
};

export const getAllAdditionalServiceFilter = () => {
  return http.get("/user/getUser/getAllAdditionalServicesFilter");
};
