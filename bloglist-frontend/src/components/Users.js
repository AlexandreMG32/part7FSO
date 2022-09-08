import { useEffect, useState } from "react";
import usersService from "../services/users";
import { Link } from "react-router-dom";

const User = ({ user }) => {
  return (
    <tr>
      <td>
        <Link to={user.id}>{user.username}</Link>
      </td>

      <td>{user.blogs.length}</td>
    </tr>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    usersService.getAll().then((response) => setUsers(response));
  }, []);
  console.log(users);

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <User user={user} key={user.id} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
