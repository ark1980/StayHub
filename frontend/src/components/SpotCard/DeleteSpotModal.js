import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { removeSpot, updateSpot } from "../../store/spots";
import "./SpotCard.css";

const DeleteSpotModal = ({ spot }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const confirmDelete = (e) => {
    e.preventDefault();
    dispatch(removeSpot(spot.id));
    closeModal();
  };
  
  const cancelDelete = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <div className="open-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this spot?</p>
      <button className="primary-btn" id="confirm-delete-btn" onClick={confirmDelete}>
        Yes (Delete Spot)
      </button>
      <button className="primary-btn" onClick={cancelDelete}>
        No (Keep Spot)
      </button>
    </div>
  );
};

export default DeleteSpotModal;
