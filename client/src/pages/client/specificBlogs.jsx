import React, { useEffect, useState } from "react";
import { getSpecificBlogs } from "../../services/client/user.service";
import { useNavigate, useParams } from "react-router-dom";
import BlogComments from "../../features/blogs/specificBlogs/blogComments";
import BlogContent from "../../features/blogs/specificBlogs/blogContent";
import BlogSuggestions from "../../features/blogs/specificBlogs/blogSuggestions";

export default function SpecificBlogs() {
  const { blog_id } = useParams();

  const [blog, setBlog] = useState({});
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  //!For specific blog
  const getBlog = async () => {
    try {
      const res = await getSpecificBlogs(blog_id);
      console.log(res.data);
      setBlog(res.data.data);
      setBlogs(res.data.data.allRecommendBlogs);
    } catch (e) {
      navigate(-1);
      console.log(e);
    }
  };

  //!Filtering out the blogs which is displayed
  const filterBlogs = blogs.filter((id) => id.blog_id != blog_id);

  useEffect(() => {
    getBlog();
  }, [blog_id]);

  return (
    <>
      {blog ? (
        <div>
          <div className="p-6 px-32 relative">
            <div className="rounded-2xl h-[26rem] relative">
              <div className="absolute inset-0">
                <img
                  alt="billie"
                  className="rounded-2xl h-full w-full object-cover"
                  src={blog.picture}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80 rounded-2xl"></div>
              </div>
              <div className="absolute flex justify-center items-center bottom-[18%] w-full text-center h-fit ">
                <div className=" w-[45rem]">
                  <p className="text-white text-2xl font-bold uppercase">
                    {blog.title}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex pt-10 ">
              <div className="flex flex-col border-r border-r-black pr-16 w-full">
                <BlogContent blog={blog} />
                <BlogComments blog={blog} />
              </div>
              <div className="w-[40%] pl-6">
                <p className="text-2xl font-semibold mb-4">
                  YOU MIGHT ALSO LIKE THESE
                </p>
                <BlogSuggestions blogs={filterBlogs} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p>hehe</p>
        </div>
      )}
    </>
  );
}
