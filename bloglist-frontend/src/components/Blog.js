import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteBlog, likeBlog } from "../reducers/blogReducer";
import { Link } from "react-router-dom";

const Blog = ({ blog }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [visible, setVisibility] = useState(false);

  const userVisible = {
    display: user.username === blog.user.username ? "" : "none",
  };

  const like = () => {
    dispatch(likeBlog(blog));
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleVisibility = () => {
    setVisibility(!visible);
  };

  if (!visible) {
    return (
      <div className="blog" style={blogStyle}>
        <Link to={"/blogs/" + blog.id}>{blog.title}</Link> {blog.author}
        <button className="view-details-button" onClick={toggleVisibility}>
          view
        </button>
      </div>
    );
  }

  return (
    <div className="blog" style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleVisibility}>hide</button>
      <div>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button className="like-button" onClick={like}>
            like
          </button>
        </div>
        <div>{blog.user.name}</div>
        <div style={userVisible}>
          <button onClick={() => dispatch(deleteBlog(blog))}>remove</button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
