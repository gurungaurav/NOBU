import React, { useState } from "react";
// import fomBg from "../../assets/form.avif";
import { resetPassword, sendOtpCode } from "../../services/mail/mailVerify";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { passwordResetValidSchema } from "../../schemas/client/passwordResetSchema";
import { useNavigate, useParams } from "react-router-dom";
import { TextField } from "@mui/material";
import { RxCross1 } from "react-icons/rx";

export default function PasswordReset() {
  //!User after forgot password user inputs the email and then the otp code is sent to the email and is verified

  //!Like i will make a section where user inputs the email form for sending the otp and after that there will be three inputs
  //!otp, new pass and repeat pass thats it

  const { otp } = useParams();

  const initialValues = {
    code: otp,
    newPassword: "",
    confirmPassword: "",
  };

  const navigate = useNavigate();

  const { values, handleBlur, handleChange, handleSubmit, touched, errors } =
    useFormik({
      initialValues: initialValues,
      validationSchema: passwordResetValidSchema,
      onSubmit: async () => {
        await sendForm();
      },
    });

  const sendForm = async () => {
    try {
      const res = await resetPassword(values);
      console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        console.log("error on password reset form");
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  const redirectLogin = () => {
    navigate("/login");
  };

  return (
    <div className=" w-full flex flex-col items-center justify-center h-[100vh]">
      {/* <img className="relative h-full w-full" src={fomBg}></img> */}
      <form
        className=" rounded-xl absolute bg-white px-10 py-5  flex flex-col gap-4 w-[40%] shadow-md border"
        onSubmit={handleSubmit}
      >
        <div className="w-[60%]">
          <h1 className="text-2xl tracking-wide font-bold">Change Password</h1>
          <p className="text-sm font-semibold">
            Your password must be at least 6 characters and should include a
            combination of numbers, letters and special characters (!$@%).
          </p>
        </div>
        {/* <input
          className=""
          placeholder="Code"
          name="code"
          value={values.code}
          onChange={handleChange}
          onBlur={handleBlur}
        ></input>
        {touched.code && errors.code ? (
          <p className="text-red-600">{errors.code}</p>
        ) : null} */}
        <div className="flex flex-col  w-[80%] h-[5rem] mt-6">
          <TextField
            label="New Password"
            className="outline-none rounded-lg"
            type="text"
            name="newPassword"
            value={values.newPassword}
            onChange={handleChange}
            onBlur={handleBlur}
          ></TextField>
          {errors.newPassword && touched.newPassword ? (
            <p className="text-red-600">{errors.newPassword}</p>
          ) : null}
        </div>
        <div className="flex flex-col w-[80%]  h-[5rem] ">
          <TextField
            label="Confirm Password"
            className="outline-none  rounded-lg"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.confirmPassword}
            name="confirmPassword"
          ></TextField>
          {errors.confirmPassword && touched.confirmPassword ? (
            <p className="text-red-600">{errors.confirmPassword}</p>
          ) : null}
        </div>
        <div className="flex  justify-end">
          <div className="flex gap-4 items-center">
            <button
              className={`p-3 rounded-3xl pl-7 pr-7  hover:bg-neutral-100 text-black flex items-center gap-2 duration-300 `}
              type="button"
              // disabled={isLoading}
              onClick={redirectLogin}
            >
              <RxCross1 className="font-bold" />
              <p>Cancel</p>
            </button>
            <button
              className="p-3 rounded-3xl pl-7 pr-7 font-semibold w-fit bg-violet-950 text-white cursor-pointer hover:bg-opacity-90 duration-300"
              type="submit"
            >
              Sumbit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
