import {combineReducers} from 'redux';
import account from './account';
import home from './home';
import common from './common';

const rootReducer = combineReducers({
  account,
  home,
  common
});

export default rootReducer;