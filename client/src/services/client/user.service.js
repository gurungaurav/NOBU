import { http } from "../userMain";

export const getUserDetailss = (id) => {
  const res = http.get(`/user/getUser/userDetails/${id}`);
  return res;
};

export const postHotelReviews = (hotel_id, user_id, review, jwt) => {
  const res = http.post(`/user/addHotelReview/${user_id}/${hotel_id}`, review, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res;
};

export const getHotelReviewss = (hotel_id) => {
  const res = http.get(`/user/getUser/getHotelReviews/${hotel_id}`);
  return res;
};

export const postBlogs = (authorId, post, jwt) => {
  console.log(post.get("picture"));
  const res = http.post(`/blog/postBlogs/${authorId}`, post, {
    headers: { Authorization: `Bearer ${jwt}` },
  });

  return res;
};

export const getBlogTags = () => {
  const res = http.get("/blog/getBlogs/getBlogTags");
  return res;
};

export const getBlogs = (pageNumber) => {
  const res = http.get("/blog/getBlogs/getAllBlogs", {
    params: { pageNumber: pageNumber },
  });
  return res;
};

export const getSpecificBlogs = (blog_id) => {
  const res = http.get(`/blog/getBlogs/getSpecificBlogs/${blog_id}`);
  return res;
};

export const likeBlog = (user_id, blog_id) => {
  const res = http.post(`/blog/likeBlogPosts/${user_id}/${blog_id}`);
  return res;
};

export const postComments = (user_id, blog_id, text, jwt) => {
  const res = http.post(
    `/blog/postBlogComments/${user_id}/${blog_id}`,
    { text },
    { headers: { Authorization: `Bearer ${jwt}` } }
  );
  return res;
};

export const getHotelsFilter = (params) => {
  console.log(params.get("searchName"));
  const res = http.get("/user/getUser/searchHotelFilter", { params });
  return res;
};

export const getRoomFilter = (hotel_id, params) => {
  const res = http.get(`/user/getUser/searchRoomFilter/${hotel_id}`, {
    params,
  });
  return res;
};

export const bookMarkHotelRooms = (user_id, hotel_id, room_id, jwt) => {
  const res = http.post(
    `/user/bookmark/${room_id}/${hotel_id}/${user_id}`,
    null,
    { headers: { Authorization: `Bearer ${jwt}` } }
  );
  return res;
};

export const getBedTypess = () => {
  const res = http.get("/user/getUser/getAllBedTypes");
  return res;
};

export const updateUserProfile = (user_id, form) => {
  const res = http.patch(`/user/updateUser/${user_id}`, form);
  return res;
};

export const paymentConfirmation = (booking_id, details, hotel_id) => {
  console.log(details, "hahaha");
  const res = http.post(
    `/user/bookRoom/paymentConfirmation/${booking_id}/${hotel_id}`,
    details
  );
  return res;
};
export const paymentConfirmationEsewa = (booking_id, details, hotel_id) => {
  console.log(details, "hahaha");
  const res = http.post(
    `/user/bookRoom/paymentConfirmationEsewa/${booking_id}/${hotel_id}`,
    details
  );
  return res;
};

export const checkListYourProper = (user_id, jwt) => {
  const res = http.get(`/user/getUser/checkListYourProperty/${user_id}`, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res;
};

export const checkUsersHistory = (user_id) => {
  const res = http.get(
    `/user/getUser/userDetails/${user_id}/usersBookingHistory`
  );
  return res;
};

export const getSpecificBookingDetils = (user_id, booking_id) => {
  const res = http.get(
    `/user/getUser/userDetails/${user_id}/usersBookingDetails/${booking_id}`
  );
  return res;
};

export const updateUserPasswordProfile = (user_id, form) => {
  const res = http.patch(`/user/updateUserPassword/${user_id}`, form);
  return res;
};

export const sendVerificationMail = (user_id) => {
  const res = http.get(`/user/getUser/mailVerificationSend/${user_id}`);
  return res;
};

export const getNotifications = (page, receiver_id) => {
  const res = http.get(`/user/getUser/getNotifications/${receiver_id}`, {
    params: { page: page },
  });
  return res;
};

export const checkNoti = (receiver_id) => {
  const res = http.get(`/user/getUser/checkNotifications/${receiver_id}`);
  return res;
};

export const readAllNoti = (receiver_id) => {
  const res = http.patch(`/user/getUser/readNotifications/${receiver_id}`);
  return res;
};

export const deleteReviewsUser = (review_id, user_id) => {
  const res = http.delete(
    `/user/deleteHotelReviewsByUser/${review_id}/${user_id}`
  );
  return res;
};

export const deleteBookmarkUser = (bookmark_id, user_id) => {
  const res = http.delete(
    `/user/removeBookmarksByUser/${bookmark_id}/${user_id}`
  );
  return res;
};

export const getGallery = (hotel_id) => {
  const res = http.get(`/user/getUser/getAllHotelPictures/${hotel_id}`);
  return res;
};

export const refundBookings = (booking_id) => {
  const res = http.patch(`/user/refundRoom/${booking_id}`);
  return res;
};

export const cancelPendingBookings = (booking_id) => {
  const res = http.patch(`/user/cancelBookingsPending/${booking_id}`);
  return res;
};

export const sendMailAdminListProperty = (form) => {
  const res = http.post(`/user/sendMailAdminListProperty`, form);
  return res;
};

export const deleteBlogsUser = (blog_id, user_id) => {
  return http.delete(`/user/deleteBlogsUserProfile/${blog_id}/${user_id}`);
};

export const updateBlogsUser = (authorId, blogId, form) => {
  return http.put(`/blog/updateBlogs/${authorId}/${blogId}`, form);
};
