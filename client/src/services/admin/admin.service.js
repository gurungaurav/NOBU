import { http } from "../userMain";

export const getVendorsToVerify = () => {
  const res = http.get("/admin/allVerificationVendors");
  return res;
};

export const verifyVendorHotel = (hotel_id, jwt, admin_id) => {
  const res = http.post(`/admin/verifyHotel/${hotel_id}/${admin_id}`, null, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res;
};

export const rejectVendorHotel = (hotel_id, message, admin_id) => {
  const res = http.post(`/admin/rejectHotel/${hotel_id}/${admin_id}`, {
    rejectReason: message,
  });
  return res;
};

export const getHotelVerifyDetails = (hotel_id) => {
  const res = http.get(`/admin/getSpecificVerifyHotels/${hotel_id}`);
  return res;
};

export const getHotelVerifiedDetails = (hotel_id) => {
  const res = http.get(`/admin/getSpecificVerifiedHotels/${hotel_id}`);
  return res;
};

export const verifiedHotels = () => {
  const res = http.get("/admin/getAllVerifiedHotels");
  return res;
};

export const allAmenitiesAdmin = () => {
  const res = http.get("/admin/getAllAmenitiesAdmin");
  return res;
};

export const addAmenitiesSingle = (amenities, jwt) => {
  const res = http.post(
    `/admin/addAmenitiesSingle`,
    { amenity: amenities },
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  );
  return res;
};

export const updateAmenitiesSingle = (amenity_id, amenity_name, jwt) => {
  const res = http.patch(
    `/admin/updateAmenities/${amenity_id}`,
    { amenity_name: amenity_name },
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  );
  return res;
};

export const updateHotelStatus = (hotel_id, status, jwt) => {
  const res = http.patch(
    `/admin/updateVerificationStatusHotel/${hotel_id}`,
    { status: status },
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  );
  return res;
};

export const getAllBedTypes = () => {
  const res = http.get("/admin/allBedTypes");
  return res;
};

export const addBedTypes = (bedType, jwt) => {
  const res = http.post(`/admin/addBedTypes`, bedType, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res;
};

export const updateBedTypes = (bed_type_id, bed, jwt) => {
  const res = http.patch(`/admin/updateBedType/${bed_type_id}`, bed, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res;
};

export const DeleteAmenity = (amenity_id) => {
  const res = http.delete(`/admin/deleteAmenities/${amenity_id}`);
  return res;
};

export const AllUsersAdmin = (searchName, pageNumber) => {
  const res = http.get(`/admin/getAllUsers`, {
    params: { page: pageNumber, searchName },
  });
  return res;
};

export const AllBlogDetailsAdmin = (pageNumber) => {
  const res = http.get(`/admin/getAllBlogs`, { params: { page: pageNumber } });

  return res;
};

export const DeleteBlogAdmin = (blog_id, admin_id, form) => {
  const res = http.post(`/admin/deleteBlogs/${blog_id}/${admin_id}`, form);
  return res;
};

export const DeleteUserByAdmin = (user_id, form) => {
  const res = http.post(`/admin/deleteUser/${user_id}`, form);
  return res;
};

export const getAllTransactionsAdmin = (
  admin_id,
  pageNumber,
  type,
  selectedHotel
) => {
  const res = http.get(`/admin/getAllTransactions/${admin_id}`, {
    params: {
      page: pageNumber,
      type: type,
      selectedHotel,
    },
  });
  return res;
};

export const getDashBoardDetailsAdmin = (admin_id) => {
  const res = http.get(`/admin/getAllAdminDashboardDetails/${admin_id}`);
  return res;
};
