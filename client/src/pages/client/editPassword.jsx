import React from "react";
import { RxCross1 } from "react-icons/rx";
import { Link, useNavigate, useParams } from "react-router-dom";
import { updateUserPasswordProfile } from "../../services/client/user.service";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { passwordUpdateSchema } from "../../schemas/client/profileUpdateSchema";
import { TextField } from "@mui/material";

export default function EditPassword() {
  const { user_id } = useParams();

  const {
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    resetForm,
  } = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      password: "",
    },
    validationSchema: passwordUpdateSchema,
    onSubmit: async (values) => {
      await updateUser(values);
    },
  });

  //   useEffect(() => {
  //     const formValues = Object.values(values);
  //     const filledFields = formValues.filter(
  //       (value) => value !== null && value !== ""
  //     );
  //     setIsFormFilled(filledFields.length > 0);
  //   }, [values]);

  const navigate = useNavigate();

  const updateUser = async (form) => {
    try {
      console.log("haha");
      const res = await updateUserPasswordProfile(user_id, form);
      console.log(res.data);
      toast.success(res.data.message);
      resetForm();
      navigate(`/profile/${user_id}`);
    } catch (e) {
      console.log(e.response);
      toast.error(e.response.data.message);
    }
  };

  function handleResetForm() {
    resetForm();
  }

  return (
    <div className="flex items-center justify-center pt-10 pb-10">
      <form
        onSubmit={handleSubmit}
        className=" rounded-xl px-10 py-5  flex flex-col gap-4 w-[40%] shadow-md border"
      >
        <div className=" flex justify-end ">
          <Link
            to={`/profile/${user_id}`}
            className=" rounded-full  p-2 hover:bg-neutral-100  text-2xl"
          >
            <RxCross1 />
          </Link>
        </div>
        {/* {!isFormFilled && <p>Please input a field</p>} */}
        <div className="w-[60%]">
          <h1 className="text-2xl tracking-wide font-bold">Change Password</h1>
          <p className="text-sm font-semibold">
            Your password must be at least 6 characters and should include a
            combination of numbers, letters and special characters (!$@%).
          </p>
        </div>
        <div className="flex flex-col w-[80%]  h-[5rem] ">
          <TextField
            label="Current Password"
            className="outline-none rounded-lg"
            type="text"
            name="currentPassword"
            value={values.currentPassword}
            onChange={handleChange}
            onBlur={handleBlur}
          ></TextField>
          {errors.currentPassword && touched.currentPassword ? (
            <p className="text-red-600">{errors.currentPassword}</p>
          ) : null}
        </div>
        <div className="flex flex-col  w-[80%] h-[5rem] ">
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
            value={values.password}
            name="password"
          ></TextField>
          {errors.password && touched.password ? (
            <p className="text-red-600">{errors.password}</p>
          ) : null}
        </div>
        <div className="h-[2rem] ">
          <Link
            to={"/nobu/user/emailVerification"}
            className="text-violet-950 font-semibold cursor-pointer hover:border-b-2 border-b-violet-950 w-fit"
          >
            Forgotten your password?
          </Link>
        </div>
        <div className="flex  justify-end text-sm font-semibold gap-4">
          <div
            className="p-3 rounded-3xl pl-7 pr-7 hover:bg-neutral-100 text-black flex items-center gap-2 cursor-pointer"
            onClick={handleResetForm}
          >
            <RxCross1 className="font-bold" />
            <p>Cancel</p>
          </div>
          <button
            type="submit"
            className="p-3 rounded-3xl pl-7 pr-7 bg-violet-950 text-white cursor-pointer hover:bg-violet-900"
          >
            <p>Save</p>
          </button>
        </div>
      </form>
    </div>
  );
}
