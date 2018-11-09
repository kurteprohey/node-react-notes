import React, { Component } from 'react';
import {connect} from 'react-redux';
import {getMe} from 'Actions/account';
import Routes from './routes';
import {withRouter} from 'react-router-dom';

import ErrorOverlay from 'Components/ErrorOverlay';
import Loader from 'Components/LoadingIndicator';
import './app.scss';

class App extends Component {
  constructor(props) {
    super(props);
    const {dispatch} = this.props;
    dispatch(getMe());
  }
  render() {
    return (
      <div className="container">
        <main>
          <Routes />
        </main>
        <ErrorOverlay />
        <Loader />
      </div>
    );
  }
}
function mapStateToProps() {
  return {};
}
export default withRouter(connect(
  mapStateToProps
)(App));