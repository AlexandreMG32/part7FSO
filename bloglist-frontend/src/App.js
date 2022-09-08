import { useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Info from "./components/Info";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import Users from "./components/Users";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { initializeBlogs } from "./reducers/blogReducer";
import { initializeUser, loginUser, logoutUser } from "./reducers/userReducer";
import UserBlogs from "./components/UserBlogs";
import { useParams } from "react-router-dom";

const BlogDetail = ({ blogs }) => {
  const id = useParams().id;
  const blog = blogs.find((a) => a.id === id);

  if (!blog) {
    return null;
  }
  return (
    <div>
      <div>
        <h1>{blog.title}</h1>
        <a href={blog.url}>{blog.url}</a>
        <div>{blog.likes} likes</div>
        <div>Added by {blog.user.name}</div>
      </div>
    </div>
  );
};

const Blogs = () => {
  const blogs = useSelector((state) => state.blogs);
  const blogFormRef = useRef();

  return (
    <div>
      <Togglable buttonLabel="new Blog" ref={blogFormRef}>
        <BlogForm />
      </Togglable>
      <br />
      {blogs
        .slice()
        .sort((a, b) => {
          return b.likes - a.likes;
        })
        .map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
    </div>
  );
};

const App = () => {
  const blogs = useSelector((state) => state.blogs);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    dispatch(loginUser(username, password));
    event.target.username.value = "";
    event.target.password.value = "";
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  if (user === null) {
    return (
      <div>
        <Info />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            Username
            <input id="username" type="text" name="Username" />
          </div>
          <div>
            Password
            <input id="password" type="password" name="Password" />
          </div>
          <button id="login-button" type="submit">
            login
          </button>
        </form>
      </div>
    );
  }

  return (
    <Router>
      <div>
        <Info />
        <h2>blogs</h2>
        <div>
          {user.name} logged in
          <button onClick={logout}>logout</button>
        </div>
        <br />
        <Routes>
          <Route path="/" element={<Blogs />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserBlogs />} />
          <Route path="/blogs/:id" element={<BlogDetail blogs={blogs} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
