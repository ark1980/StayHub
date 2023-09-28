import { useDispatch } from "react-redux";
import { removeSpot } from "../../store/spots";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";



const DeleteSpotModal = ({spot}) =>{
    const dispatch = useDispatch()
    const history = useHistory()
    const {closeModal} = useModal()
    const handleDelete = (e) => {
        e.preventDefault();
        dispatch(removeSpot(spot.id));
        closeModal();
        window.location.reload()
    }
    
    return(
        <div className="delete-spot">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot?</p>
            <button onClick={handleDelete} className="confirm-delete">Yes (Delete Spot)</button>
            <button onClick={(e) => closeModal()} className="cancel-delete">No (Keep Spot)</button>
        </div>
    )
}

export default DeleteSpotModal