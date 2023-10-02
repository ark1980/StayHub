import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "react-tooltip";
import "./SpotCard.css";
import noPreviewImageUrl from "./no-image.png";
import { removeSpot, updateSpot } from "../../store/spots";
import OpenModalButton from "../OpenModalButton";
import DeleteSpotModal from "./DeleteSpotModal";

import { getSingleSpotReviews } from "../../store/reviews";

const SpotCard = ({ spots, sessionUser }) => {
  const dispatch = useDispatch();


  return (
    <>
      {spots.map((spot) => {
        return (
          <li key={spot.id} className="spot-card">
            <Link
              exact
              to={`/spots/${spot.id}`}
              data-tooltip-id="tooltip"
              data-tooltip-content={spot.name}
              data-tooltip-place="top"
            >
              <img
                className="spotImage"
                src={
                  !spot.previewImage ||
                  spot.previewImage === "image url" ||
                  spot.previewImage === "no preview image found"
                    ? noPreviewImageUrl
                    : spot.previewImage
                }
                alt={`Spot ${spot.id}`}
              />
            </Link>
            <div className="spot-info">
              <div>
                <p className="spot-location">
                  {spot.city}, {spot.state}
                </p>
                <p className="spot-price">${spot.price}.00 Night</p>
              </div>
              <div>
                <p className="avgRating">
                  <i className="fa-solid fa-star"></i>
                  {!spot.avgStarRating ? "New" : parseInt(spot.id)}
                </p>
              </div>
            </div>
            {sessionUser && (
              <div className="delete-update-btn">
                <OpenModalButton
                  buttonText="DELETE"
                  modalComponent={<DeleteSpotModal spot={spot} />}
                  // onClick={() => onDeleteClick}>
                  // spot={spot}
                  // className="primary-btn"
                />
                <button className="primary-btn">
                  <Link className="update-link" to={`/spots/${spot.id}/edit`}>
                    UPDATE
                  </Link>
                </button>
              </div>
            )}
          </li>
        );
      })}
      <Tooltip id="tooltip" />
    </>
  );
};

export default SpotCard;
