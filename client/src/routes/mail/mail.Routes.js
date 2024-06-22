import { lazy } from "react"
const MailVerification = lazy(()=> import("../../components/mail/mailVerification"))
const SendOTP = lazy(()=>import("../../components/mail/sendOTP"))
const PasswordReset = lazy(()=>import( "../../components/mail/passwordReset"))
const OtpCodemail = lazy(()=>import("../../components/mail/otpCodemail"))


export const mailRoutes =[
    {
        id:'mailVerify',
        path:'/nobu/user/:id/verify/:token',
        element: MailVerification,
        hasLayout:false,
        requiredAuth:false,
        hasAdminLayout:false,
        hasVendorLayout:false,
        requiredAdminAuth:false,
        requiredVendorAuth:false
    },
    {
        id:'otpEmailVerification',
        path:'/nobu/user/emailVerification',
        element: SendOTP,
        hasLayout:false,
        requiredAuth:false,
        hasAdminLayout:false,
        hasVendorLayout:false,
        requiredAdminAuth:false,
        requiredVendorAuth:false
    },
    {
        id:'otpMailVerification',
        path:'/nobu/user/verify/OTPCode/55zdgsd_sdy2dsgdusd127_hd123/:otp',
        element: OtpCodemail,
        hasLayout:false,
        requiredAuth:false,
        hasAdminLayout:false,
        hasVendorLayout:false,
        requiredAdminAuth:false,
        requiredVendorAuth:false
    },
    {
        id:'otpFormVerification',
        path:'/nobu/user/verified/passwordReset/:otp',
        element: PasswordReset,
        hasLayout:false,
        requiredAuth:false,
        hasAdminLayout:false,
        hasVendorLayout:false,
        requiredAdminAuth:false,
        requiredVendorAuth:false
    },
    


]