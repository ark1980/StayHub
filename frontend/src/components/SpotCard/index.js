import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Tooltip } from "react-tooltip";
import "./SpotCard.css";
import noPreviewImageUrl from "./no-image.png";
import { removeSpot, updateSpot } from "../../store/spots";
import { useModal } from "../../context/Modal";

const SpotCard = ({ spots, sessionUser }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  return (
    <>
      {spots.map(
        ({ id, previewImage, city, state, price, avgRating, name }) => {
          return (
            <li key={id} className="spot-card">
              <Link
                exact
                to={`/spots/${id}`}
                data-tooltip-id="tooltip"
                data-tooltip-content={name}
                data-tooltip-place="top"
              >
                <img
                  className="spotImage"
                  src={
                    !previewImage ||
                    previewImage === "image url" ||
                    previewImage === "no preview image found"
                      ? noPreviewImageUrl
                      : previewImage
                  }
                  alt={`Spot ${id}`}
                />
              </Link>
              <div className="spot-info">
                <div>
                  <p className="spot-location">
                    {city}, {state}
                  </p>
                  <p className="spot-price">${price}.00 Night</p>
                </div>
                <div>
                  <p className="avgRating">
                    <i className="fa-solid fa-star"></i>
                    {!avgRating ? "New" : parseFloat(avgRating).toFixed(1)}
                  </p>
                </div>
              </div>
              {sessionUser && (
                <div className="delete-update-btn">
                  <button
                    className="primary-btn"
                    onClick={() => {
                      dispatch(removeSpot(id));
                      // force reloading --- need to remove
                      // window.location.reload();
                    }}
                  >
                    DELETE
                  </button>
                  <button className="primary-btn">UPDATE</button>
                </div>
              )}
            </li>
          );
        }
      )}
      <Tooltip id="tooltip" />
    </>
  );
};

export default SpotCard;
