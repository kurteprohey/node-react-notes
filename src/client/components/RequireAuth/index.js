import React from 'react';
import {getMe} from 'Actions/account';
import {Button, Modal} from "react-bootstrap";
import {connect} from 'react-redux';

const higherOrderComponent = (WrappedComponent) => {
  class RequireAuth extends React.Component {
    componentDidMount() {
      this._checkAndRedirect();
    }
    componentDidUpdate() {
      this._checkAndRedirect();
    }
    _checkAndRedirect() {
      const { dispatch } = this.props;
      if (this.props.user === false) {
        this.props.history.push('/login');
      }
    }
    render() {
      return (
        <div className="authenticated">
          {this.props.user && <WrappedComponent {...this.props} />}
        </div>
      );
    }
  }

  function mapStateToProps(state) {
    return {
      user: state.account.user
    };
  }

  return connect(
    mapStateToProps
  )(RequireAuth);
};

export default higherOrderComponent;