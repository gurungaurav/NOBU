import React, { useEffect, useState } from "react";
import { getAllTransactionsAdmin } from "../../services/admin/admin.service";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { formatCurrentDates } from "../../utils/formatDates";
import { MenuItem, Pagination, Select, Stack } from "@mui/material";

export default function AdminAllTransactions() {
  const filterTypes = [
    { type: "Oldest" }, // Add Oldest option
    { type: "Newest" }, // Add Newest option
  ];

  const [totalComissionAmount, setTotalComissionAmount] = useState(0);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const { hotel_name } = useParams();
  const { id, jwt } = useSelector((state) => state.user);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [totalNumbers, setTotalNumbers] = useState(0);
  const [limit, setLimit] = useState(0);
  const [selected, setSelected] = useState(queryParams.get("time") || "All"); // Set initial state to "All" string
  const [selectedHotel, setSelectedHotel] = useState(
    queryParams.get("hotel") || "All"
  );
  const [allHotels, setAllHotels] = useState([]);

  const pageNumber = parseInt(queryParams.get("page")) || 1;

  const [totalPages, setTotalPages] = useState(1);

  const allTransactionsDetails = async () => {
    try {
      const res = await getAllTransactionsAdmin(
        id,
        pageNumber,
        selected,
        selectedHotel
      );
      console.log(res.data);
      setPaymentDetails(res.data.data.paymentDetails);
      setLimit(res.data.data.limit);
      setTotalPages(Math.ceil(res.data.data.total / res.data.data.limit));
      setTotalNumbers(res.data.data.total);
      setTotalComissionAmount(res.data.data.totalComissionAmount);
      const uniqueHotels = new Map();

      res.data.data.paymentDetails.forEach((payment) => {
        const hotelId = payment.hotel.hotel_id;
        const hotelName = payment.hotel.hotel_name;

        if (!uniqueHotels.has(hotelId)) {
          uniqueHotels.set(hotelId, { hotelId, hotelName });
        }
      });

      const uniqueHotelsArray = Array.from(uniqueHotels.values());
      setAllHotels(uniqueHotelsArray);
    } catch (e) {
      console.log(e);
    }
  };

  console.log(allHotels);

  useEffect(() => {
    allTransactionsDetails();
  }, [pageNumber, selected, selectedHotel]);

  const navigate = useNavigate();

  const handlePagination = (pageNumber) => {
    queryParams.set("page", pageNumber);
    navigate(`/admin/${id}/allTransactions?${queryParams.toString()}`);
  };

  // const filterPaymentsByDate = (paymentDetails, filterOption) => {
  //   return paymentDetails.sort((a, b) => {
  //     const dateA = new Date(a.createdAt);
  //     const dateB = new Date(b.createdAt);
  //     return filterOption === "Oldest" ? dateA - dateB : dateB - dateA;
  //   });
  // };

  const handleFilterTime = (value) => {
    setSelected(value);
    console.log(value);
    if (value !== "All") {
      queryParams.set("time", value);
    } else {
      queryParams.delete("time");
    }
    navigate(`/admin/${id}/allTransactions?${queryParams.toString()}`);
  };

  //!For filtering transactions according to the hotels
  const handleFilterHotel = (value) => {
    console.log(value);
    setSelectedHotel(value);
    if (value !== "All") {
      queryParams.set("hotel", value);
    } else {
      queryParams.delete("hotel");
    }
    navigate(`/admin/${id}/allTransactions?${queryParams.toString()}`);
  };
  console.log(selectedHotel);
  console.log(selected);
  //TODO: Need to take only 10 percent comission lol
  return (
    <div className="px-8 flex flex-col w-full ">
      <div className="font-semibold text-xl mt-2">
        <p>All Payments </p>
      </div>
      <p className="text-sm text-gray-400 font-semibold">
        You have total {totalNumbers} payments
      </p>
      <div className="flex justify-between items-center">
        <div className="flex items-center font-semibold w-fit pt-2 rounded-xl text-sm  ">
          <div>
            <p className="">Total comission is: NPR {totalComissionAmount}</p>
          </div>
        </div>

        <div className="flex  gap-2 items-centaer">
          <div>
            <Select
              value={selectedHotel}
              onChange={(event) => handleFilterHotel(event.target.value)}
              variant="outlined"
              className="w-[8rem] bg-white h-[35px]"
            >
              <MenuItem value="All">All</MenuItem>
              {allHotels.map((hotel, index) => (
                <MenuItem key={index} value={hotel.hotelName}>
                  {hotel.hotelName}
                </MenuItem>
              ))}
            </Select>
          </div>
          <Select
            value={selected}
            onChange={(event) => handleFilterTime(event.target.value)}
            variant="outlined"
            className="w-[8rem] bg-white h-[35px]"
          >
            <MenuItem value="All">All</MenuItem>
            {filterTypes.map((type, index) => (
              <MenuItem key={index} value={type.type}>
                {type.type}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
      <div className="h-[520px] mt-4 overflow-auto border bg-white rounded-t-lg custom-scrollbar">
        <table className="w-full">
          <thead className=" z-30 sticky font-semibold top-0 border-b bg-gray-100 h-[3rem] text-sm ">
            <tr>
              <th className="px-4 py-4 font-semibold">Payment ID </th>
              <th className="px-4 py-4 font-semibold">Hotel</th>
              <th className="px-4 py-4 font-semibold">Date</th>
              <th className="px-4 py-4 font-semibold">Total Amount</th>
              <th className="px-4 py-4 font-semibold">Comission Amount</th>
              <th className="px-4 py-4 w-[12rem] font-semibold">
                <p>Payment Method</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {paymentDetails?.map((payment, index) => (
              <tr
                key={index}
                className="border-b text-xs font-semibold text-gray-500"
              >
                <td className="px-20 w-[10rem] h-[4rem]">
                  <p>#{payment?.payment_id}</p>
                </td>
                <td className="px-4 w-[15rem] h-[4rem]">
                  <div
                    className="flex justify-center items-center"
                    onClick={() =>
                      navigate(
                        `/vendor/${hotel_name}/guestsLists/guestDetails/${payment?.user?.user_id}`
                      )
                    }
                  >
                    <p>{payment?.hotel?.hotel_name}</p>
                  </div>
                </td>
                <td className="px-4 w-[12rem] h-[4rem]">
                  <p className="text-center">
                    {formatCurrentDates(payment?.createdAt)}
                  </p>
                </td>
                <td className="px-4  w-[12rem] h-[4rem]">
                  <p className="text-center">NPR {payment?.amount}</p>
                </td>
                <td className="px-4  w-[12rem] h-[4rem]">
                  <p className="text-center">NPR {payment?.comissionAmount}</p>
                </td>
                <td className="px-4  w-[12rem] h-[4rem]">
                  <div className="flex flex-wrap gap-1 justify-center">
                    <p className="text-center">Khalti</p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mb-2 border-b border-r border-l bg-gray-100 rounded-b-lg items-center ">
        <p className="text-xs tracking-wide font-semibold pl-4">
          Showing: {(pageNumber - 1) * limit + 1} -{" "}
          {Math.min(pageNumber * limit, totalNumbers)} of {totalNumbers}
        </p>
        <Stack spacing={2} className="p-2">
          <Pagination
            count={totalPages}
            page={pageNumber}
            onChange={(event, value) => handlePagination(value)}
            variant="outlined"
            className=""
            size="medium"
          />
        </Stack>
      </div>
    </div>
  );
}
