import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = "spots/GET_ALL_SPOTS";
const SINGLE_SPOT = "spots/SINGLE_SPOT";
const ALL_SPOTS_BY_USER = "spots/ALL_SPOTS_BY_USER";
const DELETE_SPOT = "spots/DELETE_SPOT";
const CREATE_SPOT = "spots/CREATE_SPOT";
const ADD_PHOTOS = "spots/ADD_PHOTOS";
const UPDATE_SPOT = "spots/UPDATE_SPOT";

// ACTIONS =================================================
const allSpots = (spots) => ({
  type: GET_ALL_SPOTS,
  spots,
});

const singleSpot = (spot) => ({
  type: SINGLE_SPOT,
  spot,
});

const allSpotsByUser = (spots) => ({
  type: ALL_SPOTS_BY_USER,
  spots,
});

const deleteSpot = (spotId) => ({
  type: DELETE_SPOT,
  spotId,
});

const createSpot = (spot) => ({
  type: CREATE_SPOT,
  spot,
});

const addPhotos = (payload) => ({
  type: ADD_PHOTOS,
  payload,
});

const editSpot = (spot) => ({
  type: UPDATE_SPOT,
  spot,
});

export const getAllSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");

  if (response.ok) {
    const spots = await response.json();
    dispatch(allSpots(spots));
    return spots;
  } else {
    const errors = await response.json();
    return errors;
  }
};

export const getSingleSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);

  if (response.ok) {
    const spot = await response.json();
    dispatch(singleSpot(spot));
    return spot;
  } else {
    const errors = await response.json();
    return errors;
  }
};

export const getAllSpotsbyUser = () => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/current`);

  if (response.ok) {
    const spots = await response.json();
    dispatch(allSpotsByUser(spots));
  }
};

export const removeSpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
    });
    dispatch(deleteSpot(spotId));
  } catch (err) {
    const error = err.json();
    return error;
  }
};

export const createNewSpot = (newSpot) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newSpot),
  });

  if (response.ok) {
    const spotDetails = await response.json();
    dispatch(createSpot(spotDetails));

    return spotDetails;
  }
};

export const addPhotosToSpot = (photosArr, spotId) => async (dispatch) => {
  for (let photo of photosArr) {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(photo),
    });

    if (response.ok) {
      const details = await response.json();
      dispatch(addPhotos(details));
      // return details;
    }
  }
};

export const updateSpot = (newSpot, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newSpot),
  });

  if (response.ok) {
    const spotDetails = await response.json();
    dispatch(editSpot(spotDetails));
    return spotDetails;
  }
};

// REDUCERS =================================================
const initialState = {
  allSpots: {},
  singleSpot: {},
};

const spotsReducer = (state = initialState, action) => {
  // const newSpots = { ...state.allSpots.Spots };
  switch (action.type) {
    case GET_ALL_SPOTS:
      return { ...state, allSpots: action.spots };
    case SINGLE_SPOT:
      return { ...state, singleSpot: action.spot };
    case DELETE_SPOT:
      const newSpots = { ...state.allSpots.Spots };
      delete newSpots[action.spotId];
      return {
        ...state,
        allSpots: newSpots,
      };
    case CREATE_SPOT:
      return { ...state, ...action.spot };
    case ADD_PHOTOS:
      return { ...state };
      case UPDATE_SPOT:
        return { ...state, singleSpot: action.spot };
    default:
      return state;
  }
};

export default spotsReducer;
