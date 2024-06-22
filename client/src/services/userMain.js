import axios from "axios";

const userHttp = import.meta.env.VITE_API_Key_BACK_HTTP;

export const http = axios.create({
  baseURL: userHttp,
});
