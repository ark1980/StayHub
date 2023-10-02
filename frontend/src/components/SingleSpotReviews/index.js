import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getSingleSpot } from "../../store/spots";
import { getSingleSpotReviews } from "../../store/reviews";
import "./SingleSpotReviews.css";
import OpenModalButton from "../OpenModalButton";
import DeleteReviewModal from "./DeleteReviewModal";
import PostReview from "./PostReview";

const SingleSpotReviews = ({ spot, spotId }) => {
  const dispatch = useDispatch();

  const spotReviews = useSelector((state) => state.reviews.spot.Reviews);
  const sessionUser = useSelector((state) => state.session.user);
  // const spot = useSelector(state => state.spots.singleSpot)

  useEffect(() => {
    dispatch(getSingleSpotReviews(spotId));
  }, [dispatch, spotId]);

  if (!spotReviews) {
    return null;
  }

  if (!sessionUser) {
    return null;
  }

  const userReview = spotReviews.find(
    (review) => review.userId === sessionUser.id
  );

  return (
    <>
      {sessionUser && !userReview && spot.ownerId !== sessionUser.id ? (
        <OpenModalButton
          buttonText="Post Your Review"
          modalComponent={<PostReview user={sessionUser} spot={spot} />}
        />
      ) : null}
      <div className="review-section">
        {spotReviews.length === 0 &&
        sessionUser !== null &&
        sessionUser.id !== spot.ownerId ? (
          <div>Be the first to post a review!</div>
        ) : (
          spotReviews
            .map((review) => (
              <div key={review.id} className="review">
                <div>{review?.User?.firstName}</div>
                <div>
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </div>
                <div>{review.review}</div>
                {sessionUser.id === review.userId ? (
                  <OpenModalButton
                    buttonText="Delete"
                    modalComponent={
                      <DeleteReviewModal review={review} spot={spot} />
                    }
                  />
                ) : null}
              </div>
            ))
            .reverse()
        )}
      </div>
    </>
  );// );
};

export default SingleSpotReviews;
