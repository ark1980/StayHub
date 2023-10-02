import { csrfFetch } from "./csrf";

const SINGLE_SPOT_REVIEW = "reviews/SINGLE_SPOT_REVIEW";
const DELETE_REVIEW = "review/DELETE_REVIEW";
const ADD_REVIEW = "review/ADD_REVIEW";

// Actions =============================================
const singleSpotReviews = (reviews) => ({
  type: SINGLE_SPOT_REVIEW,
  reviews,
});

const deleteReview = (reviewId) => ({
  type: DELETE_REVIEW,
  reviewId,
});

const postReview = (review) => ({
  type: ADD_REVIEW,
  review
})

// THUNK ACTIONS =======================================
export const getSingleSpotReviews = (spotId) => async (dispatch) => {
  const res = await fetch(`/api/spots/${spotId}/reviews`);
  if (res.ok) {
    const reviews = await res.json();
    dispatch(singleSpotReviews(reviews));
  } else {
    const errors = res.json();
    dispatch(singleSpotReviews({Reviews: []}));
    return errors;
  }
};

export const deleteSingleReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(deleteReview(reviewId));
  } else {
    const errors = response.json();
    return errors;
  }
};

export const addReview = (review, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    body: JSON.stringify(review),
  });

  if (response.ok) {
    const newReview = await response.json();
    dispatch(postReview(newReview));
    return newReview;
  } else {
    const errors = await response.json();
    return errors;
  }
}

// REDUCERS ============================================
const initialState = {
  spot: {},
};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case SINGLE_SPOT_REVIEW:
      return {...state,
        spot: action.reviews,
      };
    case DELETE_REVIEW:
      const newState = { ...state };
      delete newState[action.reviewId];
      return newState;
    case ADD_REVIEW:
      return {
        ...state,
        spot: { Reviews: [...state.spot.Reviews, action.review] },
      };
    default:
      return state;
  }
};

export default reviewReducer;
