import { forwardRef, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { RxCross2 } from "react-icons/rx";
import { TextField } from "@mui/material";
import {
  addAmenitiesSingle,
  addBedTypes,
  allAmenitiesAdmin,
  getAllBedTypes,
  updateBedTypes,
} from "../../services/admin/admin.service";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AiOutlineEdit } from "react-icons/ai";
import { LuTrash } from "react-icons/lu";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AdminRoomBedsList() {
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [allBeds, setAllBeds] = useState([]);
  const [bedType, setBedType] = useState("");
  const [bedCount, setBedCount] = useState("");
  const [bed_types_id, setBedTypes_id] = useState(0);

  const [selectedBedIndex, setSelectedBedIndex] = useState(null);

  const { jwt } = useSelector((state) => state.user);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setBedType("");
    setBedCount("");
  };

  //modal
  const handleUpdate = async (bed_id) => {
    setSelectedBedIndex(bed_id);
    setOpenUpdate(true);
    setBedTypes_id(allBeds[bed_id]?.bed_types_id);
  };
  console.log(bed_types_id);

  const handleSubmitUpdate = async () => {
    try {
      const res = await updateBedTypes(
        bed_types_id,
        {
          bed_type_name: bedType,
          count: bedCount,
        },
        jwt
      );
      toast.success(res.data.data.message);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    setSelectedBedIndex(null);
    setBedType("");
    setBedCount("");
    setBedTypes_id(0);
  };

  const getAllBeds = async () => {
    try {
      const res = await getAllBedTypes();
      setAllBeds(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const addAmen = async () => {
    try {
      if (bedType !== "" || bedCount > 0) {
        const res = await addBedTypes(
          { bed_type: bedType, capacity: bedCount },
          jwt
        );
        toast.success("Bed type added successfully!");
        setOpen(false);
        setAmenity("");
        getAllBeds();
      } else {
        console.log("Please fill up the form");
      }
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  useEffect(() => {
    getAllBeds();
  }, []);
  console.log(bedType);

  return (
    <div className="px-8 flex flex-col w-full ">
      <div className="font-semibold text-xl mt-2">
        <p>All Beds</p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400 font-semibold">
          You have total {allBeds.length} bed types
        </p>
        <div
          className="p-2 bg-violet-950 rounded-lg text-sm font-semibold mb-2  hover:bg-violet-900 cursor-pointer text-white duration-300"
          onClick={handleClickOpen}
        >
          Add Bed Types
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
                <h1 className="text-2xl font-semibold">Add Bed Types</h1>
                <RxCross2
                  className="text-2xl cursor-pointer"
                  onClick={handleClose}
                />
              </div>
              <div className=" flex items-center gap-4">
                <TextField
                  id="standard-basic"
                  label="Bed Type Name"
                  variant="standard"
                  value={bedType}
                  onChange={(e) => setBedType(e.target.value)}
                />
                <TextField
                  id="standard-basic"
                  label="Capacity"
                  variant="standard"
                  value={bedCount}
                  type="number"
                  onChange={(e) => setBedCount(e.target.value)}
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
              <th className="px-4 py-4 font-semibold">Bed Type ID</th>
              <th className="px-4 py-4 font-semibold">Bed Type Name</th>
              <th className="px-4 py-4 font-semibold">Bed Capacity</th>
              <th className="px-4 py-2 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {allBeds.map((beds, index) => (
              <tr
                key={beds.amenities_id}
                className="border-b text-xs font-semibold text-gray-500"
              >
                <td className="px-20 h-[4rem]">
                  <p className="text-center">{index + 1}</p>
                </td>
                <td className="px-4 h-[4rem]">
                  <p className="text-center">{beds.type_name}</p>
                </td>
                <td className="px-4 h-[4rem]">
                  <p className="text-center">{beds.capacity}</p>
                </td>
                <td className="px-2 flex gap-2 items-center relative h-[60px] justify-center">
                  <div
                    className="p-2 rounded-md  text-black text-xl hover:bg-blue-700 hover:text-white duration-500 cursor-pointer"
                    onClick={() => handleUpdate(index)}
                  >
                    <AiOutlineEdit />
                  </div>
                  <div className="p-2 rounded-md  text-black text-xl hover:bg-red-700 hover:text-white duration-500 cursor-pointer">
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
                Update
                {selectedBedIndex !== null &&
                  allBeds[selectedBedIndex]?.type_name}
              </h1>
              <RxCross2
                className="text-2xl cursor-pointer"
                onClick={handleCloseUpdate}
              />
            </div>
            <div className="flex gap-4 items-center">
              <TextField
                id="standard-basic"
                label="Bed Name"
                variant="standard"
                onChange={(e) => setBedType(e.target.value)}
                value={bedType}
                // value={
                //   selectedBedIndex !== null &&
                //   allBeds[selectedBedIndex]?.type_name
                // }
              />
              <TextField
                id="standard-basic"
                label="Capacity"
                variant="standard"
                value={bedCount}
                type="number"
                // value={
                //   selectedBedIndex !== null &&
                //   allBeds[selectedBedIndex]?.capacity
                // }
                onChange={(e) => setBedCount(e.target.value)}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmitUpdate}>Update</Button>
          <Button onClick={handleCloseUpdate}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
