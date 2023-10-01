import { csrfFetch } from "./csrf";

const SINGLE_SPOT_REVIEW = "reviews/SINGLE_SPOT_REVIEW";
const DELETE_REVIEW = "reviews/DELETE_REVIEW";

// Actions =============================================
const singleSpotReviews = (reviews) => ({
  type: SINGLE_SPOT_REVIEW,
  reviews,
});

export const deleteReview = (reviewId) => ({
  type: DELETE_REVIEW,
  reviewId,
});

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
  try {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });
    dispatch(deleteReview(reviewId));
  } catch (err) {
    const error = err.json();
    return error;
  }
};

// REDUCERS ============================================
const initialState = {};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case SINGLE_SPOT_REVIEW:
      // const reviewsState = {};
      // const reviewsAction = action.reviews;
      // reviewsAction.Reviews.forEach((review) => {
      //   reviewsState[review.id] = review;
      // });
      // return reviewsState;
      return {
        ...state,
        ...action.reviews.Reviews,
      };
    case DELETE_REVIEW:
      const newState = { ...state };
      delete newState[action.reviewId];
      return newState;
    default:
      return state;
  }
};

export default reviewReducer;
