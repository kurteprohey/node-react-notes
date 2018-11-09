import {LOADING, LOADED, SHOW_MESSAGE_OVERLAY, HIDE_MESSAGE_OVERLAY} from 'Constants/actionTypes';

const defaultState = {
  isLoading: false,
  errorMessage: null
};

let currentLoadingAmount = 0;

export default function common(state = defaultState, action) {
  switch (action.type) {
    case LOADING:
      currentLoadingAmount += 1;
      return {
        ...state,
        isLoading: currentLoadingAmount > 0
      };
    case LOADED:
      currentLoadingAmount -= 1;
      return {
        ...state,
        isLoading: currentLoadingAmount > 0
      };
    case SHOW_MESSAGE_OVERLAY:
      return {
        ...state,
        errorMessage: action.data
      };
    case HIDE_MESSAGE_OVERLAY:
      return {
        ...state,
        errorMessage: null
      };

    default:
      return state;
  }
};
