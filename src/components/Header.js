import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { changeNav } from "../reducers/sidebar";
import { EventContext } from "../context/EventContext";

export default function Header() {
  const navState = useSelector((state) => state.sidebar.value);
  const dispatch = useDispatch();
  const { connectWallet, currentAccount, disconnectWallet, networkConnected } =
    useContext(EventContext);
  return (
    <div>
      <div className="header">
        <Link to="/" className="anone">
          <div className="logo">EventZea</div>
        </Link>

        <div className="header-inner">
          <div className="network">{networkConnected}</div>
          <button
            className="header-button"
            onClick={
              currentAccount.length === 0 ? connectWallet : disconnectWallet
            }
          >
            {currentAccount.length > 0
              ? currentAccount.slice(0, 5) + "....." + currentAccount.slice(-5)
              : "Connect Wallet"}
          </button>
          <img
            src="./images/menu.svg"
            alt="menu"
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(changeNav(!navState))}
          />
        </div>
      </div>
    </div>
  );
}
