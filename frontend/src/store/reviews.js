import { csrfFetch } from "./csrf";

const SINGLE_SPOT_REVIEW = "reviews/SINGLE_SPOT_REVIEW";

// Actions =============================================
const singleSpotReviews = (reviews) => ({
  type: SINGLE_SPOT_REVIEW,
  reviews,
});

// THUNK ACTIONS =======================================
export const getSingleSpotReviews = (spotId) => async (dispatch) => {
  const res = await fetch(`/api/spots/${spotId}/reviews`);
  if (res.ok) {
    const reviews = await res.json();
    dispatch(singleSpotReviews(reviews));
  } else {
    const errors = res.json();
    return errors;
  }
};

// REDUCERS ============================================
const initialState = {};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case SINGLE_SPOT_REVIEW:
      const reviewsState = {};
      const reviewsAction = action.reviews;
      reviewsAction.Reviews.forEach((review) => {
        reviewsState[review.id] = review;
      });
      return reviewsState;
    default:
      return state;
  }
};

export default reviewReducer;
