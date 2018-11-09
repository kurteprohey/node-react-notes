import {LOADED, LOADING} from 'Constants/actionTypes';

const ACTION_START = 'START';
const ACTION_SUCCESS = 'SUCCESS';
const ACTION_FAILURE = 'FAILURE';

export const loaderMiddleware = (store) => (next) => (action) => {
  // if (action.type.indexOf(ACTION_START) !== -1) {
  //   store.dispatch({type: constants.LOADING});
  // }
  if (action.type.indexOf([ACTION_SUCCESS]) !== -1 || action.type.indexOf(ACTION_FAILURE) !== -1) {
    store.dispatch({type: LOADED});
  }
  next(action);
};
