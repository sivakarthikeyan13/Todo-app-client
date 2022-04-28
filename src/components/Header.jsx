import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import Home from "./Home";
import "./header.css";
import { BiLogOut } from "react-icons/bi";

const Header = (props) => {
  return (
    <nav>
      <div className="div-header">
        <div className="div-text">ToDo List</div>
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
