import {HIDE_MESSAGE_OVERLAY, SHOW_MESSAGE_OVERLAY} from 'Constants/actionTypes';
import http from 'Utils/http';

export const hideOverlay = () => (dispatch) => {
  dispatch({type: HIDE_MESSAGE_OVERLAY});
};

export const showOverlay = (message) => (dispatch) => {
  dispatch({
    type: SHOW_MESSAGE_OVERLAY,
    data: message
  });
};
