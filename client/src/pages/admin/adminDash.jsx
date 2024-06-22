import React, { useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa6";
import { Line, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { getDashBoardDetailsAdmin } from "../../services/admin/admin.service";
import { useSelector } from "react-redux";
import { CiCalendar } from "react-icons/ci";

export default function AdminDash() {
  const [dashboardDetails, setDashboardDetails] = useState({});
  const [totalHotels, setTotalHotels] = useState(0);
  const [totalUnVerifiedHotels, setTotalUnVerifiedHotels] = useState(0);
  const [totalVerifiedHotels, setTotalVerifiedHotels] = useState(0);
  const [totalComission, setTotalComission] = useState(0);
  const [weeklyCommissions, setWeeklyCommissions] = useState({});
  const [totalMonthlyComissionNumber, setTotalMonthlyComissionNumber] =
    useState(0);
  const [totalMonthlyComission, setTotalMonthlyComission] = useState(0);
  const [totalNumberOfBookings, setTotalNumberOfBookings] = useState(0);

  const { id } = useSelector((state) => state.user);

  const VendorData = [
    { label: "Total Vendors", value: 10 },
    { label: "Verified Vendors", value: 5 },
    { label: "Unverified Vendors", value: 15 },
  ];

  const chartData = {
    labels: VendorData.map((data) => data.label),
    datasets: [
      {
        data: VendorData.map((data) => data.value),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const lineChartData = {
    labels: Object.keys(weeklyCommissions),
    datasets: [
      {
        label: "Weekly Commissions",
        data: Object.values(weeklyCommissions),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const getDashboardDetails = async () => {
    try {
      const res = await getDashBoardDetailsAdmin(id);
      setDashboardDetails(res.data);
      console.log(res.data);
      let data = res.data.data;
      setTotalHotels(data.totalVendors);
      setTotalVerifiedHotels(data.totalVerifiedVendors);
      setTotalUnVerifiedHotels(data.totalUnVerifiedVendors);
      setTotalComission(data.totalComission);
      setWeeklyCommissions(data.weeklyCommissions);
      setTotalMonthlyComissionNumber(data.totalTransactionsMonth.length);
      setTotalNumberOfBookings(data.totalBookings);
      setTotalMonthlyComission(
        data.totalTransactionsMonth.reduce(
          (hehe, comission) => hehe + comission.commission,
          0
        )
      );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getDashboardDetails();
  }, []);

  return (
    <div className="pt-4 w-full gap-4 flex flex-col">
      {/* <div className="border-b px-10 pb-2">
        <h1 className="font-sans text-2xl font-semibold">Welcome, Hency</h1>
        <p className="text-violet-950 font-semibold text-sm mt-2">
          This is your dashboard
        </p>
      </div> */}
      <div className="px-8 flex flex-col gap-4">
        <div className="grid grid-cols-4 text-xl font-semibold gap-6 ">
          {/* {[1, 2, 3, 4].map((items) => ( */}
          <div
            // key={items}
            className="px-6 py-4 rounded-lg border shadow-sm flex justify-between items-center bg-white"
          >
            <div>
              <p className="text-sm">Total earnings</p>
              <p className="font-semibold">NPR {totalComission}</p>
            </div>
            <FaRupeeSign />
          </div>
          <div
            // key={items}
            className="px-6 py-4 rounded-lg border shadow-sm flex justify-between items-center bg-white"
          >
            <div>
              <p className="text-sm">Total number of Bookings</p>
              <p className="font-semibold"> {totalNumberOfBookings}</p>
            </div>
            <CiCalendar />
          </div>
          {/* ))} */}
        </div>
        <div className="grid grid-cols-3 gap-2 w-full">
          <div className="rounded-lg  col-span-1 items-center justify-center flex flex-col gap-4 bg-white py-4 px-10 shadow-md">
            <h1 className="text-xl font-semibold">Hotel's Survey</h1>
            <div className="flex gap-6 w-full">
              {VendorData.map((status) => (
                <div className="flex justify-around items-start">
                  <div className="flex flex-col items-center ">
                    <p className="font-semibold text-xl">{status.value}</p>
                    <p className="text-sm">{status.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <Pie data={chartData} />
          </div>

          <div className="rounded-lg col-span-2 bg-white py-4 px-10 shadow-md w-full">
            <h1 className="text-xl font-semibold mb-4">
              Weekly Revenue (Current{" "}
              {new Date().toLocaleString("default", { month: "long" })}) NPR{" "}
              {totalMonthlyComission}
            </h1>
            <Line data={lineChartData} />
          </div>
        </div>
      </div>
    </div>
  );
}
