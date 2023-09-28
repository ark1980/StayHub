import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getSingleSpot } from "../../store/spots";
import { getSingleSpotReviews } from "../../store/reviews";
import "./SingleSpotReviews.css";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteReviewModal from "./DeleteReviewModal";

const SingleSpotReviews = ({ spot }) => {
  const reviewsList = useSelector((state) =>
    state.reviews ? state.reviews : []
  );

  const reviews = Object.values(reviewsList);
  const sessionUser = useSelector((state) => state.session.user);
  const [reviewBtn, setReviewBtn] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      spot.ownerId === sessionUser?.id ||
      reviews.some((review) => review.userId === sessionUser?.id) ||
      !sessionUser
    ) {
      setReviewBtn(false);
    } else {
      setReviewBtn(true);
    }
  }, [spot.ownerId, reviewBtn, sessionUser, reviews.length]);

  useEffect(() => {
    dispatch(getSingleSpotReviews(spot.id));
    dispatch(getSingleSpot(spot.id));
  }, [dispatch, spot.id, sessionUser]);

  if (!reviews.length) {
    return (
      <div className="first-review">
        {spot.numReviews < 1 && <p style={{"margin-top": "10px"}}>Be the first to post a review!</p>}
        {spot.numReviews < 1 && reviewBtn && (
          <button className="review-btn">Create a Review</button>
        )}
      </div>
    );
  }

  const getYear = (reviewDate) => {
    let date = new Date(reviewDate);
    return date.getFullYear();
  };

  const getMonth = (reviewDate) => {
    return new Date(reviewDate).toLocaleString("default", { month: "long" });
  };

  let sortedReviews = reviews.sort(
    (dateA, dateB) => new Date(dateB.createdAt) - new Date(dateA.createdAt)
  );

  return (
    <div>
      <ul>
        {sortedReviews.map((review) => (
          <li className="review">
            <p className="reviewer-name">
              {review.User.firstName} {review.User.lastName}
            </p>
            <p className="review-date">
              {getMonth(review.createdAt)} {getYear(review.createdAt)}
            </p>
            <p>{review.review}</p>
            {review.userId === sessionUser?.id && (
              <button className="primary-btn">
                <OpenModalMenuItem
                  itemText="Delete"
                  modalComponent={<DeleteReviewModal review={review} />}
                />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SingleSpotReviews;
