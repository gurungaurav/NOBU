import { http } from "../userMain"


export const mailVerify=(id,token)=>{

    const res = http.get(`/user/${id}/verify/${token}`)
    return res
}


export const sendOtpCode=(email)=>{
    const res = http.post(`/user/email/getOTP`, email)
    return res
}


export const resetPassword=(form)=>{
    console.log(form);
    const res = http.post('/user/userPasswordChange', form)
    return res
}