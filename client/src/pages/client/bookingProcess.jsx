import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Step, StepLabel, Stepper } from "@mui/material";
import Button from "@mui/material/Button";
import BookingStep1 from "../../features/bookingProcess/bookingStep1";
import * as Yup from "yup";
import { toast } from "react-toastify";
import BookingStep2 from "../../features/bookingProcess/bookingStep2";
import { TiTick } from "react-icons/ti";
import { MdRoomService, MdNightsStay } from "react-icons/md";
import { FaCalendarAlt, FaMoneyBill, FaArrowLeft } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import moment from "moment";

import {
  getAllAdditionalService,
  getBookingDetails,
  getSingleRoomDetails,
} from "../../services/hotels/hotels.service";
import { paymentConfirmationEsewa } from "../../services/client/user.service";

export default function BookingProcess() {
  const steps = [
    "Reservation details",
    "Info and Payment",
    "Booking confirmation",
  ];

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [activeStep, setActiveStep] = useState(0);
  const [firstDisable, setFirstDisable] = useState(true);
  const [hoverReturn, setReturn] = useState(false);
  const [additionalServices, setAdditionalServices] = useState([]);

  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    check_in: Yup.date().required("Check-in date is required"),
    check_out: Yup.date()
      .min(Yup.ref("check_in"), "Check-out date must be after check-in date")
      .required("Check-out date is required"),
    capacity: Yup.number()
      .min(1, "Capacity must be at least 1")
      .required("Capacity is required"),
    total_price: Yup.number()
      .min(0, "Total price must be a positive number")
      .required("Total price is required"),
  });

  //TODO: I think i will add the form details on the cookie or local storage to keep the records of the hotel registration
  const formik = useFormik({
    initialValues: {
      check_in: queryParams.get("check_in") || "",
      check_out: queryParams.get("check_out") || "",
      capacity: 0,
      total_price: 0,
      room_price: 0,
      additionalServices: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {},
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const { hotel_id, room_id } = useParams();

  const [roomDetails, setRoomDetails] = useState();

  // const roomPictures = roomDetails && roomDetails.other_pictures.slice(0,4)

  const getRoom = async () => {
    try {
      const res = await getSingleRoomDetails(hotel_id, room_id);
      setRoomDetails(res.data.data);
      formik.setFieldValue("room_price", res.data.data.price_per_night);
      formik.setFieldValue("capacity", res.data.data.room_capacity);
    } catch (e) {
      const errorMessage = e.response.data.message;
      console.log(errorMessage);
    }
  };

  const getAdditionalServices = async () => {
    try {
      const res = await getAllAdditionalService(hotel_id);
      setAdditionalServices(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  //!If the booking is pending this will be used
  const bookingDetailsGet = async () => {
    try {
      const booking_id = parseInt(queryParams.get("booking_id"));
      const res = await getBookingDetails(booking_id);
      console.log(res.data);
      formik.setFieldValue("check_in", res.data.data.check_in_date);
      formik.setFieldValue("check_out", res.data.data.check_out_date);
      formik.setFieldValue(
        "additionalServices",
        res.data.data.additionalServices
      );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    //!If the esewa payment is done then this will be hit on each useEffect for successful payment
    if (queryParams.get("esewa")) {
      setActiveStep(2);
      const details = {
        booking_id: queryParams.get("booking_id"),
        token: queryParams.get("token"),
        amount: parseInt(queryParams.get("price")),
      };
      comfirmPay(details);
    }
  }, []);

  useEffect(() => {
    getRoom();
    getAdditionalServices();

    //!This is done so that if the booking is pending and the user wants to do the payment now then the previous values are retived from it
    if (
      formik.values.check_in &&
      formik.values.check_out &&
      formik.values.room_price &&
      queryParams.get("booking_id")
    ) {
      formik.setFieldValue("total_price", parseInt(queryParams.get("price")));
      bookingDetailsGet();
    }

    if (!queryParams.get("esewa")) {
      if (queryParams.get("booking_id")) {
        setActiveStep(1);
        formik.setFieldValue("room_price", roomDetails?.price_per_night);
      }
    }

    if (formik.values.total_price > 0) {
      setFirstDisable(false);
    } else {
      setFirstDisable(true);
    }
  }, [
    formik.values.check_in,
    formik.values.total_price,
    formik.values.check_out,
    formik.values.room_price,
  ]);

  const comfirmPay = async (details) => {
    setActiveStep(2);
    try {
      const res = await paymentConfirmationEsewa(
        details.booking_id,
        details,
        hotel_id
      );
      toast.success(res.data.message);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Function to calculate the number of nights/days
  const calculateNights = () => {
    const checkInDate = moment(formik.values.check_in);
    const checkOutDate = moment(formik.values.check_out);
    const nightCount = checkOutDate.diff(checkInDate, "days") + 1;
    return nightCount;
  };

  const additionalServicesTotal = formik.values.additionalServices.reduce(
    (acc, service) => acc + service.price,
    0
  );
  const roomPriceWithoutAdditionalServices =
    formik.values.total_price - additionalServicesTotal;

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <BookingStep1
            formik={formik}
            hotel_id={hotel_id}
            room_id={room_id}
            roomDetails={roomDetails}
            additionalServices={additionalServices}
          />
        );
      case 1:
        return (
          <BookingStep2
            room_id={room_id}
            formik={formik}
            hotel_id={hotel_id}
            handleNextStep={handleNext}
          />
        );
      case 2:
        return null;
      default:
        return navigate(`/mainHotel/${hotel_id}/room/${room_id}`);
    }
  };

  const handleMouseEnter = () => {
    setReturn(true);
  };

  const handleMouseLeave = () => {
    setReturn(false);
  };
  const navigateReturn = () => {
    navigate(`/mainHotel/${hotel_id}/room/${room_id}`);
  };

  return (
    <div className="bg-gray-50 p-10">
      <div className="shadow-md border rounded-2xl p-10 bg-white">
        <div className="relative w-fit">
          <FaArrowLeft
            className=" text-3xl cursor-pointer relative"
            onClick={navigateReturn}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          {hoverReturn && (
            <div className="absolute -top-7 -right-24 p-2 border z-40  rounded-lg  text-xs bg-white">
              <p>Return to room</p>
            </div>
          )}
        </div>
        <Stepper activeStep={activeStep} alternativeLabel className="">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div>
          <div className="flex  gap-6 justify-center">
            <div className="">{getStepContent(activeStep)}</div>
            <div className="p-6  w-fit">
              {firstDisable && <p className="">Please select a date</p>}
              {activeStep == 2 && (
                <div className="flex justify-center items-center flex-col mb-4">
                  <div className="p-2 rounded-full border-2 border-violet-950 text-6xl">
                    <TiTick className="text-violet-950" />
                  </div>
                  <p className="text-violet-950 font-semibold text-sm">
                    Payment successful
                  </p>
                  <h1 className="text-2xl font-serif leading-10">
                    Booking confirmation
                  </h1>
                  <p className="text-sm text-gray-500">
                    Thank You for booking a stay out hotel!
                  </p>
                  <p className="text-sm text-gray-500">
                    We will send you an invoice and booking confirmation on your
                    email address{" "}
                  </p>
                  <p className="text-sm text-gray-500">
                    For any other information feel free to contact us
                  </p>
                </div>
              )}
              <div className="h-fit w-full p-6 rounded-lg shadow-md border ">
                <h1 className="text-2xl font-semibold mb-2">Booking summary</h1>
                <div className="flex flex-col gap-6 justify-center mt-2 ">
                  <div className="w-[27rem] h-[13rem]">
                    <img
                      className="rounded-lg h-full w-full object-cover "
                      src={roomDetails?.other_pictures[0]?.room_picture}
                      alt="hehe"
                    ></img>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex  items-center justify-between">
                      <div className="flex gap-2 items-center">
                        <FaCalendarAlt />
                        <strong>Period of stay:</strong>
                      </div>
                      <p className="ml-2 text-sm font-semibold">{`${formatDate(
                        formik.values.check_in
                      )} - ${formatDate(formik.values.check_out)}`}</p>{" "}
                    </div>
                    <div className="flex  items-center justify-between">
                      <div className="flex gap-2 items-center">
                        <MdNightsStay />
                        <strong>Nights/Days:</strong>
                      </div>
                      <p className="ml-2 text-sm font-semibold">
                        {calculateNights()}{" "}
                      </p>
                    </div>
                    <div className="flex  items-center justify-between">
                      <div className="flex gap-2 items-center">
                        <BsFillPeopleFill />
                        <strong>Number of people:</strong>
                      </div>
                      <p className="ml-2 text-sm font-semibold">
                        {roomDetails?.room_capacity}
                      </p>
                    </div>
                    <div className="flex  items-center justify-between">
                      <div className="flex gap-2 items-center">
                        <FaMoneyBill />
                        <strong>Price:</strong>
                      </div>
                      <p className="ml-2 text-sm font-semibold">
                        NPR {roomPriceWithoutAdditionalServices}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-lg font-semibold border-b">
                      Additional Services
                    </p>
                    {formik.values.additionalServices.length > 0 ? (
                      formik.values.additionalServices.map((service) => (
                        <div
                          key={service.additional_services_id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex gap-2 items-center">
                            <MdRoomService />
                            <strong>{service.service_name}:</strong>
                          </div>
                          <p className="ml-2 text-sm font-semibold">
                            {service.price}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No additonal services added</p>
                    )}
                  </div>
                  <div className="flex flex-col border-t pt-2">
                    <div className="flex justify-between">
                      <strong>Total price:</strong>
                      <p className="font-bold">
                        NPR {formik.values.total_price}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" flex justify-end gap-4 mt-4">
            <Button
              disabled={
                queryParams.get("booking_id") && activeStep == 1
                  ? true
                  : activeStep === 0
              }
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === 0 && firstDisable}
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
