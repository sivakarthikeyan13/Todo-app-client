import React from "react";
import { NavLink, withRouter } from "react-router-dom";

import "./header.css";
import { BiLogOut } from "react-icons/bi";

const Header = () => {
  return (
    <nav>
      <div className="div-header">
        <p className="div-text">ToDo List</p>
        {/* <div className="div-navbar">
          <BiLogOut
            // className="button-header"
            style={{ cursor: "pointer" }}
            size={32}
            onClick={() => {
              localStorage.clear();
              props.history.replace("/");
            }}
          />
        </div> */}
      </div>
    </nav>
  );
};

export default withRouter(Header);
