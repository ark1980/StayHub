import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addReview, getSingleSpotReviews } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import { getSingleSpot } from "../../store/spots";

function PostReview({ user, spot }) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const submitReview = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    // setValidationErrors({});

    const newReview = {
      userId: user.id,
      spotId: spot.id,
      review: comment,
      stars: rating,
    };

    const response = await dispatch(addReview(newReview, spot.id)).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setValidationErrors(data.errors);
        }
      }
    );
    dispatch(getSingleSpotReviews(spot.id));
    dispatch(getSingleSpot(spot.id));

    setHasSubmitted(false);
    closeModal();

    setComment("");
    setRating(0);
    setHasSubmitted(false);
    return null;

    //   closeModal();
    // }
  };

  return (
    <div>
      <h2>How was your stay?</h2>
      <form onSubmit={submitReview}>
        {hasSubmitted && validationErrors.reviews && (
          <div className="error">{validationErrors.reviews}</div>
        )}
        {hasSubmitted && validationErrors.stars && (
          <div className="error">{validationErrors.stars}</div>
        )}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave your review here..."
        />
        <label>
          <input
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            type="range"
            className="range"
            min="1"
            max="5"
          />
          Stars
        </label>
        <button className="primary-btn" type="submit" disabled={comment.length < 10 || rating === 0}>
          Submit Your Review
        </button>
      </form>
    </div>
  );
}

export default PostReview;