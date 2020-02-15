import React from "react";

// stateless functional component: shortcut sfc
const NavBar = props => {
  return (
    <nav className="navbar navbar-light bg-light">
      <a className="navbar-brand" href="#">
        Navbar{" "}
        <span className="badge badge-pill badge-secondary">
          {props.totalCounterAmt}
        </span>
      </a>
    </nav>
  );
};

export default NavBar;
