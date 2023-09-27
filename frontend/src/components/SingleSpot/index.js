import { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSingleSpot } from "../../store/spots";
import noPreviewImageUrl from "./no-image.png";
import SingleSpotReviews from "../SingleSpotReviews";

import "./SingleSpot.css";

const SingleSpot = () => {
  const { spotId } = useParams();

  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots);

  useEffect(() => {
    dispatch(getSingleSpot(spotId));
  }, [dispatch, spotId]);

  const {
    name,
    city,
    state,
    country,
    description,
    price,
    avgStarRating,
    SpotImages,
    User,
    numReviews,
  } = spot;

  if (!spot) {
    return <h1>Loading...</h1>;
  }
  if (!SpotImages) {
    return null;
  }

  if (!spot.avgRating) {
    spot.avgRating = "New";
  }

  if (Number.isInteger(spot.avgRating)) {
    spot.avgRating = spot.avgRating.toFixed(1);
  }

  if (Number.isInteger(spot.price)) {
    spot.price = spot.price.toFixed(2);
  }

  let review;
  let newReview;

  if (spot.numReviews === 1) {
    review = "review";
  }

  if (spot.numReviews === 0) {
    newReview = "Be the first to post a review!";
  }

  return (
    <>
      <h2 className="title">{name}</h2>
      <div className="location">
        <span>{city}, </span>
        <span>{state}, </span>
        <span>{country}</span>
      </div>
      <div className="container">
        <img
          className="img-large"
          src={
            !SpotImages[0] ||
            SpotImages[0].url.length < 10 ||
            SpotImages.length <= 0
              ? noPreviewImageUrl
              : SpotImages[0].url
          }
          alt={name}
        />
        <img
          className="img-small"
          src={
            !SpotImages[1] ||
            SpotImages[1].url.length < 10 ||
            SpotImages.length <= 0
              ? noPreviewImageUrl
              : SpotImages[1].url
          }
          alt={name}
        />
        <img
          className="img-small"
          src={
            !SpotImages[2] ||
            SpotImages[2].url.length < 10 ||
            SpotImages.length <= 0
              ? noPreviewImageUrl
              : SpotImages[2].url
          }
          alt={name}
        />
        <img
          className="img-small"
          src={
            !SpotImages[3] ||
            SpotImages[3].url.length < 10 ||
            SpotImages.length <= 0
              ? noPreviewImageUrl
              : SpotImages[3].url
          }
          alt={name}
        />
        <img
          className="img-small"
          src={
            !SpotImages[4] ||
            SpotImages[4].url.length < 10 ||
            SpotImages.length <= 0
              ? noPreviewImageUrl
              : SpotImages[4].url
          }
          alt={name}
        />
      </div>
      <div className="spot-details">
        <div className="spot-description">
          <h2>
            Hosetd by {User.firstName} {User.lastName}
          </h2>
          <p id="description">{description}</p>
        </div>
        <div className="price-reserve-section">
          <div className="price-review">
            <span>${price} night</span>
            <div className="star-rating-num-reviews">
              <span>
                {!avgStarRating ? "New" : parseFloat(avgStarRating).toFixed(1)}
                <i className="fa-solid fa-star star-rating"></i>
              </span>
              <span>{numReviews} review</span>
            </div>
          </div>
          <button
            className="reserve-btn"
            onClick={() => alert("Feature coming soon!")}
          >
            Reserve
          </button>
        </div>
      </div>
      <hr />
      <div className="spot-reviews">
        <div className="star-rating-num-reviews">
          {!avgStarRating ? "New" : parseFloat(avgStarRating).toFixed(1)}
          <i className="fa-solid fa-star star-rating"></i>
          <span>{numReviews} review</span>
        </div>
        <SingleSpotReviews spot={spot} />
      </div>
    </>
  );
};

export default SingleSpot;
