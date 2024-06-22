import { http } from "../userMain";

export const getVendorDashBoardDetail = (name, jwt) => {
  const res = http.get(`/vendor/getVendors/getVendorDashBoardDetails/${name}`, {
    headers: { Authorization: `Bearer ${jwt}` },
  });

  return res;
};

export const getVendorHotelSpecific = (name, jwt) => {
  const res = http.get(`/vendor/getVendors/getSpecificHotel/${name}`, {
    headers: { Authorization: `Bearer ${jwt}` },
  });

  return res;
};

export const vendorRegistration = (form, user_id, jwt) => {
  const res = http.post(`/vendor/addVendors/${user_id}`, form, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res;
};

export const getAllRooms = (
  hotel_name,
  pageNumber,
  searchName,
  selectedRoomType,
  selectedRoomFloor,
  params,
  jwt
) => {
  const res = http.get(`/vendor/getVendors/allRooms/${hotel_name}`, {
    params: {
      pageNumber: pageNumber,
      searchName: searchName,
      selectedRoomType: selectedRoomType,
      selectedRoomFloor: selectedRoomFloor,
      ...params,
    },
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res;
};

export const getRoomTypesRegistration = () => {
  const res = http.get("/vendor/getVendors/getRoomTypes");
  return res;
};

export const getAmenitiesRegistration = () => {
  const res = http.get("/vendor/getVendors/getAllAmenitiesRegi");
  return res;
};

export const getRegisteredAmenitiesHotel = (hotel_name, jwt) => {
  const res = http.get(`/vendor/getVendors/getHotelAmenities/${hotel_name}`, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res;
};

export const addHotelRooms = (form, hotel_name, jwt) => {
  const res = http.post(`/vendor/addRooms/${hotel_name}`, form, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res;
};

export const getAllHotelRoomsVendor = (hotel_name, jwt) => {
  const res = http.get(`/vendor/getVendors/getAllRooms/${hotel_name}`, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res;
};

export const deleteHotelRoom = (hotel_name, room_id, jwt) => {
  const res = http.delete(`/vendor/deleteRooms/${room_id}/${hotel_name}`, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res;
};

export const getChatsVendor = (vendor_id) => {
  const res = http.get(`/vendor/getVendors/getChats/${vendor_id}`);
  return res;
};

export const getAllBeds = () => {
  const res = http.get("/vendor/getVendors/getBedTypes");
  return res;
};

export const getOneHotel = (vendor_id) => {
  const res = http.get(`/vendor/getVendors/getHotel/${vendor_id}`);
  return res;
};

export const bookingDetailsAll = (hotel_name, pageNumber, params, jwt) => {
  const res = http.get(
    `/vendor/getVendors/getBookingDetailsAll/${hotel_name}`,
    {
      params: { page: pageNumber, ...params },
      headers: { Authorization: `Bearer ${jwt}` },
    }
  );
  return res;
};
export const bookingSpecificDetails = (hotel_name, booking_id, jwt) => {
  const res = http.get(
    `/vendor/getVendors/getBookingDetailsAll/${hotel_name}/getSpecificDetails/${booking_id}`,
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  );
  return res;
};

export const checkVendor = (hotel_name, jwt) => {
  const res = http.get(`/vendor/getVendors/checkVendor/${hotel_name}`, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res;
};

export const getGuestsDetailsAPI = (
  hotel_name,
  pageNumber,
  searchName,
  jwt
) => {
  const res = http.get(`/vendor/getVendors/getGuestsDetails/${hotel_name}`, {
    params: { page: pageNumber, searchName },
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res;
};

export const getSpecificRoomByName = (hotel_name, room_id, jwt) => {
  const res = http.get(
    `/vendor/getVendors/getSingleRoomByName/${hotel_name}/${room_id}`,
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  );
  return res;
};
export const getSpecificGuestsDetails = (
  hotel_name,
  user_id,
  pageNumber,
  params,
  jwt
) => {
  const res = http.get(
    `/vendor/getVendors/getGuestsDetails/${hotel_name}/specificDetails/${user_id}`,
    {
      params: { page: pageNumber, ...params },
      headers: { Authorization: `Bearer ${jwt}` },
    }
  );
  return res;
};

export const getPaymentDetailsAll = (hotel_name, pageNumber, params, jwt) => {
  const res = http.get(
    `/vendor/getVendors/getPaymentDetailsAll/${hotel_name}`,
    {
      params: { page: pageNumber, ...params },
      headers: { Authorization: `Bearer ${jwt}` },
    }
  );
  return res;
};

export const updateRoomsVendor = (form, hotel_name, room_id, jwt) => {
  const res = http.patch(`/vendor/updateRooms/${room_id}/${hotel_name}`, form, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res;
};

export const updateHotelGeneralDetails = (form, hotel_name, jwt) => {
  const res = http.patch(
    `/vendor/updateHotelSpecificDetails/${hotel_name}`,
    form,
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  );
  return res;
};

export const updateHotelPicturesDetails = (form, hotel_name, jwt) => {
  const res = http.patch(`/vendor/updateHotelPictures/${hotel_name}`, form, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res;
};

export const getHotelReviewsVendor = (hotel_name, pageNumber, jwt) => {
  const res = http.get(`/vendor/getVendors/allReviewsHotel/${hotel_name}`, {
    params: { page: pageNumber },
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res;
};

export const deleteHotelReviewsVendor = (hotel_name, review_id, jwt) => {
  const res = http.delete(
    `/vendor/deleteReviewsVendor/${hotel_name}/${review_id}`,
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  );
  return res;
};

export const getHotelAdditionalServices = (hotel_name, pageNumber, jwt) => {
  const res = http.get(
    `/vendor/getVendors/allAdditionalServices/${hotel_name}`,
    {
      params: { page: pageNumber },
      headers: { Authorization: `Bearer ${jwt}` },
    }
  );
  return res;
};

export const addHotelAdditionalServices = (form, hotel_name, jwt) => {
  const res = http.post(`/vendor/addAdditionalServices/${hotel_name}`, form, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res;
};

export const deleteHotelAdditionalServices = (hotel_name, service_id, jwt) => {
  const res = http.delete(
    `/vendor/deleteAdditionalServices/${hotel_name}/${service_id}`,
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  );
  return res;
};

export const updateHotelAdditionalServices = (
  form,
  hotel_name,
  service_id,
  jwt
) => {
  const res = http.patch(
    `/vendor/updateServiceHotel/${hotel_name}/${service_id}`,
    form,
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  );
  return res;
};

export const updateBookingDetail = (form, hotel_name, jwt) => {
  const res = http.patch(`/vendor/updateBookingDetails/${hotel_name}`, form, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res;
};

export const getHotelAmenitiesVendor = (hotel_name, jwt) => {
  const res = http.get(
    `/vendor/getVendors/getAllAmenitiesHotel/${hotel_name}`,
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  );
  return res;
};

export const addHotelAmenitiesVendor = (form, hotel_name, jwt) => {
  const res = http.post(
    `/vendor/addAmenitiesHotel/${hotel_name}`,
    { amenity: form },
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  );
  return res;
};

export const updateHotelAmenitiesVendor = (form, hotel_name, jwt) => {
  const res = http.patch(`/vendor/updateAmenitiesHotel/${hotel_name}`, form, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res;
};

export const deleteHotelAmenitiesVendor = (amenity, hotel_name, jwt) => {
  const res = http.delete(
    `/vendor/deleteAmenitiesHotel/${hotel_name}/${amenity}`,
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  );
  return res;
};

export const getFAQDetailsVendor = (
  hotel_name,
  pageNumber,
  searchName,
  jwt
) => {
  const res = http.get(`/vendor/getVendors/getAllFAQVendor/${hotel_name}`, {
    params: { page: pageNumber, searchName },
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res;
};

export const postFAQDetailsVendor = (hotel_name, form, jwt) => {
  const res = http.post(`/vendor/addFAQVendor/${hotel_name}`, form, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res;
};

export const patchFAQDetailsVendor = (hotel_name, faq_id, form, jwt) => {
  const res = http.patch(
    `/vendor/updateFAQVendor/${hotel_name}/${faq_id}`,
    form,
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  );
  return res;
};

export const deleteFAQDetailsVendor = (hotel_name, faq_id, jwt) => {
  const res = http.delete(`/vendor/deleteFAQVendor/${hotel_name}/${faq_id}`, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res;
};
