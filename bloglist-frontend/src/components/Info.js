import React from "react";
import { useSelector } from "react-redux";

const Info = () => {
  let notification = useSelector((state) => state.notifications);

  if (notification !== null) {
    let classes = "";
    if (notification.type !== null) {
      classes = `notification ${notification.type}`;
    }

    return <div className={classes}>{notification.message}</div>;
  }
};

export default Info;
