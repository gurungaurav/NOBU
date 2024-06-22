import { useState } from "react";
import { useFormik } from "formik";
import { loginFormValidSchema } from "../../schemas/client/loginSchema";
import {
  checkJwt,
  loginAccount,
} from "../../services/auth/loginResgiter.service";
import { toast } from "react-toastify";
import { setData } from "../../redux/slice/userSlice";
import Swal from "sweetalert2";
import fomBg from "../../assets/login.jpg";
import { AiOutlineMail } from "react-icons/ai";
import { CiLock, CiUnlock } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination } from "swiper/modules";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const dispatch = useDispatch();

  const initialValues = {
    email: "",
    password: "",
  };

  const navigate = useNavigate();

  const { values, handleBlur, handleChange, handleSubmit, touched, errors } =
    useFormik({
      initialValues: initialValues,
      validationSchema: loginFormValidSchema,
      onSubmit: async () => {
        setLoading(true);
        await loginUser();
      },
    });

  const loginUser = async () => {
    try {
      const res = await loginAccount(values);
      if (res.data.success) {
        try {
          const jwt = res.data.data.token;
          const result = await checkJwt(jwt);
          const message = result.data.message;
          if (result.data.success) {
            const name = result.data.data.name;
            const id = result.data.data.id;
            const profile_picture = result.data.data.profile_picture;
            const role = result.data.data.role;
            const jwt = result.data.data.jwt;
            dispatch(
              setData({
                id: id,
                profile_picture: profile_picture,
                name: name,
                role: role,
                jwt: jwt,
              })
            );
            setLoading(false);

            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 4000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              },
            });
            Toast.fire({
              icon: "success",
              title: message,
            });

            navigate("/");
          } else {
            toast.error(message);
            setLoading(false);
          }
        } catch (e) {
          toast.error(e.response.data.message);
          setLoading(false);
        }
      }
    } catch (e) {
      toast.error(e.response.data.message);
      setLoading(false);
    }
  };

  const forgotRedirect = () => {
    navigate("/nobu/user/emailVerification");
  };

  return (
    <div className=" w-full flex flex-col items-center justify-center h-[100vh] bg-violet-100">
      <form
        className="flex absolute bg-center bg-white items-center rounded-lg    h-fit shadow-xl "
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col px-20  w-[35rem]">
          <div className="text-3xl font-bold tracking-wider flex flex-col  w-full mb-10">
            <p>Good day!</p>
            <p className="text-sm font-normal">Ready to explore? </p>
          </div>

          <div className="flex flex-col  h-[90px] w-full">
            <div className=" rounded-md border-2 p-4 flex items-center gap-2 ">
              <AiOutlineMail className="text-neutral-500 text-xl" />
              <input
                className="outline-none text-black w-full"
                placeholder="Email"
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              ></input>
            </div>
            {touched.email && errors.email ? (
              <p className="text-red-600 text-sm">{errors.email}</p>
            ) : null}
          </div>
          <div className="flex flex-col  h-[90px] w-full">
            <div className=" rounded-md border-2 p-4 flex items-center gap-2">
              {showPassword ? (
                <CiUnlock className="text-neutral-500 text-xl" />
              ) : (
                <CiLock className="text-neutral-500 text-xl" />
              )}
              <input
                type={`${showPassword ? "text" : "password"}`}
                className="outline-none   w-full"
                placeholder="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              ></input>
            </div>
            {touched.password && errors.password && (
              <p className="text-red-600 text-sm">{errors.password}</p>
            )}
          </div>
          <div className=" flex justify-between items-center text-sm font-semibold">
            <div className="flex gap-2 items-center">
              <input
                id="showPassword"
                type="checkbox"
                onClick={updateShowPassword}
                className="form-checkbox h-4 w-4  rounded-md  border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              ></input>
              <label htmlFor="showPassword" className="cursor-pointer">
                Show Password
              </label>
            </div>
            <div
              className="cursor-pointer text-sm hover:text-violet-950 duration-300"
              onClick={forgotRedirect}
            >
              <p>Forgot password?</p>
            </div>
          </div>

          {/* <ReCAPTCHA
          sitekey="6LfE6QIpAAAAAMZIq1zlS_QrOykj_IGANy9t9fyh"
          onChange={onChange}
          ref={captchaRef}
        /> */}

          {/* {id && id ? (
            <button className="" onClick={() => dispatch(clearData())}>
              Logout
            </button>
          ) : ( */}
          <button
            className={`transition ease-in-out delay-150 flex gap-2 items-center justify-center bg-violet-950 text-white font-semibold  hover:bg-opacity-90 duration-300 p-2 rounded-md mt-6 ${
              loading && "cursor-not-allowed bg-opacity-90"
            }`}
            type="submit"
            disabled={loading}
          >
            {loading && <CircularProgress size={20} />}
            <p>Login</p>
          </button>
          <div className="text-center mt-4 text-sm">
            <p>
              Don't you have account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-violet-950 font-semibold cursor-pointer hover:underline duration-500"
              >
                Create an account
              </span>
            </p>
          </div>
        </div>
        <div className="rounded-l-[3rem] w-[35rem] h-[40rem] relative">
          <img
            className="w-full rounded-l-[3rem]  h-full object-cover rounded-r-lg "
            src={fomBg}
          ></img>
          <div className="absolute top-[12rem] text-white w-full flex flex-col items-center justify-center ">
            <div className="backdrop-blur-sm bg-white bg-opacity-20 rounded-md py-10 px-8 w-[20rem]">
              <h1 className="text-3xl font-semibold tracking-wider">
                Welcome!
              </h1>
              <p className="text-lg font-semibold mt-1 tracking-wider">
                Please log in to continue
              </p>
              <p className="mt-10 text-xs tracking-wider">
                Explore exclusive hotel deals and book your dream stay with
                ease.
              </p>
            </div>
            <div className="w-[15rem] mt-14 text-sm ">
              <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                modules={[Autoplay, Pagination]}
                className="mySwiper text-center  "
              >
                <SwiperSlide className="mb-10">
                  <div className="text-center">
                    <p className="">
                      Explore our wide range of destinations and find your
                      perfect getaway.
                    </p>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="mb-10 ">
                  <div className="text-center">
                    <p className="">
                      Unlock exclusive deals and discounts on luxury hotels
                      worldwide.
                    </p>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="mb-10 ">
                  <div className="text-center">
                    <p className="">
                      Tailor your travel experience with our personalized
                      recommendations and amenities.
                    </p>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="mb-10 ">
                  <div className="text-center">
                    <p className="">
                      Enjoy a hassle-free booking process and secure your dream
                      stay in just a few clicks.
                    </p>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
