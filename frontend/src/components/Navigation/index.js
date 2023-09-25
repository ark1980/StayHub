import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import logo from './images/logo.png';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <li>
        <NavLink to="/login">Log In</NavLink>
        <NavLink to="/signup">Sign Up</NavLink>
      </li>
    );
  }

  return (
    <header>
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>
      <nav>
        <ul>
          <li>
            <NavLink exact to="/">
              Home
            </NavLink>
          </li>
          {isLoaded && sessionLinks}
        </ul>
      </nav>
    </header>
  );
}

export default Navigation;
