import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteSingleReview } from "../../store/reviews";

const DeleteReviewModal = ({ review }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(deleteSingleReview(review.id)).then(closeModal());
    window.location.reload();
  };

  return (
    <div className="delete-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this review?</p>
      <button onClick={handleDelete} className="confirm-delete">
        Yes! I'm sure
      </button>
      <button onClick={(e) => closeModal()} className="cancel-delete">
        No! Don't do it
      </button>
    </div>
  );
};

export default DeleteReviewModal;
