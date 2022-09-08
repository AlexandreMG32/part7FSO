import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import userService from "../services/users";

const UserBlogs = () => {
  const id = useParams().id;
  const [user, setUser] = useState({});

  useEffect(() => {
    userService.getUser(id).then((response) => setUser(response));
  }, []);

  if (!user) {
    return null;
  }
  return (
    <div>
      <h1>{user.username}</h1>
      <h2>Added blogs</h2>
      <ul>
        {user.blogs?.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserBlogs;
