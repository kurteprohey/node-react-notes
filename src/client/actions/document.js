import * as constants from 'Constants/actionTypes';
import {API_URL} from 'Constants/config';
import http from 'Utils/http';


export const createItem = (document) => (dispatch) => {
  dispatch({type: constants.LOADING});
  return http(`${API_URL}/documents`, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(document),
    headers: {'Content-Type': 'application/json'}
  })
  .then(response => {
    if(response.ok) {
      return response.json();
    }
    throw new Error('Network response was not ok.');
  })
  .then(data => {
    dispatch({type: constants.CREATE_ITEM_SUCCESS, payload: data});
  })
  .catch(err => {
    dispatch({type: constants.CREATE_ITEM_FAILURE});
  });
};

export const updateItem = (document) => (dispatch) => {
  dispatch({type: constants.LOADING});
  return http(`${API_URL}/documents/${document._id}`, {
    method: 'PUT',
    mode: 'cors',
    body: JSON.stringify(document),
    headers: {'Content-Type': 'application/json'}
  })
  .then(response => {
    if(response.ok) {
      return response.json();
    }
    throw new Error('Network response was not ok.');
  })
  .then(data => {
    dispatch({type: constants.UPDATE_ITEM_SUCCESS, payload: data});
  })
  .catch(err => {
    dispatch({type: constants.UPDATE_ITEM_FAILURE});
  });
};

export const getDocument = (documentId) => (dispatch) => {
  dispatch({type: constants.LOADING});
  let getUrl = documentId ? `${API_URL}/documents/${documentId}` : `${API_URL}/users/workspace`;
  return http(getUrl, {
    method: 'GET',
    mode: 'cors'
  })
  .then(response => {
    if(response.ok) {
      return response.json();
    }
    throw new Error('Network response was not ok.');
  })
  .then(data => {
    dispatch({type: constants.GET_DOCUMENT_SUCCESS, payload: data});
  })
  .catch(err => {
    dispatch({type: constants.GET_DOCUMENT_FAILURE});
  });
}
