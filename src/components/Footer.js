import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer-inner">
        <div> &copy; Team Spartan 2022</div>
        <div className="footer-inner2">
          <div>About</div>
          <div>Terms and Condition</div>
          <Link className="anone1" to="/discover">
            <div>Find Events</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
