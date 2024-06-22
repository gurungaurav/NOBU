import { BsChatFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  getAllSupportChats,
  postNewSupportChat,
} from "../../services/chat/chatSocket";
import { useEffect, useState } from "react";
import moment from "moment";
import { Dialog, DialogActions, DialogContent, TextField } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

export default function AdminSupportChatLists() {
  const { admin_id } = useParams();
  const { hotel_name } = useParams();
  const { id, role } = useSelector((state) => state.user);
  const [chatDetails, setChatDetails] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [filterOption, setFilterOption] = useState("all"); // Default to show all chats
  const [searchName, setSearchName] = useState("");

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
      title: "",
      message: "",
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Title is required"),
      message: Yup.string().required("Message is required"),
    }),
    onSubmit: async () => {
      await postChat(values);
    },
  });
  const getAllChats = async () => {
    try {
      const res = await getAllSupportChats(id);
      console.log(res.data);
      setChatDetails(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const postChat = async (values) => {
    try {
      const res = await postNewSupportChat(values, id);
      console.log(res.data);
      toast.success(res.data.message);
      setOpenDialog(false);
      resetForm();
      getAllChats();
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  useEffect(() => {
    getAllChats();
  }, []);

  const filteredChats = chatDetails.filter((chat) => {
    const title = chat.title.toLowerCase();
    const name = chat.user.user_name.toLowerCase();
    const filterMatch =
      filterOption === "pending"
        ? chat.status === "pending"
        : filterOption === "finished"
        ? chat.status === "finished"
        : true;

    const searchMatch =
      title.includes(searchName.toLowerCase()) ||
      name.includes(searchName.toLowerCase());

    return filterMatch && searchMatch;
  });

  return (
    <div className="w-full px-8 py-4">
      <div className="flex justify-between items-center mb-4">
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
            class="h-12 w-full cursor-text rounded-full border bg-slate-200 py-4 pr-40 pl-12  outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Search by name"
          />
        </div>
        <div className="flex gap-4 items-center">
          <select
            className="p-2 rounded-lg bg-white border-gray-300 focus:outline-none focus:ring focus:border-violet-900"
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="finished">Finished</option>
          </select>
          {role === "vendor" && (
            <div
              className="p-2 bg-violet-950 rounded-lg  hover:bg-opacity-90 font-semibold text-sm cursor-pointer text-white duration-300"
              onClick={() => setOpenDialog(true)}
            >
              <p>Add chat</p>
            </div>
          )}
        </div>
      </div>
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
        }}
        maxWidth="xl"
      >
        <DialogContent className="w-[40rem]">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold">Add chat</h1>
              <RxCross2
                className="text-2xl cursor-pointer"
                onClick={() => {
                  setOpenDialog(false);
                }}
              />
            </div>
            <div className="flex flex-col gap-4 items-center ">
              <div className="flex flex-col gap-2 w-full">
                <TextField
                  id="outlined-basic"
                  label="Title"
                  variant="outlined"
                  name="title"
                  className="w-full"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.title && errors.title && (
                  <p className="text-red-400">{errors.title}</p>
                )}
              </div>
              <textarea
                label="Message"
                placeholder="Write a message..."
                name="message"
                className="p-2 w-full h-[20rem] border-2 rounded-lg outline-blue-500"
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.message && errors.message && (
                <p className="text-red-400">{errors.message}</p>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleSubmit}
            className="whitespace-nowrap rounded-md bg-violet-950 px-4 py-3 font-medium text-white"
          >
            Post
          </button>
          <button
            className="whitespace-nowrap rounded-md bg-gray-200 px-4 py-3 font-medium"
            onClick={() => {
              setOpenDialog(false);
            }}
          >
            Cancel
          </button>
        </DialogActions>
      </Dialog>
      <div className="grid grid-cols-3 gap-6">
        {filteredChats?.map((chat, index) => (
          <Link
            key={index}
            to={`/supportChatLists/chat/${chat?.support_chat_room_id}/${
              role === "admin" ? admin_id : hotel_name
            }`}
            className="rounded-2xl bg-white p-4 border font-semibold flex-col gap-2 flex shadow-sm transition duration-300 transform hover:shadow-md hover:-translate-y-1"
          >
            <div className="flex justify-between">
              <div className="flex gap-4 items-center ">
                <p>{chat?.user?.user_name}</p>
                <p className="text-sm ">
                  Posted {moment(new Date(chat?.createdAt)).fromNow()}
                </p>
              </div>
              <p>{chat?.status}</p>
            </div>
            <p className="text-2xl line-clamp-1">{chat?.title}</p>
            <div className="rounded-2xl border h-[18rem] p-2 font-normal">
              <p>{chat?.message}</p>
            </div>
            <div className="flex gap-2 items-center">
              <BsChatFill className="text-gray-500" />
              <p>{chat?.totalChats} chats</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
