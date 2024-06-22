import React from "react";
import { Link } from "react-router-dom";
import BlogPostsCard from "../../../components/blogs/blogPostsCard";
import wall from "../../../assets/wall.jpg";
import PropTypes from "prop-types";

// Function to shuffle an array in-place using Fisher-Yates algorithm
const shuffleArray = (array) => {
  for (let i = array?.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function BlogSuggestions({ blogs }) {
  const blog = blogs;
  console.log(blogs);
  // Shuffle the blogs array
  const shuffledBlogs = shuffleArray(blog);

  return (
    <div className="grid grid-cols-1 gap-6 h-[60rem]  overflow-hidden overflow-y-auto scrollbar-none scroll-smooth">
      {shuffledBlogs ? (
        shuffledBlogs?.map((blog) => (
          <Link to={`/blogs/${blog.blog_id}`} key={blog.index}>
            <BlogPostsCard
              title={blog?.title}
              blogTag={blog?.blogTag?.blog_tag_name}
              picture={blog?.picture}
              content={blog?.content}
            />
          </Link>
        ))
      ) : (
        <div>
          <p>eheh</p>
        </div>
      )}
    </div>
  );
}

BlogSuggestions.propTypes = {
  blogs: PropTypes.object.isRequired,
};
