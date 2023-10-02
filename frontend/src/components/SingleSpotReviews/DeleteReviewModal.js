import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteSingleReview, getSingleSpotReviews } from "../../store/reviews";
import { getSingleSpot } from "../../store/spots";

const DeleteReviewModal = ({ review, spot }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [exists, setExists] = useState(true);

  const confirmDelete = (e) => {
    e.preventDefault();
    dispatch(deleteSingleReview(review.id))
    .then(closeModal);
    setExists(false);
  };


  const handleCancel = (e) => {
    e.preventDefault();
    closeModal();
  }

  dispatch(getSingleSpot(spot.id));
  dispatch(getSingleSpotReviews(spot.id));

  return (
    <div className="open-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this review?</p>
      <button onClick={confirmDelete} className="primary-btn" id="confirm-delete-btn">
        Yes! I'm sure
      </button>
      <button onClick={handleCancel} className="primary-btn">
        No! Don't do it
      </button>
    </div>
  );
};

export default DeleteReviewModal;
