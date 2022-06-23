import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import { setNotification } from "./notificationReducer";

const blogsSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    addBlog(state, action) {
      const blog = action.payload;
      state.push(blog);
    },
    removeBlog(state, action) {
      return state.filter((b) => b.id !== action.payload.id);
    },
    setBlogs(state, action) {
      return action.payload;
    },
    createLike(state, action) {
      return state.map((blog) =>
        blog.id !== action.payload.id
          ? blog
          : { ...blog, likes: action.payload.likes }
      );
    },
  },
});

export const { addBlog, removeBlog, createLike, setBlogs } = blogsSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (content) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.addBlog(content);
      dispatch(addBlog(newBlog));
      dispatch(
        setNotification(
          { message: `${newBlog.title} added`, type: "success" },
          5000
        )
      );
    } catch (exception) {
      dispatch(
        setNotification(
          {
            message: exception.response.data.error,
            type: "error",
          },
          5000
        )
      );
    }
  };
};

export const deleteBlog = (blogToDelete) => {
  return async (dispatch) => {
    try {
      if (window.confirm(`Delete ${blogToDelete.title} ?`)) {
        await blogService.deleteBlog(blogToDelete.id);
        dispatch(removeBlog(blogToDelete));
        dispatch(
          setNotification(
            {
              message: `${blogToDelete.title} eliminado`,
              type: "error",
            },
            5000
          )
        );
      }
    } catch (err) {
      dispatch(
        setNotification(
          { message: "Something went wrong", type: "error" },
          5000
        )
      );
    }
  };
};

export const likeBlog = (blog) => {
  const blogEditted = {
    user: blog.user.id,
    likes: blog.likes + 1,
    author: blog.author,
    title: blog.title,
    url: blog.url,
  };
  return async (dispatch) => {
    try {
      const blogUpdated = await blogService.likeBlog(blogEditted, blog.id);
      dispatch(createLike(blogUpdated));
    } catch (e) {
      dispatch(
        setNotification(
          { message: "Something went wrong", type: "error" },
          5000
        )
      );
    }
  };
};

export default blogsSlice.reducer;
