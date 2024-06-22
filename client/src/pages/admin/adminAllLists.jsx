import React, { useEffect, useState } from "react";
import bill from "../../assets/bill.png";
// import { getVendorsToVerify, rejectVendorHotel, verifyVendorHotel } from "../../services/admin/admin";

import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/formatDates";
import {
  updateHotelStatus,
  verifiedHotels,
} from "../../services/admin/admin.service";
import { FaEdit } from "react-icons/fa";

export default function AdminAllLists() {
  //!Need to use jwt verification
  const [hotelDetails, setHotelDetails] = useState([]);
  const [searchName, setSearchName] = useState("");

  const { id, jwt } = useSelector((state) => state.user);
  const [selectedStatus, setSelectedStatus] = useState(""); // State to hold selected status
  const [editableHotelId, setEditableHotelId] = useState(null); // State to hold the hotel id being edited

  const getAllHotels = async () => {
    try {
      const res = await verifiedHotels();
      setHotelDetails(res.data.data);
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAllHotels();
  }, []);

  const navigate = useNavigate();

  const handleNavigate = (hotel_id) => {
    navigate(`/admin/${id}/hotelDetails/${hotel_id}`);
    console.log("sdh");
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleEdit = (hotel_id) => {
    setEditableHotelId(hotel_id);
  };

  console.log(selectedStatus, "jajaj");
  const handleSaveStatus = async (hotel_id) => {
    try {
      await updateHotelStatus(hotel_id, selectedStatus, jwt);
      setEditableHotelId(null);
      getAllHotels();
    } catch (error) {
      console.log(error);
    }
    setEditableHotelId(null);
  };

  //!Search filter
  const filteredHotels = hotelDetails.filter((hotel) =>
    hotel.hotel_name.toLowerCase().includes(searchName.toLowerCase())
  );

  //!Need to use jwt verification
  //!When vendor is verified a mail goes to that vendor for notifying that his hotel is granted same goes to rejection
  return (
    <div className="px-8 flex flex-col w-full ">
      <div className="font-semibold text-xl mt-2">
        <p>All Hotels</p>
        <div class="relative w-[30rem] border flex items-center justify-between rounded-full mt-2">
          <svg
            class="absolute left-2 block h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" class=""></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65" class=""></line>
          </svg>
          <input
            type="name"
            name="search"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            class="h-10 w-full text-sm cursor-text rounded-full border bg-slate-200 py-2 pr-40 pl-12  outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder=" Search hotel by name"
          />
        </div>
        {/* <p>Review and approve or reject hotel listings</p> */}
        {/* <h1 className="mt-4 text-2xl font-bold">New submissions</h1> */}
        <div className="h-[520px] mt-4 overflow-auto border bg-white rounded-t-lg custom-scrollbar">
          <table className="w-full">
            <thead className=" z-30 sticky font-semibold top-0 border-b bg-gray-100 h-[3rem] text-sm ">
              <tr>
                <td className="px-4 py-2 font-bold text-center w-[14rem]">
                  Images
                </td>
                <th className="px-4 py-2">Hotel name</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filteredHotels?.map((hotel, index) => (
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
                  <td className="px-4 py-2 w-[12rem]">
                    <p className="text-center">{hotel?.phone_number}</p>
                  </td>
                  <td className="px-4 py-2 w-[12rem]">
                    <p className="text-center">{hotel?.email}</p>
                  </td>
                  <td className="px-4 py-2 w-[12rem]">
                    {editableHotelId === hotel.hotel_id ? (
                      <div className="flex items-center justify-center gap-2">
                        <select
                          value={selectedStatus}
                          onChange={handleStatusChange}
                          className="text-center border border-gray-300 rounded-lg p-1 focus:outline-none"
                        >
                          <option value="Verified">Verified</option>
                          <option value="Not_Verified">Not Verified</option>
                        </select>
                        <button
                          className="bg-blue-500 text-white px-2 py-1 text-xs rounded-lg cursor-pointer"
                          onClick={() => handleSaveStatus(hotel.hotel_id)}
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <div
                          className={`p-[6px] rounded-full ${
                            hotel.hotel_verified ? "bg-green-400" : "bg-red-400"
                          } w-fit`}
                        ></div>
                        <p className="text-center">
                          {hotel.hotel_verified ? "Verified" : "Not Verified"}
                        </p>
                        <FaEdit
                          className="cursor-pointer hover:text-black duration-300"
                          onClick={() => handleEdit(hotel.hotel_id)}
                        />
                      </div>
                    )}
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
          </table>
        </div>
      </div>
    </div>
  );
}
