import { useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Info from "./components/Info";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import { useDispatch, useSelector } from "react-redux";
import { initializeBlogs } from "./reducers/blogReducer";
import { initializeUser, loginUser, logoutUser } from "./reducers/userReducer";

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);

  const blogFormRef = useRef();

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
    <div>
      <Info />
      <h2>blogs</h2>
      <div>
        {user.name} logged in
        <button onClick={logout}>logout</button>
      </div>
      <br />
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

export default App;
