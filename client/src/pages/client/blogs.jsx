import React, { useEffect, useState } from "react";
import billie from "../../assets/blogs.jpg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getBlogs } from "../../services/client/user.service";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import BlogPostsCard from "../../components/blogs/blogPostsCard";
import BlogCardSkeleton from "../../components/skeletons/blogCardSkeleton";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get("page")) || 1;
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const getBlogPosts = async (pageNumber) => {
    try {
      const res = await getBlogs(pageNumber);
      console.log(res.data.data);
      setBlogs(res.data.data.data);
      setTotalPages(Math.ceil(res.data.data.total / res.data.data.limit));
      setLoading(false);
    } catch (e) {
      // navigate(-1);
      console.log(e);
    }
  };

  useEffect(() => {
    getBlogPosts(page);
  }, [page]);

  const handlePageChange = (pageNumber) => {
    setLoading(true);
    navigate(`/blogs?page=${pageNumber}`);
  };

  return (
    <div className="">
      <div className="w-full h-96 relative">
        <img className="w-full object-cover h-full" src={billie} alt="billie" />
        <div className="absolute inset-0 flex justify-center items-center text-7xl text-white font-serif">
          <p>Blogs</p>
        </div>
      </div>
      <div className="px-40 border p-10">
        {blogs.length <= 0 ? (
          <div className="text-center my-10">
            <p className="text-xl font-semibold">No Blogs Posted Yet!</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            {loading
              ? [1, 2, 3, 4, 5, 6, 7].map(() => <BlogCardSkeleton />)
              : blogs &&
                blogs?.map((blog) => (
                  <Link to={`/blogs/${blog.blog_id}`} key={blog.index}>
                    <BlogPostsCard
                      title={blog.title}
                      blogTag={blog?.blogTag?.blog_tag_name}
                      picture={blog?.picture}
                      content={blog.content}
                    />
                  </Link>
                ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-20">
          <Link to={"/blogs/postBlogs"}>
            <div className=" w-fit text-sm font-semibold hover:bg-opacity-90 duration-300 border-2  border-black bg-violet-950 p-4 rounded-md text-white">
              <p>Post your blogs</p>
            </div>
          </Link>
          <div className="flex w-f justify-center  items-center ">
            <Stack spacing={2} className="">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => handlePageChange(value)}
                variant="outlined"
                shape="rounded"
                className=""
                size="large"
              />
            </Stack>
          </div>
        </div>
      </div>
    </div>
  );
}
