import React from "react";
import { Link } from "react-router-dom";

const NoMatch = () => {
  return (
    <div style={{ marginLeft: "10px" }}>
      <h2>404 Page</h2>
      <p>
        <Link to="/">Go to Login Page</Link>
      </p>
    </div>
  );
};

export default NoMatch;
