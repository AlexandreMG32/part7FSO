import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import loginService from "../services/login";
import { setNotification } from "./notificationReducer";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
  },
});

export const { setUser, login } = userSlice.actions;

export const initializeUser = () => {
  return async (dispatch) => {
    const loggedUser = window.localStorage.getItem("loggedUser");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  };
};

export const loginUser = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user));
      dispatch(
        setNotification(
          { message: "Logged in successfully", type: "success" },
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

export const logoutUser = () => {
  return (dispatch) => {
    dispatch(setUser(null));
    window.localStorage.removeItem("loggedUser");
    dispatch(
      setNotification(
        { message: "Logged out successfully", type: "success" },
        5000
      )
    );
  };
};

export default userSlice.reducer;
