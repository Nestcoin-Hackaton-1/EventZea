import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { changeNav } from "../reducers/sidebar";
import { EventContext } from "../context/EventContext";

export default function Sidebar() {
  const navState = useSelector((state) => state.sidebar.value);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeNav(false));
  }, []);

  return (
    <div
      className={
        navState === true ? "sidebar animation1" : "sidebar animation2"
      }
    >
      <img
        src="./images/x.svg"
        className="close"
        onClick={() => dispatch(changeNav(!navState))}
      />
      <div className="sidebar-inner">
        <Link to="/check" className="anone">
          <div className="side-item">Event Check</div>
        </Link>
        <Link to="/resell" className="anone">
          <div className="side-item">Resell</div>
        </Link>
        <Link to="/discover" className="anone">
          <div className="side-item">Discover</div>
        </Link>
        <Link to="/event" className="anone">
          <div className="side-item">Create Event</div>
        </Link>
        <Link to="/profile" className="anone">
          <div className="side-item">Profile</div>
        </Link>
        <Link to="/" className="anone">
          <div className="side-item">Home</div>
        </Link>
      </div>
    </div>
  );
}
