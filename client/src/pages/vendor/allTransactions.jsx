import { Listbox, Menu, Transition } from "@headlessui/react";
import { Pagination, Stack } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaEye, FaUpDown } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { SiCheckio } from "react-icons/si";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getPaymentDetailsAll } from "../../services/vendor/vendor.service";
import { useSelector } from "react-redux";
import { formatCurrentDates } from "../../utils/formatDates";
import AnimatedProfile from "../../components/animated/animatedProfile";

export default function AllTransactions() {
  const filterTypes = [
    { type: "All" },
    { type: "Oldest" }, // Add Oldest option
    { type: "Newest" }, // Add Newest option
  ];
  const [selected, setSelected] = useState(filterTypes[0]);

  const { hotel_name } = useParams();
  const { id, jwt } = useSelector((state) => state.user);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [totalNumbers, setTotalNumbers] = useState(0);
  const [totalRefunds, setTotalRefunds] = useState(0);
  const [totalSuccess, setTotalSuccess] = useState(0);
  const [limit, setLimit] = useState(0);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const pageNumber = queryParams.get("page") || 1;

  const [totalDetails, setTotalDetails] = useState(false);
  const [totalRefund, setTotalRefund] = useState(
    queryParams.get("refund") || false
  );
  const [totalSuccessPayments, setTotalSuccessPayments] = useState(
    queryParams.get("success") || false
  );

  const [totalPages, setTotalPages] = useState(1);

  const allTransactionsDetails = async () => {
    let params = {};
    if (totalSuccessPayments) {
      params["success"] = true;
      console.log("haha");
    } else if (totalRefund) {
      params["refund"] = true;
    }
    try {
      const res = await getPaymentDetailsAll(
        hotel_name,
        pageNumber,
        params,
        jwt
      );
      console.log(res.data);
      setPaymentDetails(res.data.data.paymentDetails);
      setLimit(res.data.data.limit);
      setTotalPages(
        Math.ceil(res.data.data.totalDetails / res.data.data.limit)
      );
      setTotalNumbers(res.data.data.total);
      setTotalRefunds(res.data.data.totalRefund);
      setTotalSuccess(res.data.data.totalSuccess);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!queryParams.get("refund") && !queryParams.get("success")) {
      setTotalDetails(true);
    }
    allTransactionsDetails();
  }, [pageNumber, totalRefund, totalSuccessPayments]);

  const navigate = useNavigate();

  const handlePagination = (pageNumber) => {
    queryParams.set("page", pageNumber);
    navigate(`/vendor/${hotel_name}/paymentLists?${queryParams.toString()}`);
  };

  const handleQuery = (type) => {
    switch (type) {
      case "refund":
        queryParams.set("refund", true);
        queryParams.delete("success");
        queryParams.delete("page");

        setTotalRefund(true);
        setTotalSuccessPayments(false);
        setTotalDetails(false);

        break;
      case "success":
        queryParams.set("success", true);
        queryParams.delete("refund");
        queryParams.delete("page");

        setTotalSuccessPayments(true);
        setTotalRefund(false);
        setTotalDetails(false);
        break;
      case "allDetails":
        // queryParams.set("success", true);
        queryParams.delete("refund");
        queryParams.delete("success");
        queryParams.delete("page");

        setTotalDetails(true);
        setTotalSuccessPayments(false);
        setTotalRefund(false);
        break;
      default:
        break;
    }
    navigate(`/vendor/${hotel_name}/paymentLists?${queryParams.toString()}`);
  };

  const filterPaymentsByDate = (paymentDetails, filterOption) => {
    return paymentDetails.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return filterOption === "Oldest" ? dateA - dateB : dateB - dateA;
    });
  };

  const handlePageChange = (pageNumber) => {
    queryParams.set("page", pageNumber);
    navigate(`/vendor/${hotel_name}/paymentLists?${queryParams.toString()}`);
  };

  return (
    <div className="px-8 flex flex-col w-full ">
      <div className="font-semibold text-xl mt-2 ">
        <p>All Payments</p>
      </div>
      <div className="flex justify-between items-center border-b ">
        <div className="flex gap-6 items-center font-semibold w-fit pt-2  rounded-xl text-sm  ">
          <div
            className={`pb-2 ${
              totalDetails && " border-b-2  border-b-violet-950 "
            }  `}
            onClick={() => handleQuery("allDetails")}
          >
            <p className="cursor-pointer">
              {" "}
              All Payments ({totalNumbers ? totalNumbers : 0})
            </p>
          </div>
          <div
            className={`pb-2 ${
              totalSuccessPayments && "border-b-2  border-b-violet-950 "
            }  `}
            onClick={() => handleQuery("success")}
          >
            <p className="cursor-pointer">
              Successful Payments ({totalSuccess ? totalSuccess : 0})
            </p>
          </div>
          <div
            className={`pb-2 ${
              totalRefund && "border-b-2  border-b-violet-950 "
            }  `}
            onClick={() => handleQuery("refund")}
          >
            <p className="cursor-pointer">
              Refunded Payments ({totalRefunds ? totalRefunds : 0})
            </p>
          </div>
        </div>
        <div className="">
          <Listbox
            value={selected}
            onChange={(value) => {
              const filteredPayments = filterPaymentsByDate(
                paymentDetails,
                value.type
              );
              setPaymentDetails(filteredPayments);
              setSelected(value);
            }}
          >
            <div className="relative mt-1 z-30 w-[10rem]">
              <Listbox.Button className="relative w-full  rounded-lg bg-white py-2 pl-3 pr-10 text-left border cursor-pointer focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate text-center">
                  {selected.type}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <FaUpDown
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-white py-1 text-base  ring-1 ring-black/5 focus:outline-none sm:text-sm">
                  {filterTypes.map((type, index) => (
                    <Listbox.Option
                      key={index}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? "bg-amber-100 text-amber-900"
                            : "text-gray-900"
                        }`
                      }
                      value={type}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {type.type}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>
      <div className="h-[520px] mt-4 overflow-auto border bg-white rounded-t-lg custom-scrollbar">
        <table className="w-full">
          <thead className=" z-20 sticky font-semibold top-0 border-b bg-gray-100 h-[3rem] text-sm ">
            <tr>
              <th className="px-4 py-4 font-semibold">Payment ID </th>
              <th className="px-4 py-4 font-semibold">Guest</th>
              <th className="px-4 py-4 font-semibold">Booking ID </th>
              <th className="px-4 py-4 font-semibold">Payment Date</th>
              <th className="px-4 py-4 w-[12rem] font-semibold">
                <p>Payment Method</p>
              </th>
              <th className="px-4 py-4 font-semibold">Amount</th>
              <th className="px-4 py-4 font-semibold">Status</th>
              {/* <th className="px-4 py-2">Status</th> */}
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
                    <AnimatedProfile details={payment?.user} />
                  </div>
                </td>
                <td className="px-20 w-[10rem] h-[4rem]">
                  <p>#{payment?.payment_id}</p>
                </td>
                <td className="px-4 w-[12rem] h-[4rem]">
                  <p className="text-center">
                    {formatCurrentDates(payment?.createdAt)}
                  </p>
                </td>
                <td className="px-4  w-[12rem] h-[4rem]">
                  <div className="flex flex-wrap gap-1 justify-center">
                    <p className="text-center">
                      {/* {formatCurrentDates(book.check_in_date)} */}
                      {payment?.method}
                    </p>
                  </div>
                </td>
                <td className="px-4  w-[12rem] h-[4rem]">
                  <p className="text-center">NPR {payment?.amount}</p>
                </td>
                <td className="px-4 py-2 w-[12rem] h-[4rem]">
                  {payment?.status == "success" ? (
                    <p className="text-center text-green-400"> Success</p>
                  ) : (
                    <p className="text-center text-red-400">Refund </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mb-2 border-b border-r border-l bg-gray-100 rounded-b-lg items-center ">
        {/* <p className="text-xs tracking-wide font-semibold pl-4">
          Showing: {(pageNumber - 1) * limit + 1} -{" "}
          {Math.min(pageNumber * limit, totalDetails)} of {totalDetails}
        </p> */}
        <Stack spacing={2} className="p-2">
          <Pagination
            count={totalPages}
            page={pageNumber}
            onChange={(event, value) => handlePageChange(value)}
            variant="outlined"
            className=""
            size="medium"
          />
        </Stack>
      </div>
    </div>
  );
}
