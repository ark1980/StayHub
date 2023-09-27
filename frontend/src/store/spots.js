import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = "spots/GET_ALL_SPOTS";
const SINGLE_SPOT = "spots/SINGLE_SPOT"

// ACTIONS =================================================
const allSpots = (spots) => ({
  type: GET_ALL_SPOTS,
  spots
});

const singleSpot = (spot) => ({
  type: SINGLE_SPOT,
  spot
})

// THUNK ACTIONS =================================================
// export const getAllSpots = () => async (dispatch) => {
//   const res = await fetch('/api/spots');
//   if(res.ok){
//     const spots = await res.json();
//     dispatch(allSpots(spots));
//   }
// };

export const getAllSpots = () => async (dispatch) => {
  const response = await fetch(`/api/spots`);

  if (response.ok) {
    const spots = await response.json();    
    dispatch(allSpots(spots));
  }
};

export const getSingleSpot = (spotId) => async dispatch => {
  const response = await fetch(`/api/spots/${spotId}`)

  if (response.ok) {
    const spot = await response.json()
    dispatch(singleSpot(spot))
  }
}

// REDUCERS =================================================
const initialState = {}

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS:
      return {...state,  ...action.spots }
      case SINGLE_SPOT:
        return {...state, ...action.spot }
    default:
      return state;
  }
}

export default spotsReducer;

