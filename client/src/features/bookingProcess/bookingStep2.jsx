import React, { useEffect, useState } from "react";
import { bookRooms } from "../../services/hotels/hotels.service";
import KhaltiCheckout from "khalti-checkout-web";
import { toast } from "react-toastify";
import {
  getSpecificBookingDetils,
  paymentConfirmation,
} from "../../services/client/user.service";
import { useSelector } from "react-redux";
import khalti from "../../assets/khalti.png";
import esewa from "../../assets/esewa.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { formatCurrentDates } from "../../utils/formatDates";

export default function BookingStep2({
  formik,
  room_id,
  hotel_id,
  handleNextStep,
}) {
  const { id, jwt } = useSelector((state) => state.user);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [booking_id, setBooking_id] = useState("");
  const [bookingDetails, setBookingDetails] = useState({});
  const total_price = formik.values.total_price;

  const form = {
    check_in_date: formik.values.check_in,
    check_out_date: formik.values.check_out,
    total_price,
    additionalServices: formik.values.additionalServices,
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  useEffect(() => {
    if (queryParams.get("booking_id")) {
      setBooking_id(parseInt(queryParams.get("booking_id")));
      // bookingDetailsGet(parseInt(queryParams.get("booking_id")));
    }
    console.log(queryParams.get("booking_id"));
  }, [queryParams, booking_id]);

  const getBookingDetails = async () => {
    try {
      const res = await getSpecificBookingDetils(id, booking_id);
      setBookingDetails(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };
  console.log(selectedMethod);
  const bookRoom = async (e) => {
    e.preventDefault();

    //!So how this works is like when the user has not payed the room or like if the user has reserved the room
    //! Then the user will try to redirect to this component by viewing the details or like to pay the bookings right
    //! Then the booking_id will be sent to the params as a query so if the params includes the booking_id then i will know the user
    //! is trying to pay the room or book the room then the user books it if the params dosenot have the booking_id then the
    //! user is a newly for the booking and this is done because on my function the booking is created then the payment is done right
    //! so if the user dosent pay then the booking id has already created then that booking id is used to proceed the payment
    // Cuz we should not create the new one so the condition is checked if the booking id is already existed then the booking api is not fetched

    try {
      //!This is for if the booking id is not present that means the user is trying to book a latest room
      //!This is done because the booking api's function is called everytime the payment is done so if the booking id or the user has already
      //! Booked the room but havent done the payment which basically means reserving the room then this function is not invoked instead the else
      //! is invoked as the user as already done the reservation only the payment is needed so yeah heheh
      if (queryParams.get("booking_id") == null) {
        const res = await bookRooms(id, room_id, jwt, form);
        console.log(res.data);
        console.log("booking bina");
        const test_secret_key = import.meta.env.VITE_KHALTI_TEST_SECRET_KEY;

        console.log(test_secret_key);

        if (selectedMethod === "Khalti") {
          let config = {
            publicKey: "test_public_key_c1711563f7894de58e18b02f4b7c6715",
            productIdentity: res.data.data.booking_id,
            productName: "booking",
            productUrl: "https://hehe.com",
            eventHandler: {
              onSuccess(payload) {
                // hit merchant api for initiating verfication
                console.log(payload, "sshs");

                const details = {
                  token: payload?.token,
                  amount: payload?.amount,
                };
                comfirmPay(payload?.product_identity, details);
              },
              onError(error) {
                // handle errors
                console.log(error);
              },
              onClose() {
                console.log("widget is closing");
                toast.error(
                  "Looks like you have not done the payment! The room is reserved for now you can do the payment later on for the bookings!"
                );
                navigate(`/mainHotel/${hotel_id}/room/${room_id}`);
              },
            },
            paymentPreference: ["KHALTI"],
          };
          // Create a new instance of KhaltiCheckout with the config
          let checkout = new KhaltiCheckout(config);

          // Display the Khalti payment UI
          checkout.show({ amount: parseInt(total_price) });
        } else {
          esewaCall(res.data.data);
        }
      } else {
        console.log("booking sita");
        const test_secret_key = import.meta.env.VITE_KHALTI_TEST_SECRET_KEY;
        getBookingDetails();
        console.log(test_secret_key);
        if (selectedMethod === "Khalti") {
          let config = {
            // replace this key with yours
            publicKey: "test_public_key_c1711563f7894de58e18b02f4b7c6715",
            productIdentity: booking_id,
            productName: "booking",
            productUrl: "https://hehe.com",
            eventHandler: {
              onSuccess(payload) {
                // hit merchant api for initiating verfication
                console.log(payload, "sshs");

                const details = {
                  token: payload?.token,
                  amount: payload?.amount,
                };
                comfirmPay(payload?.product_identity, details);
              },
              // onError handler is optional
              onError(error) {
                // handle errors
                console.log(error);
              },
              onClose() {
                console.log("widget is closing");
                toast.error(
                  "Looks like you have not done the payment! The room has been reserved as you havent done the payment!"
                );
                navigate(`/mainHotel/${hotel_id}/room/${room_id}`);
              },
            },
            paymentPreference: ["KHALTI"],
          };
          // Create a new instance of KhaltiCheckout with the config
          let checkout = new KhaltiCheckout(config);

          // Display the Khalti payment UI
          checkout.show({ amount: parseInt(total_price) });

          toast.success(res.data.message);
        } else {
          esewaCall(bookingDetails?.booking);
        }
      }
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  const esewaCall = (payment) => {
    try {
      console.log("payment esewa ", payment);
      //!Using pid cuz the esewa id should be unique
      const pid = uuidv4();

      var path = "https://uat.esewa.com.np/epay/main";
      var params = {
        amt: payment.total_price,
        psc: 0,
        pdc: 0,
        txAmt: 0,
        tAmt: payment.total_price,
        pid: pid,
        scd: "EPAYTEST",
        su: `http://localhost:3000/mainHotel/${hotel_id}/room/${room_id}/bookingProcess?booking_id=${payment.booking_id}&esewa=true&capacity=${formik.values.capacity}&price=${formik.values.total_price}&token=${pid}`,
        fu: `http://localhost:3000/mainHotel/${hotel_id}/room/${room_id}`,
      };
      console.log(params);
      var form = document.createElement("form");
      form.setAttribute("method", "POST");
      form.setAttribute("action", path);
      for (var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);
        form.appendChild(hiddenField);
      }
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.log("esewa error", error);
    }
  };

  const comfirmPay = async (id, details) => {
    try {
      const res = await paymentConfirmation(id, details, hotel_id);
      toast.success(res.data.message);
      handleNextStep();
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
  };

  //!Last check in date for refund
  let checkIn = queryParams.get("check_in");
  let deadLine = new Date(checkIn);
  deadLine.setDate(deadLine.getDate() - 1);

  return (
    <div className="flex flex-col gap-6 w-[31rem]">
      <div className="border border-gray-200 px-8  rounded-lg shadow-sm  mt-6 py-6">
        <p className="text-xl mb-4 font-semibold">Payment Method</p>
        <div className=" flex  gap-6 items-center">
          <label
            className={`flex items-center border-2 px-4 rounded-md cursor-pointer ${
              selectedMethod === "Khalti" && "border-violet-950"
            }`}
          >
            <input
              type="radio"
              className="form-radio text-indigo-600 accent-violet-950  focus:ring-indigo-500 h-4 w-4 cursor-pointer"
              value="Khalti"
              checked={selectedMethod === "Khalti"}
              onChange={() => handleMethodChange("Khalti")}
            />
            <span className="ml-2 text-gray-700 cursor-pointer font-semibold">
              Khalti
            </span>
            <img className="w-20 ml-4 h-20 " src={khalti}></img>
          </label>
          <label
            className={`flex items-center border-2 px-4 rounded-md cursor-pointer ${
              selectedMethod === "Esewa" && "border-green-500"
            }`}
          >
            <input
              type="radio"
              className="form-radio text-indigo-600 accent-green-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
              value="Esewa"
              checked={selectedMethod === "Esewa"}
              onChange={() => handleMethodChange("Esewa")}
            />
            <span className="ml-2 text-gray-700 cursor-pointer font-semibold">
              Esewa
            </span>
            <img className="w-20 ml-4 h-20" src={esewa}></img>
          </label>
        </div>
        <button
          className={`w-full mt-6 py-2 rounded-md font-semibold text-white bg-purple-950 hover:bg-opacity-90 duration-300 ${
            !selectedMethod && "cursor-not-allowed opacity-50"
          }`}
          onClick={(e) => bookRoom(e)}
          disabled={!selectedMethod}
        >
          Pay with {selectedMethod}
        </button>
      </div>
      <div className="flex flex-col gap-12 border rounded-lg p-6 shadow-sm">
        <div>
          <p className="text-xl font-semibold">Cancellation policy</p>
          <p className="font-semibold text-sm my-2">
            Free cancellation before {formatCurrentDates(deadLine)}
          </p>
          <p className="text-sm">
            After that the reservation is non-refundable.
          </p>
        </div>
        <div>
          <p className="text-red-500 text-sm font-semibold">
            Note: If you press payment and if you dont do the payment the
            booking will be set as pending on your booking history as the
            payment has not been done yet.
          </p>
        </div>
      </div>
    </div>
  );
}
