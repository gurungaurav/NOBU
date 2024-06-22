import { http } from "../userMain";

export const registerAccount = (form) => {
  const res = http.post("/user/registerUser", form);
  return res;
};

export const loginAccount = (form) => {
  const res = http.post("/user/loginUser", form);
  return res;
};

export const checkJwt = (jwt) => {
  const res = http.get("/user/loginUser/jwtVerify", {
    headers: { Authorization: `Bearer ${jwt}`  },
  });
  return res
};

export const checkOTPasswordReset=(user_id,otp)=>{
  const res = http.post(`/user/verifyOTP/${user_id}`,{otp:otp} )
  return res
}