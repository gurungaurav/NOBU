import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../global/css/scrollbar.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Pagination,
  Slide,
  Stack,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  addHotelAdditionalServices,
  deleteHotelAdditionalServices,
  getHotelAdditionalServices,
  updateHotelAdditionalServices,
} from "../../services/vendor/vendor.service";
import { Menu } from "@headlessui/react";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RxCross2 } from "react-icons/rx";
import { AiOutlineEdit } from "react-icons/ai";
import { LuTrash } from "react-icons/lu";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function VendorAdditionalServicesLists() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get("page")) || 1;
  const [totalPages, setTotalPages] = useState(1);
  const [allServices, setAllServices] = useState([]);
  const [searchName, setSearchName] = useState("");

  //!For opening editors
  const [openItems, setOpenItems] = useState(null); // Track opened items
  const [dialogRoomId, setDialogRoomId] = useState(null); // Track room id for dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogRef = useRef(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [limit, setLimit] = useState(0);
  const [total, setTotal] = useState(0);

  const [deleteId, setDeleteId] = useState(null);
  const [updateId, setUpdateId] = useState(null);

  const { hotel_name } = useParams();
  const { jwt } = useSelector((state) => state.user);

  useEffect(() => {
    getServices(page);
    const handleClickOutside = (event) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target) &&
        !event.target.closest(".absolute")
      ) {
        setIsDialogOpen(false);
        setIsDeleteDialogOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [page]);

  const {
    values,
    handleBlur,
    handleSubmit,
    setFieldValue,
    handleChange,
    touched,
    errors,
    resetForm,
  } = useFormik({
    initialValues: {
      service_name: "",
      price: "",
    },
    validationSchema: Yup.object().shape({
      service_name: Yup.string().required("Service Name is required"),
      price: Yup.number().required("Price is required"),
    }),
    onSubmit: async () => {
      if (updateId !== null) {
        console.log("ppa");
        await updateService(values);
      } else {
        await addServices(values);
        console.log("sasas");
      }
    },
  });

  const getServices = async (pageNumber) => {
    try {
      const res = await getHotelAdditionalServices(hotel_name, pageNumber, jwt);
      setAllServices(res.data.data.hotelServices);
      console.log(res.data);
      setLimit(res.data.data.limit);
      setTotal(res.data.data.total);
      setTotalPages(Math.ceil(res.data.data.total / res.data.data.limit));
    } catch (e) {
      console.log(e);
    }
  };

  const deleteService = async (service_id) => {
    try {
      const res = await deleteHotelAdditionalServices(
        hotel_name,
        service_id,
        jwt
      );
      console.log(res.data.data);
      toast.success(res.data.message);
      getServices();
      setDeleteId(null);
      setIsDeleteDialogOpen(false);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  const updateService = async (values) => {
    try {
      const res = await updateHotelAdditionalServices(
        values,
        hotel_name,
        allServices[updateId]?.additional_services_id,
        jwt
      );
      setUpdateId(null);
      toast.success(res.data.message);
      getServices();
      setOpenUpdateDialog(false);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  const addServices = async (values) => {
    try {
      const res = await addHotelAdditionalServices(values, hotel_name, jwt);
      console.log(res.data);
      toast.success(res.data.message);
      resetForm();
      getServices();
      setOpenAddDialog(false);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  const handleUpdate = (index) => {
    setUpdateId(index);
    setOpenUpdateDialog(true);
    setFieldValue("service_name", allServices[index]?.service_name);
    setFieldValue("price", allServices[index]?.price);
  };

  const handleDelete = (index) => {
    setDeleteId(index);
    setIsDeleteDialogOpen(true);
  };

  const handlePageChange = (pageNumber) => {
    queryParams.set("page", pageNumber);
    navigate(
      `/vendor/${hotel_name}/additionalServices?${queryParams.toString()}`
    );
  };

  const handleClickOpenAdd = () => {
    setOpenAddDialog(!openAddDialog);
  };

  const handleClickOpen = () => {
    setOpenAddDialog(true);
    console.log("jaja");
  };

  const handleClickOpenDelete = (service_id) => {
    setIsDeleteDialogOpen(true);
    setDeleteId(service_id);
  };

  const handleClickUpdateDelete = (service_id) => {
    setOpenUpdateDialog(true);
    setUpdateId(service_id);
  };

  //TODO: Need to do the filtering on the backend cuz when i filter with this then the data of other details that hasnn;t been rendered wont be
  //! shown so yeah
  const filteredServices = allServices?.filter((service) =>
    service.service_name.toLowerCase().includes(searchName.toLowerCase())
  );
  return (
    <div className="px-8 flex flex-col w-full ">
      <div className="font-semibold text-xl mt-2 mb-2">
        <p>Additional Services List</p>
      </div>
      <p className="flex gap-6 items-center font-semibold mb-2 w-fit text-gray-500 text-sm ">
        You have total {allServices.length} amenities
      </p>
      <div className="flex justify-between mb-4">
        <div class="relative w-[30rem] border flex items-center justify-between rounded-full">
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
            onChange={(e) => setSearchName(e.target.value)}
            class="h-10 w-full cursor-text rounded-full border bg-slate-200 py-2 pr-40 pl-12  outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Search by name"
          />
        </div>
        <div
          onClick={handleClickOpen}
          className="p-2 rounded-lg border h-fit bg-violet-950 cursor-pointer hover:bg-opacity-90 text-white duration-300"
        >
          <p>Add services</p>
        </div>
      </div>

      <div className="h-[520px]  overflow-auto border bg-white rounded-t-lg custom-scrollbar">
        <table className="w-full">
          <thead className=" z-30 sticky font-semibold top-0 border-b bg-gray-100 h-[3rem] text-sm ">
            <tr>
              <td className="px-4 py-2  text-center ">Service ID</td>
              <td className="px-4 py-2  text-center ">Service Name</td>
              <th className="px-4 py-2 font-semibold">Price</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices?.map((service, index) => (
              <tr
                key={service?.additional_services_id}
                className="border-b text-xs font-semibold text-gray-500"
              >
                <td className="">
                  <p className="text-center">#{index + 1}</p>
                </td>
                <td className="px-4 py-2 ">
                  <p className="text-center">{service?.service_name}</p>
                </td>
                <td className="px-4 py-2">
                  <p className="text-center">NPR{service?.price}</p>
                </td>
                <td className="px-2 flex flex-col items-center relative justify-center">
                  <td className="px-2 flex gap-2 items-center relative h-[60px] justify-center">
                    <div
                      className="p-2 rounded-md  text-black text-xl hover:bg-blue-700 hover:text-white duration-500 cursor-pointer"
                      onClick={() => handleUpdate(index)}
                    >
                      <AiOutlineEdit />
                    </div>
                    <div
                      className="p-2 rounded-md  text-black text-xl hover:bg-red-700 hover:text-white duration-500 cursor-pointer"
                      onClick={() => handleDelete(index)}
                    >
                      <LuTrash />
                    </div>
                  </td>

                  <Dialog
                    className="absolute"
                    open={isDeleteDialogOpen}
                    onClose={() => {
                      setIsDeleteDialogOpen(false);
                      setDeleteId(null);
                    }}
                  >
                    <div className=" flex max-w-lg flex-col items-center rounded-md border px-8 py-10 text-gray-800 shadow-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 rounded-xl bg-red-50 p-2 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <p className="mt-4 text-center text-xl font-bold">
                        Do you want to delete this service?
                      </p>
                      <p className="mt-2 text-center text-lg">
                        Are you sure you want to delete{" "}
                        <span className="truncate font-medium">
                          {allServices[deleteId]?.service_name}
                        </span>
                        ?
                      </p>
                      <div className="mt-8 flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                        <button
                          className="whitespace-nowrap rounded-md bg-violet-950 px-4 py-3 font-medium text-white"
                          onClick={() =>
                            deleteService(
                              allServices[deleteId]?.additional_services_id
                            )
                          }
                        >
                          Yes, delete the service
                        </button>
                        <button
                          className="whitespace-nowrap rounded-md bg-gray-200 px-4 py-3 font-medium"
                          onClick={() => setIsDeleteDialogOpen(false)}
                        >
                          Cancel, keep the service
                        </button>
                      </div>
                    </div>
                  </Dialog>
                  <Dialog
                    open={openUpdateDialog}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => {
                      setOpenUpdateDialog(false);
                      setUpdateId(null);
                    }}
                  >
                    <DialogContent className="w-[30rem]">
                      <div className="flex flex-col gap-6 ">
                        <div className="flex justify-between items-center">
                          <h1 className="text-2xl font-semibold">
                            Update {allServices[updateId]?.service_name}
                          </h1>
                          <RxCross2
                            className="text-2xl cursor-pointer"
                            onClick={() => {
                              setOpenUpdateDialog(false);
                              setUpdateId(null);
                            }}
                          />
                        </div>
                        <div className="flex gap-4 items-center">
                          <TextField
                            id="standard-basic"
                            label="Service Name"
                            variant="standard"
                            name="service_name"
                            value={values.service_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {touched.service_name && errors.service_name && (
                            <p className="text-red-400">
                              {errors.service_name}
                            </p>
                          )}
                          <TextField
                            id="standard-basic"
                            label="Price"
                            variant="standard"
                            type="number"
                            name="price"
                            value={values.price}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {touched.price && errors.price && (
                            <p className="text-red-400">{errors.price}</p>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleSubmit}>Update</Button>
                      <Button
                        onClick={() => {
                          setOpenUpdateDialog(false);
                          setUpdateId(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </DialogActions>
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Dialog
          open={openAddDialog}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setOpenAddDialog(false)}
        >
          <DialogContent className="w-[30rem]">
            <div className="flex flex-col gap-6 ">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">
                  Add Additional Services
                </h1>
                <RxCross2
                  className="text-2xl cursor-pointer"
                  onClick={() => setOpenAddDialog(false)}
                />
              </div>

              <div className=" flex items-center gap-4">
                <TextField
                  id="standard-basic"
                  label="Service Name"
                  variant="standard"
                  type="text"
                  name="service_name"
                  onChange={handleChange}
                  value={values.service_name}
                  onBlur={handleBlur}
                />
                {touched.service_name && errors.service_name && (
                  <p className="text-red-400">{errors.service_name}</p>
                )}

                <TextField
                  id="standard-basic"
                  label="Price"
                  variant="standard"
                  type="number"
                  name="price"
                  onChange={handleChange}
                  value={values.price}
                  onBlur={handleBlur}
                />
                {touched.price && errors.price && (
                  <p className="text-red-400">{errors.price}</p>
                )}
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <button
              onClick={handleSubmit}
              className="cursor-pointer rounded-md p-2 bg-violet-950 hover:bg-violet-900 duration-300 text-white text-sm"
            >
              ADD
            </button>
            <button
              className="cursor-pointer rounded-md p-2 text-white bg-red-500 hover:bg-red-600 duration-300 text-sm "
              onClick={() => setOpenAddDialog(false)}
            >
              CANCEL
            </button>
          </DialogActions>
        </Dialog>
      </div>
      <div className="flex justify-end mb-2 border-b border-r border-l bg-gray-100 rounded-b-lg items-center ">
        {/* <p className="text-xs tracking-wide font-semibold pl-4">
          Showing: {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of{" "}
          {total}
        </p> */}
        <Stack spacing={2} className="p-2">
          <Pagination
            count={totalPages}
            page={page}
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
