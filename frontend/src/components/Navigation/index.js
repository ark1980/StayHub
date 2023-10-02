import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import logo from "./images/logo.png";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  // let sessionLinks;
  // if (sessionUser) {
  //   sessionLinks = (
  //     <li>
  //       <ProfileButton user={sessionUser} />
  //     </li>
  //   );
  // } else {
  //   sessionLinks = (
  //     <li>
  //       <OpenModalButton
  //         buttonText="Log In"
  //         modalComponent={<LoginFormModal />}
  //       />
  //        <OpenModalButton
  //         buttonText="Sign Up"
  //         modalComponent={<SignupFormModal />}
  //       />
  //     </li>
  //   );
  // }

  return (
    <header className="header">
      <div className="logo">
        <Link exact to="/">
          <img src={logo} alt="logo" />
        </Link>
      </div>
      <nav>
        {sessionUser && (
          <Link className="create-new-spot-link" to="/spots/new">
            Create New Spot
          </Link>
        )}
        <div>
          <ProfileButton user={sessionUser} />
        </div>
      </nav>
    </header>
  );
}

export default Navigation;
