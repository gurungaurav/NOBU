import React, { useEffect, useState } from "react";
import bill from "../../assets/bill.png";
// import { getVendorsToVerify, rejectVendorHotel, verifyVendorHotel } from "../../services/admin/admin";

import { useSelector } from "react-redux";
import {
  getHotelVerifyDetails,
  getVendorsToVerify,
  rejectVendorHotel,
  verifyVendorHotel,
} from "../../services/admin/admin.service";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoMdHome } from "react-icons/io";
import RoomPhotos from "../../features/mainRooms/roomPhotos";
import { Dialog } from "@mui/material";
import { amenityIcons } from "../../icons/amenitiesIcons";

//TODO: Need to make the admin ui
export default function AdminVerifyVendors() {
  //!Need to use jwt verification
  const [hotelDetails, setHotelDetails] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const [rejectReason, setRejectReason] = useState("");
  const [errorForm, setErrorForm] = useState("");

  const { hotel_id } = useParams();
  console.log(hotel_id);
  const { id, jwt } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const getHotelsVerify = async () => {
    try {
      const res = await getHotelVerifyDetails(hotel_id);
      setHotelDetails(res.data.data);
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getHotelsVerify();
  }, []);

  const verifyVendor = async () => {
    try {
      const res = await verifyVendorHotel(hotel_id, jwt, id);
      console.log(res.data);
      navigate(`/admin/${id}/allHotels`);
    } catch (e) {
      console.log(e);
    }
  };

  const rejectVendor = async () => {
    try {
      if (rejectReason !== "") {
        const res = await rejectVendorHotel(hotel_id, rejectReason, id);
        console.log(res.data);
        navigate(`/admin/${id}/allHotels`);
      } else {
        setErrorForm("Please provide a reason!");
      }
    } catch (e) {
      console.log(e);
    }
  };

  //!Need to use jwt verification
  //!When vendor is verified a mail goes to that vendor for notifying that his hotel is granted same goes to rejection
  return (
    <div className="h-full px-8 py-2 w-full flex flex-col gap-2">
      <div className="flex items-center ">
        <Link
          to={`/admin/${id}/adminDash`}
          className="p-2 hover:bg-gray-200 duration-500 text-xl rounded-lg cursor-pointer"
        >
          <IoMdHome />
        </Link>
        /
        <Link
          to={`/admin/${id}/verifyVendorsLists`}
          className="p-2 hover:bg-gray-200 rounded-lg text-sm duration-500 cursor-pointer"
        >
          <p>Verify Vendors Lists</p>
        </Link>
        /
        <div className="p-2 text-md hover:bg-gray-200 text-sm font-bold duration-500 rounded-lg cursor-pointer">
          <p>{hotelDetails?.hotel_name}</p>
        </div>
      </div>
      <div className="bg-white p-10 rounded-lg border">
        <span className="text-xl  tracking-wider">
          Hotel name:{" "}
          <p className="inline font-semibold">{hotelDetails?.hotel_name}</p>
        </span>
        <div className="flex gap-2 items-center">
          <h1 className="">
            Hotel applied by :{" "}
            <span className="font-bold">{hotelDetails?.vendor?.user_name}</span>
          </h1>
          <img
            className="w-12 h-12 mt-3 rounded-full object-cover"
            src={hotelDetails?.vendor?.profile_picture}
          ></img>
        </div>
        <div className="flex flex-col ">
          <h1 className="font-semibold text-2xl border-b py-2">Basic Info</h1>
          <div className="flex  py-4 border-b">
            <div className="flex w-[25rem] justify-between">
              <p className="">Property Type</p>
              <p>Hotel</p>
            </div>
          </div>
          <div className="flex  py-4 border-b">
            <div className="flex w-[25rem]  justify-between">
              <p>Location</p>
              <p>{hotelDetails?.location}</p>
            </div>
          </div>
          <div className="flex  py-4 border-b">
            <div className="flex w-[25rem]  justify-between">
              <p>Hotel ratings</p>
              <p>{hotelDetails?.ratings}</p>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h1 className="border-b  pb-4 mb-4 font-semibold text-2xl ">
            Amenities
          </h1>
          <div className="flex gap-6 ">
            {hotelDetails?.hotel_amenities?.map((amen) => (
              <div className="flex gap-1 items-center">
                {amenityIcons[amen]} {amen}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <h1 className="border-b  pb-4 mb-4 font-semibold text-2xl ">
            Pictures
          </h1>
          <div className="flex gap-4 items-center">
            <div className="flex flex-col gap-2">
              <p className="font-semibold">Main Picture:</p>
              <div
                className="overflow-hidden rounded-lg "
                onClick={() => setIsDialogOpen(true)}
              >
                <img
                  className="w-[30rem] h-[16rem] rounded-lg object-cover cursor-pointer hover:opacity-90 hover:scale-105 duration-500"
                  src={hotelDetails?.main_picture}
                ></img>
              </div>
              <Dialog
                className="absolute w-full h-full "
                style={{ backgroundColor: "transparent" }}
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                maxWidth="lg"
              >
                <div className="h-[40rem]">
                  <img
                    className="w-full h-full object-cover"
                    src={hotelDetails?.main_picture}
                    alt="Profile"
                  />
                </div>
              </Dialog>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4 mb-10">
            <p className="font-semibold">Gallery:</p>
            <RoomPhotos roomPictures={hotelDetails?.pictures} />
          </div>
        </div>
        <div className="">
          <h1 className="border-b pb-4 mb-4 text-2xl font-semibold">Details</h1>
          <div>
            <h1 className="font-semibold  text-lg">Hotel's description</h1>
            <p>{hotelDetails?.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Contact Details</p>
              {/* <p>{hotelDetails?.roomType?.type_name}</p> */}

              <div className="flex  py-4 border-b">
                <div className="flex w-[25rem]  justify-between">
                  <p>Contact number</p>
                  <p>{hotelDetails?.phone_number}</p>
                </div>
              </div>
              <div className="flex  py-4 border-b">
                <div className="flex w-[25rem]  justify-between">
                  <p>Email address</p>
                  <p>{hotelDetails?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <div
            className="p-2 rounded-lg hover:bg-gray-300 cursor-pointer duration-300"
            onClick={() => setIsRejectDialogOpen(true)}
          >
            <p>reject</p>
          </div>
          <Dialog
            className="absolute w-full h-full "
            style={{ backgroundColor: "transparent" }}
            open={isRejectDialogOpen}
            onClose={() => setIsRejectDialogOpen(false)}
            maxWidth="lg"
          >
            <div className="p-10">
              <h1 className="text-xl  font-semibold">
                Write a reason on why to reject the hotel!
              </h1>
              <textarea
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-[40rem] h-[20rem] border-2 border-violet-950 rounded-md outline-none p-4 mt-4"
              ></textarea>
              {errorForm !== "" && rejectReason == "" && (
                <p className="text-red-500">{errorForm}</p>
              )}
              <div className="justify-end flex gap-4 mt-4">
                <div
                  className="p-2 rounded-md cursor-pointer bg-violet-950 text-white"
                  onClick={rejectVendor}
                >
                  <p>Send</p>
                </div>
                <div
                  onClick={() => {
                    setIsRejectDialogOpen(false);
                    setErrorForm("");
                    setRejectReason("");
                  }}
                  className="p-2 rounded-md cursor-pointer  text-black hover:bg-gray-200 duration-300"
                >
                  <p>Cancel</p>
                </div>
              </div>
            </div>
          </Dialog>
          <div
            className="p-2 rounded-lg bg-violet-950 cursor-pointer text-white"
            onClick={verifyVendor}
          >
            <p>Accept</p>
          </div>
        </div>
      </div>
    </div>
  );
}
