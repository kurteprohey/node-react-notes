import * as constants from 'Constants/actionTypes';

// user possible values
// false => user is not logged in
// undefined => initial state
// any object => user is logged in

const initialState = {
  token: localStorage.getItem('X-AUTH-TOKEN') || null,
  user: undefined
};

export default function account(state = initialState, action) {
  const {type, payload} = action;
  switch (type) {
    case constants.GET_USER_SUCCESS:
      return Object.assign({}, state, {user: payload.user});
    case constants.GET_USER_FAILURE:
      return Object.assign({}, state, {user: false});
    case constants.LOGIN_USER_SUCCESS:
      return Object.assign({}, state, {user: payload});
    case constants.REGISTER_USER_SUCCESS:
      return Object.assign({}, state, {user: payload});
    default:
      return state;
  }
}
