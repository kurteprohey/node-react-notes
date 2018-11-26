import * as constants from 'Constants/actionTypes';
import {API_URL} from 'Constants/config';
import http from 'Utils/http';

export const loginUser = (email, password) => (dispatch) => {
  dispatch({type: constants.LOADING});
  const promise = http(`${API_URL}/users/login`, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({email, password}),
    headers: {'Content-Type': 'application/json'}
  })
  .then(response => {
    if(response.ok) {
      localStorage.setItem('X-AUTH-TOKEN', response.headers.get('x-auth'));
      return response.json();
    }
    throw new Error('Network response was not ok.');
  });
  promise.then(user => {
    dispatch({type: constants.LOGIN_USER_SUCCESS, payload: user});
  });
  promise.catch((err) => {
    dispatch({type: constants.LOGIN_USER_FAILURE});
    dispatch({
      type: constants.SHOW_MESSAGE_OVERLAY,
      data: 'Error: invalid credentials'
    });
  })
  return promise;
};

export const registerUser = (email, password) => (dispatch) => {
  dispatch({type: constants.LOADING});
  const promise = http(`${API_URL}/users`, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({email, password}),
    headers: {'Content-Type': 'application/json'}
  })
  .then(response => {
    if(response.ok) {
      localStorage.setItem('X-AUTH-TOKEN', response.headers.get('x-auth'));
      return response.json();
    }
    throw new Error('Network response was not ok.');
  })
  promise.then(user => {
    dispatch({type: constants.REGISTER_USER_SUCCESS, payload: user});
  })
  .catch((err) => {
    dispatch({type: constants.LOGIN_USER_FAILURE});
    dispatch({
      type: constants.SHOW_MESSAGE_OVERLAY,
      data: 'Error: invalid credentials'
    });
  })
  return promise;
}

export const getMe = () => (dispatch) => {
  dispatch({type: constants.LOADING});
  const promise = http(`${API_URL}/users/me`, {
    method: 'GET',
    mode: 'cors'
  })
  .then(response => {
    if(response.ok) {
      return response.json();
    }
    throw new Error('Network response was not ok.');
  });

  promise
    .then(user => {
      dispatch({type: constants.GET_USER_SUCCESS, payload: user});
    })
    .catch((err) => {
      dispatch({type: constants.GET_USER_FAILURE});
    });
  return promise;
}

export const logout = () => (dispatch) => {
  dispatch({type: constants.LOADING});
  const promise = http(`${API_URL}/users/me/token`, {
    method: 'DELETE',
    mode: 'cors'
  })
  .then(response => {
    if(response.ok) {
      return response.json();
    }
    throw new Error('Network response was not ok.');
  });

  promise
    .then(user => {
      localStorage.removeItem('X-AUTH-TOKEN');
      dispatch({type: constants.LOGOUT_USER_SUCCESS});
    })
    .catch((err) => {
      dispatch({type: constants.LOGOUT_USER_FAILURE});
    });
  return promise;
};
