import { forwardRef, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { RxCross2 } from "react-icons/rx";
import { TextField } from "@mui/material";
import {
  DeleteAmenity,
  addAmenitiesSingle,
  allAmenitiesAdmin,
} from "../../services/admin/admin.service";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { LuTrash } from "react-icons/lu";
import { AiOutlineEdit } from "react-icons/ai";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AdminAmenitiesList() {
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [allAmenities, setAllAmenities] = useState([]);
  const [amenity, setAmenity] = useState("");
  const [selectedAmenityIndex, setSelectedAmenityIndex] = useState(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState(null);

  const { jwt } = useSelector((state) => state.user);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAmenity("");
  };

  const handleUpdate = (index) => {
    setSelectedAmenityIndex(index);
    setOpenUpdate(true);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    setSelectedAmenityIndex(null);
  };

  const getAllAmen = async () => {
    try {
      const res = await allAmenitiesAdmin();
      setAllAmenities(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteAmenities = async (amenity_id) => {
    try {
      const res = await DeleteAmenity(amenity_id);
      console.log(res.data);
      toast.success(res.data.message);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  const openDeleteDialog = (amenity_id) => {
    setSelectedAmenity(amenity_id);
    setOpenDelete(true);
  };

  const closeDeleteDialog = () => {
    setSelectedAmenity(null);
    setOpenDelete(false);
  };

  const addAmen = async () => {
    try {
      if (amenity !== "") {
        const res = await addAmenitiesSingle(amenity, jwt);
        toast.success("Amenities added successfully!");
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

  useEffect(() => {
    getAllAmen();
  }, []);

  return (
    <div className="px-8 flex flex-col w-full ">
      <div className="font-semibold text-xl mt-2">
        <p>All Amenities</p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400 font-semibold">
          You have total {allAmenities.length} amenities
        </p>
        <div
          className="p-2 bg-violet-950 rounded-lg text-sm font-semibold mb-2  hover:bg-violet-900 cursor-pointer text-white duration-300"
          onClick={handleClickOpen}
        >
          Add amenities
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
      </div>
      <div className="h-[520px] mt-4 overflow-auto border bg-white rounded-t-lg custom-scrollbar">
        <table className="w-full">
          <thead className=" z-30 sticky font-semibold top-0 border-b bg-gray-100 h-[3rem] text-sm ">
            <tr>
              <th className="px-4 py-4 font-semibold">Amenities ID</th>
              <th className="px-4 py-4 font-semibold">Amenities Name</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {allAmenities.map((amenity, index) => (
              <tr
                key={amenity.amenities_id}
                className="border-b text-xs font-semibold text-gray-500"
              >
                <td className="px-20 h-[4rem]">
                  <p className="text-center">{index + 1}</p>
                </td>
                <td className="px-4 h-[4rem]">
                  <p className="text-center">{amenity.amenity_name}</p>
                </td>
                <td className="px-2 flex gap-2 items-center relative h-[60px] justify-center">
                  <div
                    className="p-2 rounded-md  text-black text-xl hover:bg-blue-700 hover:text-white duration-500 cursor-pointer"
                    onClick={() => handleUpdate(index)}
                  >
                    <AiOutlineEdit />
                  </div>
                  <div
                    className="p-2 rounded-md  text-black text-xl hover:bg-red-700 hover:text-white duration-500 cursor-pointer"
                    onClick={() => openDeleteDialog(index)}
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
                Update{" "}
                {selectedAmenityIndex !== null &&
                  allAmenities[selectedAmenityIndex]?.amenity_name}
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
                value={
                  selectedAmenityIndex !== null &&
                  allAmenities[selectedAmenityIndex]?.amenity_name
                }
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Update</Button>
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
            <p>
              {selectedAmenity !== null &&
                allAmenities[selectedAmenity]?.amenity_name}{" "}
              ?
            </p>
          </p>
          <div class="mt-8 flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
            <button
              class="whitespace-nowrap rounded-md bg-red-500 px-4 py-3 font-medium text-white"
              type="button"
              onClick={() => deleteAmenities()}
            >
              Yes, delete the amenity
            </button>
            <button class="whitespace-nowrap rounded-md bg-gray-200 px-4 py-3 font-medium">
              Cancel, keep the amenity
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
