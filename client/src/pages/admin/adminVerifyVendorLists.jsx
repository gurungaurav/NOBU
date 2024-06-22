import React, { useEffect, useState } from "react";
import bill from "../../assets/bill.png";
// import { getVendorsToVerify, rejectVendorHotel, verifyVendorHotel } from "../../services/admin/admin";

import { useSelector } from "react-redux";
import {
  getVendorsToVerify,
  rejectVendorHotel,
  verifyVendorHotel,
} from "../../services/admin/admin.service";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/formatDates";

//TODO: Need to make the admin ui
export default function AdminVerifyVendorsLists() {
  //!Need to use jwt verification
  const [hotelDetails, setHotelDetails] = useState([]);

  const { id, jwt } = useSelector((state) => state.user);
  const getAllHotelsVerify = async () => {
    try {
      const res = await getVendorsToVerify();
      setHotelDetails(res.data.data);
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAllHotelsVerify();
  }, []);

  const navigate = useNavigate();

  const handleNavigate = (hotel_id) => {
    navigate(`/admin/${id}/VerifyVendors/${hotel_id}`);
    console.log("sdh");
  };

  //!Need to use jwt verification
  //!When vendor is verified a mail goes to that vendor for notifying that his hotel is granted same goes to rejection
  return (
    <div className="px-8 flex flex-col w-full ">
      {/* <div className="font-semibold text-xl mt-2"> */}
      <p className="font-semibold text-xl mt-2">Pending Hotels</p>
      <p className="text-sm">Review and approve or reject hotel listings</p>
      <div className="">
        <div className="h-[520px] mt-4 overflow-auto border bg-white rounded-t-lg custom-scrollbar">
          <table className="w-full">
            <thead className=" z-30 sticky font-semibold top-0 border-b bg-gray-100 h-[3rem] text-sm ">
              <tr>
                <td className="px-4 py-2 font-bold text-center w-[14rem]">
                  Images
                </td>
                <th className="px-4 py-2">Hotel name</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Applied by</th>
                <th className="px-4 py-2">Applied on</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            {hotelDetails.length > 0 ? (
              <tbody>
                {hotelDetails?.map((hotel, index) => (
                  <tr
                    key={index}
                    className="border-b text-xs font-semibold text-gray-500"
                  >
                    <td className="px-4 py-2">
                      <div className="w-[12rem] h-[5rem] rounded-xl ">
                        <img
                          className="w-full h-full object-cover rounded-xl"
                          src={hotel.main_picture}
                          alt="Hotel"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <p className="text-center">{hotel.hotel_name}</p>
                    </td>
                    <td className="px-4 py-2 w-[15rem]">
                      <p className="text-center">{hotel?.location}</p>
                    </td>
                    <td className="px-4 py-2 w-[15rem]">
                      <p className="text-center">
                        {hotel?.vendor?.vendor_name}
                      </p>
                    </td>
                    <td className="px-4 py-2 w-[12rem]">
                      <p className="text-center">
                        {formatDate(hotel?.createdAt)}
                      </p>
                    </td>

                    <td className="px-2 flex flex-col items-center relative h-[7rem] justify-center">
                      <div
                        onClick={() => handleNavigate(hotel.hotel_id)}
                        className="text-center bg-violet-950 rounded-lg p-2 hover:bg-violet-900 duration-500 cursor-pointer text-white"
                      >
                        <p>View details</p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <div className=" flex flex-col items-center justify-center text-xl font-semibold w-[20rem]">
                <p>No listed hotels yet to verify!</p>
              </div>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
