import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BiCalendar } from "react-icons/bi";
import format from "date-fns/format";
import { IoIosArrowForward } from "react-icons/io";
import { FiTag } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { likeBlog } from "../../../services/client/user.service";
import { useSelector } from "react-redux";

import { toast } from "react-toastify";

//TODO: The authorization roles havent been done properly need to to it

export default function BlogContent(props) {
  const [hoverReturn, setReturn] = useState(false);
  const [likedBlog, setLikedBlog] = useState(false);
  const [alreadyLiked, setAlreadyLiked] = useState(false);
  const { id } = useSelector((state) => state.user);

  const blog = props.blog;
  console.log(blog);
  const handleMouseEnter = () => {
    setReturn(true);
  };

  const handleMouseLeave = () => {
    setReturn(false);
  };

  const formatDate = (timestamp) => {
    try {
      const parsedDate = new Date(timestamp);

      // Check if the parsed date is valid
      if (isNaN(parsedDate.getTime())) {
        return "Invalid Date";
      }

      // Format the date with timezone offset
      const formattedDate = format(parsedDate, "MMMM dd, yyyy");
      return formattedDate;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Error";
    }
  };

  const likeBlogss = async () => {
    try {
      const res = await likeBlog(id, blog.blog);
      const message = res.data.message;
      if (res.data.data != null) {
        setLikedBlog(true);
        toast.success(message);
      } else {
        setLikedBlog(false);
        toast.error(message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  //!To check if the user has already liked the blogs or not
  function checkLiked() {
    const isLiked = blog.allLikes?.some((liked) => liked.user.user_id === id);
    setLikedBlog(isLiked);
  }

  //!Dependicies is used so that if something is updated it will also be updated according to it so we dont have to wait untill the page re renders
  useEffect(() => {
    checkLiked();
  }, [blog.allLikes, id]);

  return (
    <>
      <div className="bg-gray-200 rounded-lg p-4 flex gap-10 items-center text-lg font-semibold">
        <div className="flex items-center gap-2">
          <Link to={"/blogs"}>
            <div
              className=" hover:bg-gray-300 p-1 rounded-lg relative cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <p>Blogs</p>
              {hoverReturn && (
                <div className="absolute -top-7 -right-10 z-40  rounded-lg p-1 text-sm bg-white">
                  <p>return</p>
                </div>
              )}
            </div>
          </Link>
          <IoIosArrowForward />
          {blog.blog_Tag?.tag_name}
        </div>
        <div className="flex items-center gap-2">
          <BiCalendar />
          {formatDate(blog?.createdAt)}
        </div>
        <div className="flex items-center gap-2">
          <FiTag />
          {blog.blog_Tag?.tag_name}
        </div>
        <div className="flex justify-end cursor-pointer" onClick={likeBlogss}>
          <FaHeart
            className={`${likedBlog ? "text-violet-950" : "text-white"} `}
          />
        </div>
      </div>
      <div className="border-t mt-6 pt-6">
        <p className="tracking-wider leading-7">{blog.content}</p>
      </div>
      <div className=" pt-6">
        <h1 className="text-2xl text-violet-950 font-bold ">Contents</h1>
      </div>
    </>
  );
}
