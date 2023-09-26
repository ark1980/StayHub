import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import "./SpotCard.css";
import noPreviewImageUrl from "./no-image.png";

const SpotCard = ({ spots }) => {
  return (
    <>
      <Tooltip id="tooltip" />
      {spots.map(
        ({ id, previewImage, city, state, price, avgRating, name }) => {
          console.log(
            "🚀 ~ file: index.js:11 ~ SpotCard ~ avgRating:",
            avgRating
          );

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
                    !previewImage || previewImage.length < 10
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
                  <p id="avgRating">
                    <i className="fa-solid fa-star"></i>
                    {avgRating === undefined
                      ? "New"
                      : parseFloat(avgRating).toFixed(1)}
                  </p>
                </div>
              </div>
            </li>
          );
        }
      )}
    </>
  );
};

export default SpotCard;
