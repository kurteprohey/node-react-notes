import React from 'react';
import {connect} from 'react-redux';
import {Modal, Button} from 'react-bootstrap';
import {hideOverlay} from 'Actions/common';

const MODAL_STYLE = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
    overflow: 'hidden',
  },
  content: {
    borderRadius: 0,
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    width: '400px',
    textAlign: 'center',
    transform: 'translate3d(-50%, -50%, 0)',
    padding: '30px',
  }
};

class ErrorOverlayComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {errorMessage: null};
    this.onOverlayClose = this.onOverlayClose.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({errorMessage: nextProps.errorMessage});
  }
  onOverlayClose(e) {
    e.preventDefault();
    const {dispatch} = this.props;
    dispatch(hideOverlay());
  }
  render() {
    const {errorMessage} = this.state;
    const isDisplay = Boolean(errorMessage);
    return <Modal show={isDisplay} onHide={this.onOverlayClose}>
      <Modal.Header>
        <Modal.Title>Error occured</Modal.Title>
      </Modal.Header>
      <Modal.Body>{errorMessage}</Modal.Body>
      <Modal.Footer>
        <Button onClick={this.onOverlayClose} bsStyle="primary">Got it</Button>
      </Modal.Footer>
    </Modal>
  }
}

function mapStateToProps(state) {
  const {common} = state;

  return {
    errorMessage: common.errorMessage
  };
};

export default connect(
  mapStateToProps
)(ErrorOverlayComponent);