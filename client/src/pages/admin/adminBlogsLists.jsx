import { forwardRef, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { RxCross2 } from "react-icons/rx";
import { Pagination, Stack, TextField } from "@mui/material";
import {
  AllBlogDetailsAdmin,
  DeleteBlogAdmin,
} from "../../services/admin/admin.service";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { formatDate } from "../../utils/formatDates";
import { useLocation, useNavigate } from "react-router-dom";
import { getBlogTags } from "../../services/client/user.service";
import { LuTrash } from "react-icons/lu";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AdminBlogsLists() {
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteBlogDetails, setDeleteBlogDetails] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [blogDetails, setAllBlogDetails] = useState([]);
  const [totalBlogs, setTotalBlogs] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get("page")) || 1;
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTag, setSelectedTag] = useState(null); // Step 1
  const [tags, setTags] = useState([]);
  const [limit, setLimit] = useState(0);

  const { id } = useSelector((state) => state.user);

  const handleClose = () => {
    setErrorMessage("");
    setMessage("");
    setDeleteBlogDetails(null);
    setOpenDelete(false);
  };

  //modal
  const handleOpenDelete = (blogDetail) => {
    setDeleteBlogDetails(blogDetail);
    setOpenDelete(true);
  };

  console.log(message);

  const handleSubmitDelete = async () => {
    if (deleteBlogDetails && message !== "") {
      try {
        const res = await DeleteBlogAdmin(deleteBlogDetails.blog_id, id, {
          user_id: deleteBlogDetails.author.user_id,
          message: message,
        });
        console.log(res.data);
        toast.success(res.data.message);
        handleClose();
        getAllBlogs(page);
      } catch (e) {
        console.log(e);
        toast.error(e.response.data.message);
      }
    } else {
      setErrorMessage("Please provide a message!");
    }
  };

  //   const handleCloseUpdate = () => {
  //     setOpenUpdate(false);
  //     setSelectedBedIndex(null);
  //     setBedType("");
  //     setBedCount("");
  //     setBedTypes_id(0);
  //   };

  const getBlogTag = async () => {
    try {
      const res = await getBlogTags();
      console.log(res.data);
      setTags(res.data.data); // Assuming response is an array of tags
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getAllBlogs(page);
    getBlogTag();
  }, [page]);

  const getAllBlogs = async (pageNumber) => {
    try {
      const res = await AllBlogDetailsAdmin(pageNumber);
      console.log(res.data);
      setAllBlogDetails(res.data.data.blogDetails);
      setLimit(res.data.data.limit);
      setTotalPages(Math.ceil(res.data.data.total / res.data.data.limit));
      setTotalBlogs(res.data.data.total);
    } catch (e) {
      console.log(e);
    }
  };

  const handlePageChange = (pageNumber) => {
    queryParams.set("page", pageNumber);
    navigate(`/admin/${id}/blogLists?${queryParams.toString()}`);
  };

  const filteredBlogs = selectedTag
    ? blogDetails.filter((blog) => blog.blogTag.tag_id === selectedTag)
    : blogDetails;

  return (
    <div className="px-8 flex flex-col w-full ">
      <div className="font-semibold text-xl mt-2 ">
        <p>All Blogs</p>
      </div>
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-gray-400 font-semibold">
          Total {totalBlogs} have been published
        </p>
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(parseInt(e.target.value))}
          className="p-2 border rounded-md"
        >
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option key={tag.tag_id} value={tag.tag_id}>
              {tag.tag_name}
            </option>
          ))}
        </select>
      </div>
      <div className="h-[520px]  overflow-auto border bg-white rounded-t-lg custom-scrollbar">
        <table className="w-full">
          <thead className=" z-30 sticky font-semibold top-0 border-b bg-gray-100 h-[3rem] text-sm ">
            <tr>
              <th className="px-4 py-4 font-semibold">Author</th>
              <th className="px-4 py-4 font-semibold">Title</th>
              <th className="px-4 py-4 font-semibold">Category</th>
              <th className="px-4 py-4 font-semibold">Published Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs?.map((blog, index) => (
              <tr
                key={blog.blog_id}
                className="border-b text-xs font-semibold text-gray-500"
              >
                <td className="px-4 py-2 h-[4rem]">
                  <div className="flex gap-4 items-center justify-center">
                    <img
                      className="w-14 h-14 rounded-full object-cover"
                      src={blog?.author?.profile}
                    ></img>
                    <p>{blog?.author?.user_name}</p>
                  </div>
                </td>
                <td className="px-4 h-[4rem]">
                  <p className="text-center">{blog?.title}</p>
                </td>
                <td className="px-4 h-[4rem]">
                  <p className="text-center">{blog?.blogTag?.tag_name}</p>
                </td>
                <td className="px-4 h-[4rem]">
                  <p className="text-center">{formatDate(blog?.createdAt)}</p>
                </td>
                <td className="px-2 flex gap-2 items-center relative h-[70px] justify-center">
                  {/* <div
                      className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-700 duration-500 cursor-pointer"
                      onClick={() => handleUpdate(index)}
                    >
                      <p>UPDATE</p>
                    </div> */}
                  <div
                    className="p-2 rounded-md  text-black text-xl hover:bg-red-700 hover:text-white duration-500 cursor-pointer"
                    onClick={() => handleOpenDelete(blog)}
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
        onClose={handleClose}
      >
        <DialogContent className="w-[30rem]">
          <div className="flex flex-col gap-2 ">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold">
                Delete Blog no.
                {deleteBlogDetails?.blog_id}
              </h1>
              <RxCross2
                className="text-2xl cursor-pointer"
                onClick={handleClose}
              />
            </div>
            <p className="text-sm text-red-500 font-semibold">
              Note: The reason should be compulsory.
            </p>
            <textarea
              className="h-[20rem] border-2 rounded-lg p-2 outline-violet-950"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Write a message on why you deleted the user named ${deleteBlogDetails?.author?.user_name}'s blog`}
            ></textarea>
            {errorMessage !== "" && message == "" && <p>{errorMessage}</p>}
          </div>
        </DialogContent>
        <DialogActions className="text-sm ">
          <button
            class="whitespace-nowrap rounded-md bg-violet-950 px-4 py-3 font-medium text-white"
            type="button"
            onClick={handleSubmitDelete}
          >
            DELETE
          </button>
          <button
            onClick={handleClose}
            class="whitespace-nowrap rounded-md bg-gray-200 px-4 py-3 font-medium mr-4"
          >
            CANCEL
          </button>
        </DialogActions>
      </Dialog>
      <div className="flex justify-between mb-2 border-b border-r border-l bg-gray-100 rounded-b-lg items-center ">
        <p className="text-xs tracking-wide font-semibold pl-4">
          Showing: {(page - 1) * limit + 1} -{" "}
          {Math.min(page * limit, totalBlogs)} of {totalBlogs}
        </p>
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
