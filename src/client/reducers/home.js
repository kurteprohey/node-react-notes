import {GET_DOCUMENT_SUCCESS, CREATE_ITEM_SUCCESS, UPDATE_ITEM_SUCCESS, DELETE_ITEM_SUCCESS} from 'Constants/actionTypes';

const initialState = {
  currentFolder: null
};

export default function home(state = initialState, action) {
  const {type, payload} = action;
  switch (type) {
    case GET_DOCUMENT_SUCCESS:
      return Object.assign({}, state, {currentFolder: payload});
    case CREATE_ITEM_SUCCESS:
      return Object.assign({}, state, {
        currentFolder: {
          self: state.currentFolder.self,
          children: state.currentFolder.children.concat([payload])
        }
      });
    case UPDATE_ITEM_SUCCESS:
      return Object.assign({}, state, {
        currentFolder: {
          self: state.currentFolder.self,
          children: state.currentFolder.children.map(item => {
            return item._id === payload._id ? payload : item;
          })
        }
      });
    case DELETE_ITEM_SUCCESS:
      const deletedId = payload.rootId;
      return Object.assign({}, state, {
        currentFolder: {
          self: state.currentFolder.self,
          children: state.currentFolder.children.filter(item => item._id !== deletedId)
        }
      });
    default:
      return state;
  }
}
