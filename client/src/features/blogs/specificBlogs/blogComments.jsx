import React, { useState } from "react";
import billie from "../../../assets/bill.png";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import { postComments } from "../../../services/client/user.service";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function BlogComments(props) {
  const blog = props.blog;
  const [visibleComments, setVisibleComments] = useState(3); // Display initial 3 comments
  const [text, setText] = useState("");

  const showMoreComments = () => {
    setVisibleComments(blog.allComments.length);
  };

  const showLessComments = () => {
    setVisibleComments(3);
  };

  const { id, jwt } = useSelector((state) => state.user);

  const postBlogComments = async () => {
    try {
      const res = await postComments(id, blog.blog, text, jwt);
      console.log(res);
      toast.success(res.data.message);
      setText("");
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center">
        <p className="text-2xl text-violet-950 font-bold">LEAVE A COMMENT</p>
      </div>
      <textarea
        name="text"
        onChange={(e) => setText(e.target.value)}
        className="border-2 h-[10rem] outline-violet-950 flex items-start p-2 rounded-md mt-4"
        placeholder="Write your message here"
        type="text"
      />
      <div className=" flex justify-end mt-4">
        <button
          onClick={postBlogComments}
          className="bg-violet-950 rounded-md font-semibold cursor-pointer hover:bg-violet-950700 p-2 w-fit text-white"
        >
          <p>Send</p>
        </button>
      </div>
      <div>
        <p className="font-semibold text-xl">
          COMMENTS({blog.allComments?.length})
        </p>
        {blog?.allComments && <p className="font-semibold text-gray-400">Be the first one to comment</p>}
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {blog ? (
          blog.allComments?.slice(0, visibleComments).map((comments) => (
            <div
              className="shadow-md border rounded-lg p-6"
              key={comments.comment_id}
            >
              <div className="flex gap-2">
                <div className="w-12 h-12 rounded-full">
                  <img
                    alt="hehe"
                    className="w-full h-full object-cover rounded-full"
                    src={comments.user?.picture}
                  />
                </div>
                <div className="flex flex-col">
                  <p className="font-bold text-violet-950">
                    {comments.user?.user_name}
                  </p>
                  <p className="text-sm font-semibold">{comments.content}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>
            <p className="text-black">No comments</p>
          </div>
        )}
      </div>
      {blog.allComments?.length > 3 && (
        <div className="mt-4 flex justify-end">
          {visibleComments === 3 ? (
            <button
              className="text-white font-semibold hover:bg-violet-950 cursor-pointer p-2 rounded-lg bg-violet-950"
              onClick={showMoreComments}
            >
              <div className="flex items-center gap-2">
                <p> See more comments</p>
                <FiArrowDown />
              </div>
            </button>
          ) : (
            <button
              className="text-white font-semibold hover:bg-violet-950 cursor-pointer p-2 rounded-lg bg-violet-950"
              onClick={showLessComments}
            >
              <div className="flex items-center gap-2">
                <p> See less comments</p>
                <FiArrowUp />
              </div>
            </button>
          )}
        </div>
      )}
    </>
  );
}
