import { useState, useEffect } from "react";
import { DateRange, DateRangePicker } from "react-date-range";
import { useLocation, useNavigate } from "react-router-dom";
import { addDays, differenceInDays, format } from "date-fns"; // Import addDays and format functions
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { Checkbox, FormControlLabel } from "@mui/material";

export default function BookingStep1({
  formik,
  hotel_id,
  room_id,
  roomDetails,
  additionalServices,
}) {
  const [selectedDates, setSelectedDates] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 3),
      key: "selection",
    },
  ]);
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  const [bookedDates, setBookedDates] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const calculateTotalPrice = () => {
    const numberOfNights = differenceInDays(
      selectedDates[0].endDate,
      selectedDates[0].startDate
    );

    const totalPrice = numberOfNights * formik.values.room_price;
    formik.setFieldValue("total_price", totalPrice);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const checkIn = queryParams.get("check_in");
    const checkOut = queryParams.get("check_out");

    if (checkIn && checkOut) {
      setSelectedDates([
        {
          startDate: new Date(checkIn),
          endDate: new Date(checkOut),
          key: "selection",
        },
      ]);
      formik.setFieldValue("check_in", new Date(checkIn).toISOString());
      formik.setFieldValue("check_out", new Date(checkOut).toISOString());
    }
  }, [location.pathname]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("check_in", selectedDates[0].startDate.toISOString());
    queryParams.set("check_out", selectedDates[0].endDate.toISOString());
    formik.setFieldValue("check_in", selectedDates[0].startDate.toISOString());
    formik.setFieldValue("check_out", selectedDates[0].endDate.toISOString());
    navigate(
      `/mainHotel/${hotel_id}/room/${room_id}/bookingProcess?${queryParams.toString()}`
    );
    calculateTotalPrice();

    if (roomDetails?.bookedDates && roomDetails?.bookedDates != null) {
      const bookedDates = roomDetails?.bookedDates[0]
        ?.filter((booking) => booking.status === "booked")
        .map((booking) => {
          const startDate = new Date(booking.bookedDates.check_in_date);
          const endDate = new Date(booking.bookedDates.check_out_date);
          const dates = [];
          let currentDate = startDate;
          while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
          }
          return dates;
        })
        .flat();
      setBookedDates(bookedDates);
    }
  }, [selectedDates, formik.values.room_price]);

  console.log(roomDetails);
  console.log(bookedDates);
  const checkInError = formik.errors.check_in;
  const checkOutError = formik.errors.check_out;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 justify-center mt-6">
        <p className="text-xl font-semibold">1. Period of stay:</p>
        <DateRange
          onChange={(item) => setSelectedDates([item.selection])}
          showSelectionPreview={true}
          moveRangeOnFirstSelection={false}
          months={2}
          ranges={selectedDates}
          minDate={new Date()}
          maxDate={maxDate}
          direction="horizontal"
          className="rounded-lg border-2"
          disabledDates={bookedDates}
        />
      </div>
      {checkInError && checkOutError && (
        <div className="text-red-500 mt-2">
          Please select check-in and check-out dates
        </div>
      )}
      <div className="flex flex-col gap-4">
        <p className="text-xl font-semibold">2. Additional Services:</p>
        <div className="p-2 border-2 flex flex-col rounded-lg">
          {additionalServices.map((service) => (
            <FormControlLabel
              key={service.additional_services_id}
              control={
                <Checkbox
                  checked={formik.values.additionalServices.some(
                    (selectedService) =>
                      selectedService.additional_services_id ===
                      service.additional_services_id
                  )}
                  onChange={(event) => {
                    const isChecked = event.target.checked;
                    if (isChecked) {
                      formik.setFieldValue(
                        "total_price",
                        formik.values.total_price + service.price
                      );
                      formik.setFieldValue("additionalServices", [
                        ...formik.values.additionalServices,
                        service,
                      ]);
                    } else {
                      formik.setFieldValue(
                        "total_price",
                        formik.values.total_price - service.price
                      );
                      formik.setFieldValue(
                        "additionalServices",
                        formik.values.additionalServices.filter(
                          (selectedService) =>
                            selectedService.additional_services_id !==
                            service.additional_services_id
                        )
                      );
                    }
                  }}
                />
              }
              label={`${service.service_name} - NPR ${service.price}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
