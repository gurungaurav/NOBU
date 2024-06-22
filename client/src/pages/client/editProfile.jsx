import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { Link, useNavigate, useParams } from "react-router-dom";
import { updateUserProfile } from "../../services/client/user.service";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { profileUpdateSchema } from "../../schemas/client/profileUpdateSchema";
import { useDispatch, useSelector } from "react-redux";
import { updateData } from "../../redux/slice/userSlice";
import { TextField } from "@mui/material";

export default function EditProfile() {
  const { user_id } = useParams();
  const dispatch = useDispatch();
  const { profile_picture, name } = useSelector((state) => state.user);

  const [viewFile, setViewFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setViewFile(URL.createObjectURL(file));
    setFieldValue("profile_picture", file);
  };

  const handleRemovePicture = () => {
    setViewFile(null);
    setFieldValue("profile_picture", null);
  };

  const navigate = useNavigate();
  const {
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    setFieldValue,
    resetForm,
    isValidating,
  } = useFormik({
    initialValues: {
      name: "",
      profile_picture: "",
      phone_number: "",
    },
    validationSchema: profileUpdateSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("profile_picture", values.profile_picture);
        formData.append("phone_number", values.phone_number);
        const res = await updateUserProfile(user_id, formData);
        const userName = res.data.data.user_name || name;
        const profileP = res.data.data.profile_picture || profile_picture;
        dispatch(updateData({ name: userName, profile_picture: profileP }));
        resetForm();
        toast.success(res.data.message);
        navigate(`/profile/${user_id}`);
      } catch (error) {
        console.error(error);
        toast.error(error.response.message);
      }
    },
  });

  const handleResetForm = () => {
    resetForm();
    setViewFile(null);
  };
  const isFormEmpty =
    !values.name.trim() && !values.profile_picture && !values.phone_number;
  const isButtonDisabled =
    isValidating || Object.keys(errors).length !== 0 || isFormEmpty;

  return (
    <div className="flex items-center justify-center pt-10 pb-10">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="rounded-lg px-10 py-6 flex flex-col gap-2 w-[50%] shadow-lg border"
      >
        <div className="flex justify-end">
          <Link
            to={`/profile/${user_id}`}
            className="rounded-full p-2 hover:bg-neutral-100 text-2xl"
          >
            <RxCross1 />
          </Link>
        </div>
        <div className="flex flex-col w-[60%] h-[5rem]">
          <TextField
            label="User_name"
            className="rounded-lg"
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.name && touched.name && (
            <p className="text-red-600">{errors.name}</p>
          )}
        </div>
        <div className="flex flex-col w-[60%] h-[5rem]">
          <TextField
            label="Phone_number"
            className="rounded-lg"
            type="number"
            name="phone_number"
            value={values.phone_number}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.phone_number && touched.phone_number && (
            <p className="text-red-600">{errors.phone_number}</p>
          )}
        </div>
        <div className="flex items-center justify-center w-[50%]">
          {viewFile ? (
            <div className="relative rounded-lg w-full h-60">
              <div className="rounded-lg h-full">
                <img
                  src={viewFile}
                  className="w-full h-full rounded-lg object-cover"
                  alt="Preview"
                />
              </div>
              <div
                className="text-white text-xl rounded-full p-2 absolute top-4 right-4 cursor-pointer hover:bg-gray-400"
                onClick={handleRemovePicture}
              >
                <RxCross1 />
              </div>
            </div>
          ) : (
            <>
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-60 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  onBlur={handleBlur}
                  accept="image/*"
                />
              </label>
              {errors.profile_picture && touched.profile_picture && (
                <p className="text-red-600">{errors.profile_picture}</p>
              )}
            </>
          )}
        </div>
        <div className="flex justify-end text-sm font-semibold gap-4">
          <div
            className="p-3 rounded-3xl pl-7 pr-7 hover:bg-neutral-100 text-black flex items-center gap-2 cursor-pointer"
            onClick={handleResetForm}
          >
            <RxCross1 className="font-bold " />
            <p>Cancel</p>
          </div>
          <button
            type="submit"
            className={`p-3 rounded-3xl pl-7 pr-7 ${
              isButtonDisabled
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-violet-950 hover:bg-violet-900 text-white"
            }`}
            disabled={isButtonDisabled}
          >
            <p>Save</p>
          </button>
        </div>
      </form>
    </div>
  );
}
