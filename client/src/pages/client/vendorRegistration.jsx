import React, { useCallback, useEffect, useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import BasicInformationStep from "../../components/vendorForms/basicInformation";
import FinalDetails from "../../components/vendorForms/finalDetails";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import PicturesAndAmenities from "../../components/vendorForms/amenitiesForm";
import { checkListYourProper } from "../../services/client/user.service";
import { useNavigate } from "react-router-dom";
import { vendorRegistration } from "../../services/vendor/vendor.service";
import { IoMdCheckmark } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6";

const steps = [
  "Basic Information",
  "Amenities and Pictures",
  "Review",
  "Final",
];

//! Details page like they can't edit the details now so
const VendorRegistrationForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [firstDisable, setFirstDisable] = useState(true);
  const [secondDisable, setSecondDisable] = useState(true);
  const [hoverReturn, setReturn] = useState(false);

  const { jwt, id } = useSelector((state) => state.user);

  const validationSchema = Yup.object().shape({
    // Define validation schema for each step
    hotel_name: Yup.string()
      .min(2, "Hotel name must be at least 2 characters")
      .max(50, "Hotel name must be at most 50 characters")
      .required("Please enter the hotel name"),
    phone_number: Yup.number()
      .min(1000000000, "Numbers must be exactly 10 digits")
      .max(9999999999, "Numbers must be exactly 10 digits")
      .required("Please provide your phone number"),
    description: Yup.string().min(10).required("Please enter a description"),
    location: Yup.string()
      .min(2, "Location must be at least 2 characters")
      .required("Please enter the location"),
    ratings: Yup.number()
      .min(1, "Ratings must be at least 1")
      .max(5, "Ratings must be at most 5")
      .required("Please enter the ratings"),
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Please enter the email"),
    amenities: Yup.array().min(4).required("At least one amenity is required"),
    main_picture: Yup.string().required("Main picture is required"),
    other_pictures: Yup.array().min(4).required("Other pictures is required"),
  });

  const [hotelDetails, setHotelDetails] = useState(null);

  const navigate = useNavigate();

  //!This is for checking if the user has already listed the hotel or not
  const checkList = async () => {
    try {
      const res = await checkListYourProper(id, jwt);
      console.log(res.data);
      if (res.data.data) {
        setHotelDetails(res.data.data);
        setActiveStep(3);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    checkList();
  }, []);

  const formik = useFormik({
    initialValues: {
      hotel_name: "",
      phone_number: "",
      description: "",
      main_picture: null,
      other_pictures: [],
      location: "",
      ratings: "",
      email: "",
      amenities: [],
      agreedToTerms: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("hotel_name", values.hotel_name);
      formData.append("phone_number", values.phone_number);
      formData.append("description", values.description);
      formData.append("main_picture", values.main_picture);
      formData.append("location", values.location);
      formData.append("ratings", values.ratings);
      formData.append("email", values.email);
      values.amenities.forEach((amenity) => {
        formData.append(`amenities`, amenity);
      });

      // Append other_pictures individually
      values.other_pictures.forEach((file) => {
        formData.append(`other_pictures`, file);
      });
      await registerVendor(formData);
    },
  });

  const registerVendor = async (values) => {
    try {
      const res = await vendorRegistration(values, id, jwt);
      console.log(res.data);
      toast.success(res.data.message);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  const handleNext = () => {
    if (!hotelDetails) {
      if (activeStep === 2) {
        formik.handleSubmit();
        console.log("hehe");
      }
    }
    if (activeStep !== 2) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  console.log(activeStep);

  useEffect(() => {
    // Check if all fields in the first step are filled
    const { hotel_name, phone_number, description, location, ratings, email } =
      formik.errors;
    const {
      hotel_name: hotelNameValue,
      phone_number: phoneNumberValue,
      description: descriptionValue,
      location: locationValue,
      ratings: ratingsValue,
      email: emailValue,
    } = formik.values;

    if (
      !hotel_name &&
      hotelNameValue !== "" &&
      !phone_number &&
      phoneNumberValue !== "" &&
      !description &&
      descriptionValue !== "" &&
      !location &&
      locationValue !== "" &&
      descriptionValue !== "" &&
      !ratings &&
      ratingsValue !== "" &&
      !email &&
      emailValue !== ""
    ) {
      setFirstDisable(false);
    } else {
      setFirstDisable(true);
    }
  }, [formik.errors, formik.values]);

  useEffect(() => {
    // Check if amenities are selected
    const amenitiesSelected = formik.values.amenities.length >= 4;
    // Check if main picture is selected
    const mainPictureSelected = !!formik.values.main_picture;
    // Check if other pictures are selected
    const otherPicturesSelected = formik.values.other_pictures.length >= 4;

    // Set secondDisable to true if any of the conditions are not met
    const disableConditionMet = !(
      amenitiesSelected &&
      mainPictureSelected &&
      otherPicturesSelected
    );
    setSecondDisable(disableConditionMet);
  }, [
    formik.values.amenities,
    formik.values.main_picture,
    formik.values.other_pictures,
  ]);

  const getStepContent = useCallback(
    (step) => {
      switch (step) {
        case 0:
          return <BasicInformationStep formik={formik} />;
        case 1:
          return <PicturesAndAmenities formik={formik} />;
        case 2:
          return <FinalDetails formik={formik} hotelDetails={hotelDetails} />;
        case 3:
          return (
            <div className="flex flex-col items-center justify-center mt-10 gap-4">
              <div className="p-2 rounded-full border-2 border-violet-950 text-6xl">
                <IoMdCheckmark className="text-violet-950" />
              </div>
              <p className="font-bold text-2xl">
                Your hotel has been submitted
              </p>
              <p className="text-gray-400 font-semibold">
                Your hotel is currently being reviewed by our team. Please wait
                for the admin's response.
              </p>
            </div>
          );
        default:
          return navigate("/listYourProperty");
      }
    },
    [formik, hotelDetails, navigate]
  );

  console.log(activeStep);

  const handleMouseEnter = () => {
    setReturn(true);
  };

  const handleMouseLeave = () => {
    setReturn(false);
  };
  const navigateReturn = () => {
    navigate("/listYourProperty");
  };
  return (
    <div className="p-10 bg-gray-50 ">
      <div className="shadow-md border rounded-2xl p-10 bg-white">
        <div className="relative w-fit">
          <FaArrowLeft
            className=" text-3xl cursor-pointer relative"
            onClick={navigateReturn}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          {hoverReturn && (
            <div className="absolute -top-7 -right-40 p-2 border z-40  rounded-lg  text-xs bg-white">
              <p>Return to List your property</p>
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
          <div>{getStepContent(activeStep)}</div>
          <div className=" flex justify-end gap-4 mt-4">
            <Button
              disabled={
                hotelDetails && activeStep == 2 ? true : activeStep === 0
              }
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                (activeStep === 0 && firstDisable) ||
                (activeStep === 1 && secondDisable)
              }
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorRegistrationForm;
