import React from "react";
import { useDispatch } from "react-redux";
import { createBlog } from "../reducers/blogReducer";

const BlogForm = () => {
  const dispatch = useDispatch();

  const addBlog = (event) => {
    event.preventDefault();
    const title = event.target.title.value;
    const author = event.target.author.value;
    const url = event.target.url.value;
    const result = dispatch(createBlog({ title, author, url }));
    if (result) {
      event.target.title.value = "";
      event.target.author.value = "";
      event.target.url.value = "";
    }
  };

  return (
    <div id="blog-form">
      <form onSubmit={addBlog}>
        <div>
          Title
          <input type="text" name="title" placeholder="Title" />
        </div>
        <div>
          Author
          <input type="text" name="author" placeholder="Author" />
        </div>
        <div>
          Url
          <input type="text" name="url" placeholder="Url" />
        </div>
        <button id="submit-form" type="submit">
          Create
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
