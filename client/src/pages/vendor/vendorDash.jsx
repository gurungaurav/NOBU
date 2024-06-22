import React, { useEffect, useState } from "react";
import { BiBookmark, BiDollar, BiStar, BiTargetLock } from "react-icons/bi";
import VendorDashCards from "../../components/vendor/vendorDashCards";
import { IoTodayOutline } from "react-icons/io5";
import { BsFillPeopleFill, BsStar, BsStarFill } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { getVendorDashBoardDetail } from "../../services/vendor/vendor.service";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { convertUnderscoresToSpaces } from "../../utils/convertURL";
import "../../global/css/scrollbar.css";
import ReviewDashMain from "../../features/vendor/review/reviewDashMain";
import RecentActivityDash from "../../features/vendor/recentActivity/recentActivityDash";
import { Pie } from "react-chartjs-2";
import "chart.js/auto"; // Import the auto plugin
import { Bar } from "react-chartjs-2";

export default function VendorDashBoard() {
  const [dashDatas, setDashDatas] = useState({});
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRooms, setTotalRooms] = useState(0);
  const [totalCancelations, setTotalCancelations] = useState(0);
  const [totalRefunds, setTotalRefunds] = useState(0);
  const [totalPending, setTotalPendings] = useState(0);
  const [totalGuests, setTotalGuests] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [totalWithComissionAmount, setTotalWithComissionAmount] = useState(0);
  const [totalCheckInToday, setTotalCheckInToday] = useState(0);
  const [totalCheckInTomorrow, setTotalCheckInTomorrow] = useState(0);
  const [totalCheckOutToday, setTotalCheckOutTomorrow] = useState(0);
  const [totalFreeRooms, setTotalFreeRooms] = useState(0);
  const [day1, setDay1] = useState(0);
  const [day2, setDay2] = useState(0);
  const [day3, setDay3] = useState(0);
  const [day4, setDay4] = useState(0);
  const [day5, setDay5] = useState(0);
  const [day6, setDay6] = useState(0);
  const [day7, setDay7] = useState(0);
  const [currentWeeksTotalBookings, setCurrentWeeksTotalBookings] = useState(0);

  const datas = [
    {
      title: "Total Revenue",
      data: `NPR ${totalWithComissionAmount}`,
      icon: <BiDollar />,
    },
    {
      title: "Total Bookings",
      data: `${totalBookings} bookings`,
      icon: <BiDollar />,
    },
    {
      title: "Arriving Today",
      data: `${totalCheckInToday} Arrivals`,
      icon: <IoTodayOutline />,
    },
    {
      title: "Arriving Tomorrow",
      data: `${totalCheckInTomorrow} Arrivals`,
      icon: <IoTodayOutline />,
    },
    {
      title: "Departing Today",
      data: `${totalCheckOutToday} Guests`,
      icon: <IoTodayOutline />,
    },
    {
      title: "Total Rooms",
      data: `${totalRooms} rooms`,
      icon: <BiDollar />,
    },
    {
      title: "Total Guests",
      data: `${totalGuests} Guests`,
      icon: <BsFillPeopleFill />,
    },
    {
      title: "Cancelations",
      data: `${totalCancelations} cancelations`,
      icon: <BsFillPeopleFill />,
    },
    {
      title: "Pending",
      data: `${totalPending} pending`,
      icon: <BsFillPeopleFill />,
    },
    {
      title: "Refund",
      data: `${totalRefunds} refunds`,
      icon: <BsFillPeopleFill />,
    },
  ];

  const { hotel_name } = useParams();
  const { jwt } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const name = convertUnderscoresToSpaces(hotel_name);

  const vendorDetails = async () => {
    try {
      const res = await getVendorDashBoardDetail(name, jwt);
      console.log(res.data);
      const data = res.data.data;
      setDashDatas(data);
      setTotalGuests(data.totalUniqueGuests);
      setTotalRooms(data.totalRooms);
      setTotalFreeRooms(data.freeRooms);
      setTotalBookings(data.allBookedRoomsCount);
      setTotalCancelations(data.allCanceledRoomsCount);
      setTotalRefunds(data.allRefundedRoomsCount);
      setTotalPendings(data.allPendingRoomsCount);
      setRecentActivity(data.recentActivity);
      setReviews(data.customerReviews);
      setTotalWithComissionAmount(data.withComissionAmount);
      setTotalCheckInToday(data.checkInToday);
      setTotalCheckInTomorrow(data.checkInTomorrow);
      setTotalCheckOutTomorrow(data.checkOutToday);
      const { dayWiseBookings } = data;
      setDay1(dayWiseBookings["Day 0"]);
      setDay2(dayWiseBookings["Day 1"]);
      setDay3(dayWiseBookings["Day 2"]);
      setDay4(dayWiseBookings["Day 3"]);
      setDay5(dayWiseBookings["Day 4"]);
      setDay6(dayWiseBookings["Day 5"]);
      setDay7(dayWiseBookings["Day 6"]);
      setCurrentWeeksTotalBookings(data.totalBookingsInCurrentWeek);
    } catch (e) {
      console.log(e.response);
      if (e.response.status == 401) {
        navigate("/error401");
      } else if (e.response.status == 404) {
        navigate("*");
      }
    }
  };

  useEffect(() => {
    vendorDetails();
  }, []);

  const roomData = [
    { label: "Available Rooms", value: totalFreeRooms },
    { label: "Pending Rooms", value: totalPending || 10 },
    { label: "Booked Rooms", value: totalBookings || 12 },
    { label: "Refunded Rooms", value: totalRefunds || 8 },
    { label: "Canceled Rooms", value: totalCancelations || 3 },
    // Add more data points as needed
  ];

  function getCurrentWeekAndMonth() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentDayOfMonth = now.getDate();
    const currentWeekOfMonth = Math.ceil(
      (currentDayOfMonth + startOfMonth.getDay()) / 7
    );
    const month = now.toLocaleString("default", { month: "long" });

    return { month, currentWeekOfMonth };
  }

  const { month, currentWeekOfMonth } = getCurrentWeekAndMonth();

  console.log(
    `Current week number: ${currentWeekOfMonth}, Current month: ${month}`
  );

  const bookingTrends = {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
    datasets: [
      {
        label: `Number of Bookings ${currentWeeksTotalBookings}`,
        data: [day1, day2, day3, day4, day5, day6, day7],
        fill: false,
        backgroundColor: [
          "#FF6384", // Red
          "#36A2EB", // Blue
          "#FFCE56", // Yellow
          "#00FF00", // Green
          "#8A2BE2", // Purple
          "#FF9F40", // Orange
          "#4BC0C0", // Teal
        ],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const chartData = {
    labels: roomData.map((data) => data.label),
    datasets: [
      {
        data: roomData.map((data) => data.value),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FFFF00",
          "#00FF00",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FFFF00",
          "#00FF00",
        ],
      },
    ],
  };

  return (
    <div className="p-5 px-8 w-full">
      <div className=" w-[83rem]">
        <Swiper
          rewind={true}
          spaceBetween={20}
          slidesPerView={4}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          modules={[Autoplay]}
          className="mySwiper text-xl font-semibold  gap-6 "
        >
          {datas.map((slides) => (
            <SwiperSlide className="pb-2">
              <VendorDashCards
                title={slides.title}
                icon={slides.icon}
                data={slides.data}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="grid grid-cols-3 gap-6 mt-4">
        <div className="col-span-1 flex flex-col items-center gap-4 justify-center rounded-lg p-4 shadow-sm border bg-white ">
          <h1 className="text-3xl font-semibold">Rooms Availability</h1>
          <Pie data={chartData} />
        </div>
        <div className="col-span-2 flex flex-col gap-4 bg-white p-4 rounded-lg border shadow-sm ">
          <h2 className="font-semibold">
            Booking Counts for {month} (Last 7 days of Week {currentWeekOfMonth}
            )
          </h2>
          <Bar data={bookingTrends} options={options} />
        </div>
      </div>
      <div className="flex gap-6">
        <RecentActivityDash recentActivity={recentActivity} />
        <ReviewDashMain reviews={reviews} />
      </div>
    </div>
  );
}
