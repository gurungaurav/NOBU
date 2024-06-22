import { useFormik } from "formik";
import React from "react";
import { contactUsValidationSchema } from "../../../../schemas/client/contactUsSchema";
import { sendContactUsMail } from "../../../../services/hotels/hotels.service";
import { useSelector } from "react-redux";
import {toast} from "react-toastify"


export default function ContactUsForm({hotel_id}) {

    const {jwt} = useSelector((state)=>state.user)
    
    const { values, handleBlur, handleChange, handleSubmit, touched, errors,resetForm } =
    useFormik({
      initialValues: {
        firstName:"",
        lastName:"",
        email:"",
        phoneNumber:"",
        message:""
      },
      validationSchema: contactUsValidationSchema,
      onSubmit: async (values) => {
        await sendMessage(values);
      },
    });

    const sendMessage=async(form)=>{
        try{
            const res = await sendContactUsMail(hotel_id,form,jwt)
            console.log(res.data);
            toast.success(res.data.message)
            resetForm()
        }catch(e){
            console.log(e);
            toast.error(e.response.data.message)
        }
    }

  return (
    <form className="flex flex-col gap-6 px-16" onSubmit={handleSubmit}>
      <div className="flex  gap-10 w-full ">
        <div className="flex-1 h-[6rem]">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-black"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            className="pt-2 pb-2  border-b-2 border-gray-400  text-black w-full transition focus:border-black outline-none"
          />
          {touched.firstName && errors.firstName ? (
            <p className="text-red-600">{errors.firstName}</p>
          ) : null}
        </div>
        <div className="flex-1 h-[6rem]">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-black"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={values.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            className="pt-2 pb-2  border-b-2 border-gray-400  text-black w-full transition focus:border-black outline-none"
          />
           {touched.lastName && errors.lastName ? (
            <p className="text-red-600">{errors.lastName}</p>
          ) : null}
        </div>
      </div>
      <div className="flex gap-10 w-full">
        <div className="flex-1 h-[6rem]">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-black"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className="pt-2 pb-2  border-b-2 border-gray-400  text-black w-full transition focus:border-black outline-none"
          />
           {touched.email && errors.email ? (
            <p className="text-red-600">{errors.email}</p>
          ) : null}
        </div>
        <div className="flex-1 h-[6rem]">
          <label
            htmlFor="phoneNumer"
            className="block text-sm font-medium text-black"
          >
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={values.phoneNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            className="pt-2 pb-2  border-b-2 border-gray-400  text-black w-full transition focus:border-black outline-none"
          />
          {touched.phoneNumber && errors.phoneNumber ? (
            <p className="text-red-600">{errors.phoneNumber}</p> 
          ) : null}
        </div>
      </div>
      <div className="flex w-full">
        <div className="flex-1 h-[6rem]">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-black"
          >
            Message
          </label>
          <input
            type="text"
            id="message"
            name="message"
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Write your message..."
            className=" pt-2 pb-2 border-b-2 border-gray-400  text-black w-full transition focus:border-black outline-none"
          />
           {touched.message && errors.message ? (
            <p className="text-red-600">{errors.message}</p>
          ) : null}
        </div>
      </div>
      <div className="flex justify-end">
        <button  type="submit" className=" hover:scale-105 duration-300 ease-in w-fit p-3 rounded-md text-sm px-8 bg-violet-950 text-white font-semibold">
            <p>Send Message</p>
        </button>    
      </div>
    </form>
  );
}
