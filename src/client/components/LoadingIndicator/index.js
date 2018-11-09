import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

class LoaderComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {displayTimeout: null};
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoading) {
      this.showOverlay();
    } else {
      this.hideOverlay();
    }
  }
  showOverlay() {
    this.setState({
      displayTimeout: setTimeout(() => {
        ReactDOM.findDOMNode(this).classList.add('shown');
      }, 100)
    });
  }
  hideOverlay() {
    if (this.state.displayTimeout) {
      clearTimeout(this.state.displayTimeout);
      ReactDOM.findDOMNode(this).classList.remove('shown');
    }
  }
  componentWillUnmount() {
    this.hideOverlay();
  }
  render() {
    return <div className="loader-wrapper">
      <div className="async-loader"></div>
    </div>;
  }
}

function mapStateToProps(state) {
  const {common} = state;

  return {
    isLoading: common.isLoading
  };
};

export default connect(
  mapStateToProps
)(LoaderComponent);
