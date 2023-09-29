import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SpotCard from "../SpotCard";
import { getAllSpots } from "../../store/spots";

import "./SpotsByUser.css";

const SpotsByUser = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const spots = useSelector((state) => state.spots.allSpots.Spots);

  if (!spots || !spots.length) {
    dispatch(getAllSpots());
    return null;
  }

  const spotsUser = spots.filter((spot) => spot.ownerId === sessionUser.id);

  return (
    <>
      <h1>Manage Spots</h1>
      {spotsUser.length ? (
        <ul className="spots-container">
          {spots && <SpotCard spots={spotsUser} sessionUser={sessionUser} />}
        </ul>
      ) : (
        <Link to="/spots/new">Create a New Spot</Link>
      )}
    </>
  );
};

export default SpotsByUser;
