import { forwardRef, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { RxCross2 } from "react-icons/rx";
import { Pagination, Stack, TextField } from "@mui/material";
import { DeleteBlogAdmin } from "../../services/admin/admin.service";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { LuTrash } from "react-icons/lu";
import {
  deleteFAQDetailsVendor,
  getFAQDetailsVendor,
  patchFAQDetailsVendor,
  postFAQDetailsVendor,
} from "../../services/vendor/vendor.service";
import { useParams } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { useFormik } from "formik";
import * as Yup from "yup";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function VendorFAQ() {
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteFAQDetails, setDeleteFAQDetails] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const [faqDetails, setAllFAQDetails] = useState([]);
  const [totalFaqs, setTotalFaqs] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get("page")) || 1;
  const [totalPages, setTotalPages] = useState(1);
  const [tags, setTags] = useState([]);
  const [limit, setLimit] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [updateFAQSelection, setUpdateFAQSelection] = useState(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [deleteFAQSelection, setDeleteFAQSelection] = useState(null);

  const { id, jwt } = useSelector((state) => state.user);
  const { hotel_name } = useParams();

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
      content: "",
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Title is required"),
      content: Yup.string().required("Content is required"),
    }),
    onSubmit: async () => {
      if (!updateFAQSelection) {
        await postFAQ(values);
      } else {
        await updateFAQ(values);
        console.log("pass");
      }
    },
  });

  const handleCloseDelete = () => {
    setDeleteFAQDetails(null);
    setOpenDelete(false);
  };

  const handleOpenDelete = (faq) => {
    setDeleteFAQDetails(faq);
    setOpenDelete(true);
  };
  const handleUpdate = (faq) => {
    setUpdateFAQSelection(faq);
    setFieldValue("title", faq.title);
    setFieldValue("content", faq.content);

    setOpenUpdate(true);
  };

  //modal

  const handleSubmitDelete = async () => {
    try {
      const res = await deleteFAQDetailsVendor(
        hotel_name,
        deleteFAQDetails.faq_id,
        jwt
      );
      console.log(res.data);
      toast.success(res.data.message);
      handleCloseDelete();
      getAllFAQ(page);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  useEffect(() => {
    getAllFAQ(page);
  }, [page]);

  const getAllFAQ = async (pageNumber) => {
    try {
      const res = await getFAQDetailsVendor(
        hotel_name,
        pageNumber,
        searchName,
        jwt
      );
      console.log(res.data);
      setAllFAQDetails(res.data.data.FaqDetails);
      setLimit(res.data.data.limit);
      setTotalPages(Math.ceil(res.data.data.total / res.data.data.limit));
      setTotalFaqs(res.data.data.total);
    } catch (e) {
      console.log(e);
    }
  };

  const updateFAQ = async (values) => {
    try {
      const res = await patchFAQDetailsVendor(
        hotel_name,
        updateFAQSelection?.faq_id,
        values,
        jwt
      );
      console.log(res.data);
      toast.success(res.data.message);
      setOpenUpdate(false);
      resetForm();
      getAllFAQ(page);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };
  const postFAQ = async (values) => {
    try {
      const res = await postFAQDetailsVendor(hotel_name, values, jwt);
      console.log(res.data);
      toast.success(res.data.message);
      setOpenDialog(false);
      resetForm();
      getAllFAQ(page);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  const handlePageChange = (pageNumber) => {
    queryParams.set("page", pageNumber);
    navigate(`/vendor/${hotel_name}/allFAQHotel?${queryParams.toString()}`);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    setUpdateFAQSelection(null);
  };

  // const filteredBlogs = selectedTag
  //   ? faqDetails.filter((blog) => blog.blogTag.tag_id === selectedTag)
  //   : faqDetails;

  return (
    <div className="px-8 flex flex-col w-full ">
      <div className="font-semibold text-xl mt-2 ">
        <p>All FAQ's</p>
      </div>
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-gray-400 font-semibold">
          Total {totalFaqs} have been posted
        </p>
        <div
          className="p-2 bg-violet-950 rounded-lg  hover:bg-opacity-90 font-semibold text-sm cursor-pointer text-white duration-300"
          onClick={() => setOpenDialog(true)}
        >
          <p>Add FAQ</p>
        </div>
      </div>
      <div className="h-[520px]  overflow-auto border bg-white rounded-t-lg custom-scrollbar">
        <table className="w-full">
          <thead className=" z-30 sticky font-semibold top-0 border-b bg-gray-100 h-[3rem] text-sm ">
            <tr>
              <th className="px-4 py-4 font-semibold">FAQ.no</th>
              <th className="px-4 py-4 font-semibold">Title</th>
              <th className="px-4 py-4 font-semibold">Content</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqDetails?.map((faq, index) => (
              <tr
                key={faq.faq_id}
                className="border-b text-xs font-semibold text-gray-500"
              >
                <td className="px-4 h-[4rem] ">
                  <p className="text-center">{faq?.faq_id}</p>
                </td>
                <td className="px-4 h-[4rem] w-[22rem]">
                  <p className="text-center">{faq?.title}</p>
                </td>
                <td className="px-4 h-[4rem] w-[50rem]">
                  <p className="text-center">{faq?.content}</p>
                </td>
                <td className="px-2 flex gap-2 items-center relative h-[70px] justify-center">
                  <div
                    className="p-2 rounded-md  text-black text-xl hover:bg-blue-700 hover:text-white duration-500 cursor-pointer"
                    onClick={() => handleUpdate(faq)}
                  >
                    <AiOutlineEdit />
                  </div>
                  <div
                    className="p-2 rounded-md  text-black text-xl hover:bg-red-700 hover:text-white duration-500 cursor-pointer"
                    onClick={() => handleOpenDelete(faq)}
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
        open={openDelete}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDelete}
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
          <p class="mt-4 text-center text-xl font-bold">Deleting FAQ</p>
          <p class="mt-2 text-center text-lg">
            Are you sure you want to delete the FAQ no.
            <p>{deleteFAQDetails?.faq_id} ?</p>
          </p>
          <div class="mt-8 flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
            <button
              class="whitespace-nowrap rounded-md bg-violet-950 px-4 py-3 font-medium text-white"
              type="button"
              onClick={handleSubmitDelete}
            >
              Yes, delete the FAQ
            </button>
            <button
              class="whitespace-nowrap rounded-md bg-gray-200 px-4 py-3 font-medium"
              onClick={handleCloseDelete}
            >
              Cancel, keep the FAQ
            </button>
          </div>
        </DialogContent>
      </Dialog>
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
                label="Content"
                placeholder="Write a content..."
                name="content"
                className="p-2 w-full h-[20rem] border-2 rounded-lg outline-blue-500"
                value={values.content}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.content && errors.content && (
                <p className="text-red-400  text-start w-full">
                  {errors.content}
                </p>
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
                Update title named {updateFAQSelection?.title}
              </h1>
              <RxCross2
                className="text-2xl cursor-pointer"
                onClick={handleCloseUpdate}
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
                label="Content"
                placeholder="Write a content..."
                name="content"
                className="p-2 w-full h-[20rem] border-2 rounded-lg outline-blue-500"
                value={values.content}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.content && errors.content && (
                <p className="text-red-400  text-start w-full">
                  {errors.content}
                </p>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleSubmit}
            className="whitespace-nowrap rounded-md bg-violet-950 px-4 py-3 font-medium text-white"
          >
            Update
          </button>
          <button
            className="whitespace-nowrap rounded-md bg-gray-200 px-4 py-3 font-medium"
            onClick={handleCloseUpdate}
          >
            Cancel
          </button>
        </DialogActions>
      </Dialog>
      <div className="flex justify-end mb-2 border-b border-r border-l bg-gray-100 rounded-b-lg items-center ">
        {/* <p className="text-xs tracking-wide font-semibold pl-4">
          Showing: {(page - 1) * limit + 1} -{" "}
          {Math.min(page * limit, totalFaqs)} of {totalFaqs}
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
