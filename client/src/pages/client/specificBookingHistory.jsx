import { getSpecificBookingDetils } from "../../services/client/user.service";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { calculateNights, formatDate } from "../../utils/formatDates";
import bill from "../../assets/bill.png";
import { BiCalendar, BiMoon, BiUser } from "react-icons/bi";

//TODO: So what i need to do is add proper ui validations like when the data is not found then displaying data did not found or like 404 errors
// like that
export default function SpecificBookingHistory() {
  const { booking_id } = useParams();
  const { id } = useSelector((state) => state.user);

  const [details, setDetails] = useState({});

  const navigate = useNavigate();

  const getBookingDetails = async () => {
    try {
      const res = await getSpecificBookingDetils(id, booking_id);
      console.log(res.data);
      setDetails(res.data.data);
    } catch (e) {
      console.log(e);
      // setDetails(null);
      navigate(-1);
    }
  };

  useEffect(() => {
    getBookingDetails();
  }, []);

  console.log(details);
  return (
    <div className="w-full flex justify-center">
      {details ? (
        <div className="h-fit w-[40%] p-6 rounded-lg shadow-lg border my-10">
          <h1 className="text-2xl  font-serif">Booking summary</h1>
          <div className="flex flex-col gap-6 justify-center ">
            <div className="w-full h-[12rem]">
              <img
                className="w-full h-full object-cover rounded-lg"
                src={bill}
              ></img>
            </div>
            <div className="flex flex-col gap-2">
              <p>Successful</p>
              <div className="flex  items-center justify-between">
                <div className="flex gap-2 items-center">
                  <BiCalendar />
                  <strong>Period of stay:</strong>
                </div>
                <p className="ml-2">{`${formatDate(
                  details?.booking?.check_in_date
                )} - ${formatDate(details?.booking?.check_out_date)}`}</p>{" "}
              </div>
              <div className="flex  items-center justify-between">
                <div className="flex gap-2 items-center">
                  <BiMoon />
                  <strong>Nights/Days:</strong>
                </div>
                <p className="ml-2">
                  {calculateNights(
                    details?.booking?.check_in_date,
                    details?.booking?.check_out_date
                  )}{" "}
                </p>
              </div>
              <div className="flex  items-center justify-between">
                <div className="flex gap-2 items-center">
                  <BiUser />
                  <strong>Number of people:</strong>
                </div>
                <p className="ml-2">{details?.room?.room_capacity}</p>
              </div>
              <div className="flex  items-center justify-between">
                <div className="flex gap-2 items-center">
                  <BiUser />
                  <strong>Price:</strong>
                </div>
                <p className="ml-2">NPR{details?.booking?.total_price}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p>Additional Services</p>
              <div className="flex  items-center justify-between">
                <div className="flex gap-2 items-center">
                  <BiCalendar />
                  <strong>Break fast:</strong>
                </div>
                <p className="ml-2">hehe</p>
              </div>
              <div className="flex  items-center justify-between">
                <div className="flex gap-2 items-center">
                  <BiMoon />
                  <strong>Spa:</strong>
                </div>
                <p className="ml-2">3 </p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between">
                <strong>Total price:</strong>
                <p>NPR{details?.booking?.total_price}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p>No bookings data related to it was found</p>
        </div>
      )}
    </div>
  );
}
