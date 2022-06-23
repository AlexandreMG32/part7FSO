import { createSlice } from "@reduxjs/toolkit";

let timeoutId;

const notificationSlice = createSlice({
  name: "notifications",
  initialState: null,
  reducers: {
    createNotification(state, action) {
      const notification = action.payload;
      return notification;
    },
    removeNotification() {
      return null;
    },
  },
});

export const { createNotification, removeNotification } =
  notificationSlice.actions;

export const setNotification = (content, time) => {
  return (dispatch) => {
    dispatch(createNotification(content));
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      dispatch(removeNotification());
    }, time);
  };
};

export default notificationSlice.reducer;
