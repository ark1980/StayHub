import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
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
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
        <NavLink to="/signup">Sign Up</NavLink>
      </li>
    );
  }

  return (
    <header>
      <div className="logo">
      <Link exact to="/">
        <img src={logo} alt="logo" />
      </Link>
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
