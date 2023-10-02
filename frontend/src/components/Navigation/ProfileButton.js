import React, { useState, useEffect, useRef } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

import "./Navigation.css";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    setShowMenu(false);
    history.push("/");
    closeMenu();
  };


  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div>
      <div className="profile-btn">
        <i class="fa-solid fa-circle-user profile-btn" onClick={openMenu}></i>
      </div>
      <div className={ulClassName} ref={ulRef}>
        {user ? (
          <div className="dropdowncontainer">
            <div className="dropdown-items">{user.username}</div>
            <div className="dropdown-items">
              {user.firstName} {user.lastName}
            </div>
            <div className="dropdown-items">{user.email}</div>
            <div className="dropdown-items">
            <NavLink to="/spots/current" onClick={() => closeMenu()}>Manage Spots</NavLink>
            </div>
            <div className="dropdown-items">
              <button className="primary-btn" onClick={logout}>Log Out</button>
            </div>
          </div>
        ) : (
          <div className="dropdowncontainer">
          <div className="dropdown-items">
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
          </div>
          <div className="dropdown-items">
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileButton;
