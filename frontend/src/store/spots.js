import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = "spots/GET_ALL_SPOTS";

// ACTIONS =================================================
const allSpots = (spots) => ({
  type: GET_ALL_SPOTS,
  spots
});

// THUNK ACTIONS =================================================
export const getAllSpots = () => async (dispatch) => {
  const res = await fetch('/api/spots');
  if(res.ok){
    const spots = await res.json();
    dispatch(allSpots(spots));
  }
};

// REDUCERS =================================================
const initialState = {}

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS:
      return {...state, spots: [...action.spots.Spots ]};
    default:
      return state;
  }
}

export default spotsReducer;

