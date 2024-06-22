import { http } from "../userMain";

export const getAllChatss = (vendor_id, user_id) => {
  const res = http.get(`/user/getUser/chatRoom/${vendor_id}/${user_id}`);
  return res;
};

export const getAllSupportChats = (id) => {
  const res = http.get(`/support/getAllSupportChats/${id}`);
  return res;
};

export const getAllSupportMessages = (room_id) => {
  const res = http.get(`/support/getAllSupportMessages/${room_id}`);
  return res;
};

export const postNewSupportChat = (form, id) => {
  const res = http.post(`/support/postChat/${id}`, form);
  return res;
};

export const addNewMessage = (message, room_id, sender_id) => {
  const res = http.post(`/support/postNewMessage/${room_id}/${sender_id}`, {
    message: message,
  });
  return res;
};

export const updateChat = (room_id) => {
  const res = http.patch(`/support/updateSupportRoomStatus/${room_id}`);
  return res;
};
