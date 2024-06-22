import { forwardRef, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { RxCross2 } from "react-icons/rx";
import { TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addHotelAmenitiesVendor,
  deleteHotelAmenitiesVendor,
  getHotelAmenitiesVendor,
  updateHotelAmenitiesVendor,
} from "../../services/vendor/vendor.service";
import { useLocation, useParams } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { LuTrash } from "react-icons/lu";
import { Pagination, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function VendorAllAmenitiesList() {
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [allAmenities, setAllAmenities] = useState([]);
  const [amenity, setAmenity] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const { jwt } = useSelector((state) => state.user);
  const { hotel_name } = useParams();
  const [searchName, setSearchName] = useState("");
  const itemsPerPage = 10; // Set the number of items to display per page
  const [currentPage, setCurrentPage] = useState(1);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAmenity("");
  };

  const handleUpdate = (amenity) => {
    setSelectedAmenity(amenity);
    setOpenUpdate(true);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    setSelectedAmenity(null);
  };

  const getAllAmen = async () => {
    try {
      const res = await getHotelAmenitiesVendor(hotel_name, jwt);
      setAllAmenities(res.data.data);

      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteAmenities = async () => {
    try {
      const res = await deleteHotelAmenitiesVendor(
        selectedAmenity,
        hotel_name,
        jwt
      );
      console.log(res.data);
      toast.success(res.data.message);
      closeDeleteDialog();
      getAllAmen();
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  const openDeleteDialog = (amenity) => {
    setSelectedAmenity(amenity);
    setOpenDelete(true);
  };

  const closeDeleteDialog = () => {
    setSelectedAmenity(null);
    setOpenDelete(false);
  };

  const addAmen = async () => {
    try {
      if (amenity !== "") {
        const res = await addHotelAmenitiesVendor(amenity, hotel_name, jwt);
        toast.success(res.data.message);
        setOpen(false);
        setAmenity("");
        getAllAmen();
      } else {
        console.log("Please fill up the form");
      }
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  const updateAmen = async () => {
    try {
      if (amenity !== "") {
        const res = await updateHotelAmenitiesVendor(
          { oldAmenity: selectedAmenity, newAmenity: amenity },
          hotel_name,
          jwt
        );
        toast.success(res.data.message);
        setOpen(false);
        setSelectedAmenity(null);
        setAmenity("");
        getAllAmen(page);
        handleCloseUpdate();
      } else {
        console.log("Please fill up the form");
      }
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  useEffect(() => {
    getAllAmen();
  }, []);

  const filteredAmenities = allAmenities?.filter((amenity) =>
    amenity.toLowerCase().includes(searchName.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAmenities?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAmenities?.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="px-8 flex flex-col w-full ">
      <div className="font-semibold text-xl mt-2 mb-2">
        <p>All Amenities</p>
      </div>
      <p className="flex gap-6 items-center font-semibold mb-2 w-fit text-gray-500 text-sm ">
        You have total {allAmenities.length} amenities
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
          className="p-2 bg-violet-950 rounded-lg  hover:bg-opacity-90 cursor-pointer text-white duration-300"
          onClick={handleClickOpen}
        >
          Add amenities
        </div>
      </div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
      >
        <DialogContent className="w-[30rem]">
          <div className="flex flex-col gap-6 ">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold">Add Amenities</h1>
              <RxCross2
                className="text-2xl cursor-pointer"
                onClick={handleClose}
              />
            </div>
            <div className="">
              <TextField
                id="standard-basic"
                label="Amenity Name"
                variant="standard"
                value={amenity}
                onChange={(e) => setAmenity(e.target.value)}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            className="cursor-pointer rounded-md p-2 bg-violet-950 hover:bg-violet-900 duration-300 text-white text-sm"
            onClick={addAmen}
          >
            ADD
          </button>
          <button
            className="cursor-pointer rounded-md p-2 text-white bg-red-500 hover:bg-red-600 duration-300 text-sm "
            onClick={handleClose}
          >
            CANCEL
          </button>
        </DialogActions>
      </Dialog>
      <div className="h-[520px]  overflow-auto border bg-white rounded-t-lg custom-scrollbar">
        <table className="w-full">
          <thead className=" z-30 sticky font-semibold top-0 border-b bg-gray-100 h-[3rem] text-sm ">
            <tr>
              <th className="px-4 py-4 font-semibold">Amenities ID</th>
              <th className="px-4 py-4 font-semibold">Amenities Name</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAmenities?.map((amenity, index) => (
              <tr
                key={amenity.amenities_id}
                className="border-b text-xs font-semibold text-gray-500"
              >
                <td className="">
                  <p className="text-center">#{index + 1}</p>
                </td>
                <td className="px-4 ">
                  <p className="text-center">{amenity}</p>
                </td>
                <td className="px-2 flex gap-2 items-center relative h-[60px] justify-center">
                  <div
                    className="p-2 rounded-md  text-black text-xl hover:bg-blue-700 hover:text-white duration-500 cursor-pointer"
                    onClick={() => handleUpdate(amenity)}
                  >
                    <AiOutlineEdit />
                  </div>
                  <div
                    className="p-2 rounded-md  text-black text-xl hover:bg-red-700 hover:text-white duration-500 cursor-pointer"
                    onClick={() => openDeleteDialog(amenity)}
                  >
                    <LuTrash />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog
        open={openUpdate}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseUpdate}
      >
        <DialogContent className="w-[30rem]">
          <div className="flex flex-col gap-6 ">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold">
                Update {selectedAmenity}
              </h1>
              <RxCross2
                className="text-2xl cursor-pointer"
                onClick={handleCloseUpdate}
              />
            </div>
            <div className="">
              <TextField
                id="standard-basic"
                // label="Amenity Name"
                variant="standard"
                value={amenity}
                onChange={(e) => setAmenity(e.target.value)}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={updateAmen}>Update</Button>
          <Button onClick={handleCloseUpdate}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDelete}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeDeleteDialog}
      >
        <DialogContent className="w-[30rem] items-center flex flex-col">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 rounded-xl bg-red-50 p-2 text-red-500"
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
          <p class="mt-4 text-center text-xl font-bold">Deleting Amenities</p>
          <p class="mt-2 text-center text-lg">
            Are you sure you want to delete the amenity named
            <p>{selectedAmenity} ?</p>
          </p>
          <div class="mt-8 flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
            <button
              class="whitespace-nowrap rounded-md bg-violet-950 px-4 py-3 font-medium text-white"
              type="button"
              onClick={deleteAmenities}
            >
              Yes, delete the amenity
            </button>
            <button class="whitespace-nowrap rounded-md bg-gray-200 px-4 py-3 font-medium">
              Cancel, keep the amenity
            </button>
          </div>
        </DialogContent>
      </Dialog>
      {/* <div className="flex items-end justify-end mb-2 border-b border-r border-l bg-gray-100 rounded-b-lg items-center ">
        <Stack spacing={2} className="p-2">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => handlePageChange(value)}
            variant="outlined"
            className=""
            size="medium"
          />
        </Stack>
      </div> */}
    </div>
  );
}
