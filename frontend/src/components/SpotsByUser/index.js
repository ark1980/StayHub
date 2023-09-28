import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SpotCard from "../SpotCard";
import { getAllSpotsbyUser } from "../../store/spots";
import noPreviewImageUrl from "./no-image.png";

import "./SpotsByUser.css";

const SpotsByUser = () => {
  const sessionUser = useSelector((state) => state.session.user);

  const dispatch = useDispatch();
  const spots = useSelector((state) => {
    return state.spots.allSpots;
  });

  useEffect(() => {
    dispatch(getAllSpotsbyUser());
  }, [dispatch]);

  if (!spots) {
    return null;
  }

  const spotsArr = Object.values(spots);

  return (
    <>
      <h1>Manage Spots</h1>
      <ul className="spots-container">
        {spots && <SpotCard spots={spotsArr} sessionUser={sessionUser} />}
      </ul>
    </>
  );
};

export default SpotsByUser;
